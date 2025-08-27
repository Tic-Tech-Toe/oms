import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const estimateNumber = searchParams.get("estimate_number");

    if (!estimateNumber) {
      return NextResponse.json(
        { success: false, message: "estimate_number is required" },
        { status: 400 }
      );
    }

    const CLIENT_ID = process.env.ZOHO_CLIENT_ID!;
    const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!;
    const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN!;
    const ORG_ID = process.env.ZOHO_ORG_ID!;
    const API_DOMAIN = process.env.ZOHO_API_DOMAIN!;

    // Step 1: Refresh access token
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

    // Step 2: Fetch all estimates
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

    // Step 3: Find estimate with partial number match
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

    // Step 4: Fetch estimate details
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

    // Step 5: Build final response
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
