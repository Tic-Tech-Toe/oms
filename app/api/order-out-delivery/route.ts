// app/api/order-out-delivery/route.ts

import { sendOrderArrivingMessage } from "@/app/services/whatsapp/sendMsg";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { phoneNumber, customerName, deliveryWindow } = await req.json();
  //console.log("Received payload:", { phoneNumber, customerName, deliveryWindow });
  // Validate incoming data
  if (!phoneNumber || !customerName || !deliveryWindow) {
    return NextResponse.json(
      {
        success: false,
        message: "phoneNumber, customerName, and delivery Window are required",
      },
      { status: 400 }
    );
  }

  try {
    // Call the sendOrderArrivingMessage function
    const response = await sendOrderArrivingMessage(
      phoneNumber,
      customerName,
      deliveryWindow
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error handling order-arriving request:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
