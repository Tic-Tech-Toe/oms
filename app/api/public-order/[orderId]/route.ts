// app/api/public-order/[orderId]/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Missing orderId" },
        { status: 400 }
      );
    }

    // Search across all users for this orderId
    const snapshot = await adminDb
      .collectionGroup("orders")
      .where("id", "==", orderId)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const order = doc.data();

    // Only expose safe fields (no internal secrets)
    const safeOrder = {
      id: doc.id,
      invoiceNumber: order.invoiceNumber,
      status: order.status,
      customer: {
        name: order.customer?.name,
        whatsappNumber: order.customer?.whatsappNumber,
      },
      orderDate: order.orderDate,
      trackingUrl: order.trackingUrl,
      totalAmount: order.totalAmount,
      items: order.items,
    };

    return NextResponse.json({ success: true, order: safeOrder });
  } catch (err) {
    console.error("Public order fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
