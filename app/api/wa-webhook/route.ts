import type { NextApiRequest, NextApiResponse } from "next";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN; // choose yourself

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // ✅ Verification
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Verification failed");
    }
  } else if (req.method === "POST") {
    // ✅ Incoming message
    console.log("Webhook event:", JSON.stringify(req.body, null, 2));

    // Example: Notify frontend (via socket or DB)
    // For now just return 200
    return res.status(200).send("EVENT_RECEIVED");
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
