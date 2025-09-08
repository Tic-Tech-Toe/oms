"use server";

import { sendImageToWhatsapp } from "@/utils/sendImageToWhatsapp";

export async function sendBroadcast({
  phoneNumber,
  templateName,
  file,
}: {
  phoneNumber: string[];
  templateName: string;
  file: File;
}) {
  //  Upload image once
  const imageUploadResult = await sendImageToWhatsapp(file);

  if (!imageUploadResult.success) {
    return {
      success: false,
      message: imageUploadResult.message,
      status: imageUploadResult.status,
    };
  }

  const mediaId = imageUploadResult.mediaId;

  //  Send template to each contact individually
  const results: {
    number: string;
    success: boolean;
    status: number;
    message: string;
    response?: any;
  }[] = [];

  for (const number of phoneNumber) {
    const payload = {
      messaging_product: "whatsapp",
      to: number,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "image",
                image: { id: mediaId },
              },
            ],
          },
        ],
      },
    };

    try {
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_API_SECRET}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      results.push({
        number,
        success: response.ok,
        status: response.status,
        message: response.ok ? "Sent successfully" : result?.error?.message || "Failed",
        response: result,
      });
    } catch (error) {
      console.error(`Error sending to ${number}:`, error);
      results.push({
        number,
        success: false,
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  return {
    success: results.every(r => r.success),
    mediaId,
    results,
  };
}
