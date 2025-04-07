import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextRequest } from "next/server";

// Only initialize once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get("__session")?.value;
    if (!token) return null;

    const decodedToken = await getAuth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}
