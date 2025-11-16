import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // 0) Read the estimate_number
    const { searchParams } = new URL(req.url);
    const estimateNumber = searchParams.get("estimate_number");

    if (!estimateNumber) {
      return NextResponse.json(
        { error: "estimate_number is required" },
        { status: 400 }
      );
    }

    // 1) GET TOKEN FROM HEADER
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // 2) VERIFY TOKEN
    const decoded = await adminAuth.verifyIdToken(token);

    // 3) FETCH USER DATA
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = userDoc.data();
    const zoho = user?.connections?.zoho;

    if (!zoho?.connected) {
      return NextResponse.json(
        { error: "Zoho not connected for this user" },
        { status: 400 }
      );
    }

    const CLIENT_ID = zoho["zoho-client-id"];
    const CLIENT_SECRET = zoho["zoho-client-secret"];
    const REFRESH_TOKEN = zoho["zoho-refresh-token"];
    const ORG_ID = zoho["zoho-org-id"];
    const API_DOMAIN = "https://www.zohoapis.in";

    // 4) Refresh access token
    const tokenRes = await fetch(`https://accounts.zoho.in/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: REFRESH_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "Failed to refresh token", details: tokenData },
        { status: 401 }
      );
    }

    const accessToken = tokenData.access_token;

    // 5) Get all estimates
    const listRes = await fetch(
      `${API_DOMAIN}/books/v3/estimates?organization_id=${ORG_ID}`,
      {
        method: "GET",
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      }
    );

    const listData = await listRes.json();
    if (!listRes.ok || !listData.estimates) {
      return NextResponse.json(
        { error: "Could not retrieve estimates", details: listData },
        { status: 404 }
      );
    }

    // 6) Find match
    const match = listData.estimates.find((e: any) =>
      e.estimate_number
        ?.toLowerCase()
        .includes(estimateNumber.toLowerCase())
    );

    if (!match) {
      return NextResponse.json(
        { error: "No matching estimate found" },
        { status: 404 }
      );
    }

    const foundEstimateId = match.estimate_id;

    // 7) Fetch estimate details
    const estimateRes = await fetch(
      `${API_DOMAIN}/books/v3/estimates/${foundEstimateId}?organization_id=${ORG_ID}`,
      {
        method: "GET",
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      }
    );

    const estimateData = await estimateRes.json();
    if (!estimateRes.ok || !estimateData.estimate) {
      return NextResponse.json(
        { error: "Failed to fetch estimate", details: estimateData },
        { status: estimateRes.status }
      );
    }

    const est = estimateData.estimate;
    const contactPerson = est.contact_persons_details?.[0] || {};

    return NextResponse.json(
      {
        contact_person_name: `${contactPerson.first_name || ""} ${
          contactPerson.last_name || ""
        }`.trim(),
        contact_number: contactPerson.phone || "",
        total_amount: est.total,
        items: est.line_items.map((item: any) => ({
          item_name: item.name,
          rate: item.rate,
          quantity: item.quantity,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
