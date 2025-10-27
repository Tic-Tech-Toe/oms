// /pages/api/webhook/whatsapp.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // STEP 1: Handle verification (Meta setup)
  if (req.method === "GET") {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified ✅");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).end("Forbidden");
    }
  }

  // STEP 2: Handle incoming messages
  if (req.method === "POST") {
    try {
      const body = req.body;

      if (!body.entry?.[0]?.changes?.[0]?.value?.messages) {
        return res.status(200).send("No messages");
      }

      const value = body.entry[0].changes[0].value;
      const message = value.messages[0];
      const contact = value.contacts?.[0];

      const userPhone = contact.wa_id;
      const userName = contact.profile?.name || "Unknown";
      const text = message.text?.body || "";
      const messageId = message.id;
      const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString();

      // Save in Firestore
      await admin
        .firestore()
        .collection("chats")
        .doc(userPhone)
        .set(
          {
            userName,
            phoneNumber: userPhone,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

      await admin
        .firestore()
        .collection("chats")
        .doc(userPhone)
        .collection("messages")
        .doc(messageId)
        .set({
          sender: "user",
          text,
          timestamp,
        });

      console.log(`💬 Message from ${userName} (${userPhone}): ${text}`);
      return res.status(200).send("Message stored ✅");
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(500).send("Error processing message");
    }
  }

  res.status(405).end();
}
