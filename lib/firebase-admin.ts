// lib/firebase-admin.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore(); // <-- Add this

    // // This is an example of what your file might look like.
    // import admin from "firebase-admin";

    // // Vercel deployment uses environment variables.
    // // The key is stored as a JSON string and must be parsed.
    // const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    // if (!admin.apps.length) {
    //   admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    //   });
    // }

    // const adminDb = admin.firestore();
    // const adminAuth = admin.auth();

    // export { adminDb, adminAuth };
    

