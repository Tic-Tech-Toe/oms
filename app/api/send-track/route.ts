// app/api/send-tracking-link/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phoneNumber, orderId, eta, trackingId } = await req.json();

    if (!phoneNumber || !orderId || !eta || !trackingId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    const data = {
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "template",
      template: {
        name: "delivery_update_3", // must exist in WhatsApp Business template library
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: orderId }, // e.g., "12345"
              { type: "text", text: eta }, // e.g., "Tomorrow 5PM"
            ],
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              { type: "text", text: trackingId }, // passed to template’s dynamic URL
            ],
          },
        ],
      },
    };

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
      return NextResponse.json(
        { success: false, message: result.error?.message || "Failed to send tracking link" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tracking link sent successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error sending WhatsApp tracking link:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
