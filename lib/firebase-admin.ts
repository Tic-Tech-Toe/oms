import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

function initializeFirebaseAdminApp() {
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
}

initializeFirebaseAdminApp();

const adminAuth = getAuth();
const adminDb = getFirestore();

export { adminAuth, adminDb };
