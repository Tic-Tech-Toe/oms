// app/api/send-track/route.ts

import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    // 0) Read request JSON
    const { phoneNumber, orderId, eta, customerName, publicLink } =
      await req.json();

    if (!phoneNumber || !orderId || !eta) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1) Get token from header
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

    // 2) Verify token
    const decoded = await adminAuth.verifyIdToken(token);

    // 3) Fetch user doc to get WhatsApp secrets
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = userDoc.data();
    const whatsapp = user?.connections?.whatsapp;

    if (!whatsapp?.connected) {
      return NextResponse.json(
        { error: "WhatsApp not connected for this user" },
        { status: 400 }
      );
    }

    // Extract WA credentials
    const WHATSAPP_PHONE_ID = whatsapp["whatsapp-phone-id"];
    const WHATSAPP_API_SECRET = whatsapp["whatsapp-api-secret"];

    // Build link
    const trackingLink = publicLink;

    // 4) WhatsApp template payload
    const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "template",
      template: {
        name: "delivery_update_3",
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: customerName },
              { type: "text", text: eta },
            ],
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              { type: "text", text: trackingLink },
            ],
          },
        ],
      },
    };

    // 5) Send WhatsApp message
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("WhatsApp error:", result);
      return NextResponse.json(
        {
          success: false,
          message: result.error?.message || "Failed to send tracking link",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tracking link sent successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error in send-track:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
