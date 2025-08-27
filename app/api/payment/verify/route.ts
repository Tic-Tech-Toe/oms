// /app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id, razorpay_payment_link_status, razorpay_signature } = await req.json();

    const body = razorpay_payment_link_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // ✅ Verified, update DB
    // Example: updateUserSubscription(receiptId, "monthly", new Date(...))

    return NextResponse.json({ success: true, message: "Payment verified and subscription updated" });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
