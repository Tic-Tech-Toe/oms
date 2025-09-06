// app/api/send-invoice/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId, customerNumber, fileName, fileData } = await req.json();

    if (!orderId || !customerNumber || !fileName || !fileData) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Upload file to WhatsApp Media API
    const uploadUrl = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/media`;

    // Convert base64 to Buffer
    const base64Data = fileData.split(",")[1]; // remove data:application/pdf;base64, prefix
    const pdfBuffer = Buffer.from(base64Data, "base64");

    
    // Create Blob with correct MIME type
    const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });

    const formData = new FormData();
    formData.append("file", pdfBlob, fileName);
    formData.append("messaging_product", "whatsapp");

    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_SECRET}`,
      },
      body: formData,
    });

    const uploadResult = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error("Media upload error:", uploadResult);
      return NextResponse.json(
        { success: false, message: uploadResult.error?.message || "Failed to upload document" },
        { status: uploadRes.status }
      );
    }

    const documentId = uploadResult.id;

    // 2. Send the uploaded document to customer
    const sendUrl = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    const messagePayload = {
      messaging_product: "whatsapp",
      to: customerNumber,
      type: "document",
      document: {
        id: documentId,
        filename: fileName,
      },
    };

    const sendRes = await fetch(sendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    });

    const sendResult = await sendRes.json();

    if (!sendRes.ok) {
      console.error("Send message error:", sendResult);
      return NextResponse.json(
        { success: false, message: sendResult.error?.message || "Failed to send invoice" },
        { status: sendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invoice sent successfully via WhatsApp",
      data: sendResult,
    });
  } catch (err) {
    console.error("Send invoice error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
