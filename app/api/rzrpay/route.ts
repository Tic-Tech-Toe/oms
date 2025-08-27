// /app/api/rzrpay/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Body:", body);
    const { receiptId, amount, customer } = body;

    if (!receiptId || !amount || !customer) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create payment link
    const paymentLink = await razorpay.paymentLink.create({
      amount, // paise (₹1 = 100 paise)
      currency: "INR",
      accept_partial: false,
      description: `Payment for receipt ${receiptId}`,
      customer: {
        name: customer.name,
        email: customer.email,
        contact: customer.contact,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      reference_id: receiptId,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      callback_method: "get",
    });

    return NextResponse.json({
      success: true,
      paymentLinkId: paymentLink.id,
      paymentLinkUrl: paymentLink.short_url,
      status: paymentLink.status,
    });
  } catch (error: any) {
    console.error("Error creating payment link:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment link" },
      { status: 500 }
    );
  }
}
