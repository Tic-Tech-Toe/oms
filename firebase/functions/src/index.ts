// firebase/functions/src/index.ts
//@ts-nocheck
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK if not already done
if (admin.apps.length === 0) {
    admin.initializeApp();
}

const db = admin.firestore();

export const createPublicOrder = functions.https.onCall(async (data, context) => {
    // This is the correct way to check for authentication on a Callable function
    if (!context?.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.'
        );
    }

    // The data object is correctly received as the first argument
    const { userId, orderId, shareKey } = data;

    // Validate the input data
    if (!userId || !orderId || !shareKey) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with a user ID, order ID, and share key.'
        );
    }

    try {
        const orderRef = db.collection('users').doc(userId).collection('orders').doc(orderId);
        
        // 1. Create a new document in the public_orders collection
        const publicOrderRef = db.collection('public_orders').doc(shareKey);
        await publicOrderRef.set({
            orderPath: orderRef.path,
            shareKey: shareKey,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            userId: userId,
        });
        
        // 2. Update the main order document with the share key
        await orderRef.update({
            shareKey: shareKey,
        });

        return { success: true, message: 'Public order created successfully.' };

    } catch (error) {
        console.error('Error creating public order:', error);
        throw new functions.https.HttpsError(
            'unknown',
            'Failed to create public order.'
        );
    }
});