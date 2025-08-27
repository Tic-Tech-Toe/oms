// app/api/user/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export async function GET(req: Request) {
  try {
    const db = getFirestore();
    const sessionCookie = req.headers.get("cookie")?.match(/__session=([^;]+)/)?.[1];

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await getAuth().verifySessionCookie(sessionCookie, true);

    const userDoc = await db.collection("users").doc(decoded.uid).get();
    return NextResponse.json(userDoc.data());
  } catch (err) {
    console.error("User fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 403 });
  }
}
