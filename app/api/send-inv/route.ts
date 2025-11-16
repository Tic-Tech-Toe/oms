import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    // 0) Read body
    const { orderId, customerNumber, fileName, fileData, customerName } =
      await req.json();

    if (!orderId || !customerNumber || !fileName || !fileData) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1) Read & validate token from header
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

    // 3) Fetch user WhatsApp API secrets from Firestore
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userDoc.data();
    const whatsapp = user?.connections?.whatsapp;

    if (!whatsapp?.connected) {
      return NextResponse.json(
        { error: "WhatsApp not connected for this user" },
        { status: 400 }
      );
    }

    // Extract user-specific secrets
    const WHATSAPP_PHONE_ID = whatsapp["whatsapp-phone-id"];
    const WHATSAPP_API_SECRET = whatsapp["whatsapp-api-secret"];
    const TEMPLATE_NAME = whatsapp["invoice-template"] || "purchase_receipt_3";

    // 4) Upload PDF document to WhatsApp media API
    const uploadUrl = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/media`;

    const base64Data = fileData.split(",")[1];
    const pdfBuffer = Buffer.from(base64Data, "base64");
    const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });

    const formData = new FormData();
    formData.append("file", pdfBlob, fileName);
    formData.append("messaging_product", "whatsapp");

    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_SECRET}`,
      },
      body: formData,
    });

    const uploadResult = await uploadRes.json();
    if (!uploadRes.ok) {
      return NextResponse.json(
        { success: false, message: uploadResult.error?.message },
        { status: uploadRes.status }
      );
    }

    const documentId = uploadResult.id;

    // 5) Send WhatsApp Template With Document
    const sendUrl = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to: customerNumber,
      type: "template",
      template: {
        name: TEMPLATE_NAME,
        language: { code: "en_US" },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "document",
                document: { id: documentId, filename: fileName },
              },
            ],
          },
          {
            type: "body",
            parameters: [{ type: "text", text: customerName || "Customer" }],
          },
        ],
      },
    };

    const sendRes = await fetch(sendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const sendResult = await sendRes.json();
    if (!sendRes.ok) {
      return NextResponse.json(
        { success: false, message: sendResult.error?.message },
        { status: sendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invoice sent successfully",
      data: sendResult,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
