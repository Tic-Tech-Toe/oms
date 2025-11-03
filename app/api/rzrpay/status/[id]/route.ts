import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id; // This comes from [id] in the folder name

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Payment Link ID is missing" },
      { status: 400 }
    );
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const paymentLink = await razorpay.paymentLink.fetch(id);

    return NextResponse.json({
      success: true,
      paid: paymentLink.status === "paid",
      status: paymentLink.status,
    });
  } catch (error: any) {
    console.error("Error fetching payment link status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payment status" },
      { status: 500 }
    );
  }
}

