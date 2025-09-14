// app/api/send-track/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phoneNumber, orderId, eta, customerName,publicLink } = await req.json();

    console.table({ phoneNumber, orderId, eta });

    if (!phoneNumber || !orderId || !eta) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build tracking link (local for now, production later)
    // const baseUrl = "http://localhost:3000";
    const trackingLink = publicLink;

    // WhatsApp API URL
    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    // Template payload
    const data = {
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
              { type: "text", text: customerName }, // Tracking ID
              { type: "text", text: eta }, // ETA
            ],
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              { type: "text", text: trackingLink }, // Our link
            ],
          },
        ],
      },
    };

    // Send to WhatsApp
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
  } catch (error) {
    console.error("Error in send-track:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
