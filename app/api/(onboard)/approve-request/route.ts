// /app/api/approve-request/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { sendPasswordSetupEmail } from "@/lib/email";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const auth = getAuth();
const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const { requestId } = await req.json();

    const requestSnap = await db
      .collection("access_requests")
      .doc(requestId)
      .get();
    if (!requestSnap.exists) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const request = requestSnap.data();
    console.table({request})

    // 1. Create Firebase Auth user
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email: request?.email,
        displayName: request?.name,
        emailVerified: false,
        phoneNumber: "+91"+request?.phone,
        disabled: false,
      });
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        userRecord = await auth.getUserByEmail(request?.email);
      } else {
        throw error;
      }
    }

    // 2. Generate password reset link
    const resetLink = await auth.generatePasswordResetLink(request.email);
    //console.log(request.email);
    // 3. Send email with reset link
    await sendPasswordSetupEmail({
      email: request.email,
      name: request.name,
      link: resetLink,
    });

    // 4. Add to users collection
    await db
      .collection("users")
      .doc(userRecord.uid)
      .set({
        name: request.name,
        email: request.email,
        company: request.company || "",
        phone: request.phone || "",
        role: "member",
        connections:[{"whatsapp":false},{"zoho":false},{"google":false}],
        subscriptionStatus: "trialing", // NEW
        trialEndsAt: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days from now
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    // 5. Delete request
    await db.collection("access_requests").doc(requestId).delete();

    return NextResponse.json({ message: "User approved and setup link sent." });
  } catch (err) {
    console.error("Approval error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
