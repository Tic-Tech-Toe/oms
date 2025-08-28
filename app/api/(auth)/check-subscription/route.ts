import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, cert, getApps } from "firebase-admin/app";

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // ✅ snake_case
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();
const auth = getAuth();

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("__session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    // ✅ Use Firebase Admin to decode/verify token
    const decoded = await auth.verifyIdToken(session);

    // Get user from Firebase Auth
    const user = await auth.getUser(decoded.uid);

    // Fetch user document
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = userDoc.data();
    console.log("User Data:", data);
    const now = Date.now();

    // Trial check
    if (
      data?.subscriptionStatus === "trialing" &&
      data.trialEndsAt &&
      data.trialEndsAt < now
    ) {
      return NextResponse.json({ status: "expired" });
    }

    if (data?.subscriptionStatus === "inactive") {
      return NextResponse.json({ status: "inactive" });
    }

    return NextResponse.json({ status: "active" });
  } catch (err) {
    console.error("Subscription check error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
