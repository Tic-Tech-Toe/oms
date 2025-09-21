// app/api/public-order/[shareKey]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: { shareKey: string } }
) {
  try {
    const { shareKey } = params;
    //console.log("Share key:", shareKey, typeof shareKey);

    if (!shareKey) {
      return NextResponse.json(
        { success: false, message: "Missing share key" },
        { status: 400 }
      );
    }

    // 🔎 Fetch the order using the shareKey
    const snapshot = await adminDb
      .collectionGroup("orders")
      .where("shareKey", "==", shareKey)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Order not found or not public" },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const order = doc.data();

    // ✅ Return only safe, public fields
    return NextResponse.json({
      success: true,
      order: {
        id: doc.id,
        invoiceNumber: order.invoiceNumber,
        status: order.status,
        customer: {
          name: order.customer?.name,
          whatsappNumber: order.customer?.whatsappNumber,
        },
        orderDate: order.orderDate,
        trackingLink: order.trackingLink, // Note: Use trackingLink, not trackingUrl
        totalAmount: order.totalAmount,
        items: order.items,
        timeline: order.timeline,
      },
    });
  } catch (err) {
    console.error("Public order fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
