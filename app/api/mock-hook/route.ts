// app/api/mock-hook/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Mocked WhatsApp webhook payload
  const mockData = {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "552519631271225",
        changes: [
          {
            value: {
              messaging_product: "whatsapp",
              metadata: {
                display_phone_number: "919339013386",
                phone_number_id: "506114192590854",
              },
              contacts: [
                {
                  profile: { name: "Rizz" },
                  wa_id: "919635901369",
                },
              ],
              messages: [
                {
                  from: "919635901369",
                  id: "wamid.HBgMOTE5NjM1OTAxMzY5FQIAEhggQUM0NEE4NEQ4QTE3MEI0RDZFMkRCODEwRTIwODJBRUIA",
                  timestamp: "1758936010",
                  text: { body: "Hi" },
                  type: "text",
                },
              ],
            },
            field: "messages",
          },
        ],
      },
    ],
  };

  return NextResponse.json(mockData);
}
