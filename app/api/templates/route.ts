import { NextResponse } from "next/server";

export async function GET() {
  const wabaID = process.env.WBA_ID; // WhatsApp Business Account ID
 const url = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}?fields=id,display_phone_number,verified_name`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_SECRET}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json(
        { success: true, templates: result.data },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.error?.message || "Failed to fetch templates",
        },
        { status: response.status }
      );
    }
  } catch (error: any) {
    console.error("Error fetching WhatsApp templates:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}