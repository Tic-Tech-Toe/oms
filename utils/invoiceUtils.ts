// In a new utility file, e.g., utils/firebaseUtils.ts
import { db } from "@/app/config/firebase";
import { doc, runTransaction, getDoc, updateDoc } from "firebase/firestore";
import { format } from "date-fns";

export const generateUniqueInvoiceNumber = async (userId) => {
  const counterRef = doc(db, "users", userId, "settings", "invoiceCounter");

  try {
    const newInvoiceNumber = await runTransaction(db, async (transaction) => {
      // 1. Read the current counter value within the transaction
      const counterDoc = await transaction.get(counterRef);
      const prefix = "INV-";
      const datePart = format(new Date(), "yyyyMM");
      let nextNumber;

      if (!counterDoc.exists()) {
        // If the counter doesn't exist, create it and start at 1
        transaction.set(counterRef, { lastNumber: 1, lastMonth: datePart });
        nextNumber = 1;
      } else {
        const data = counterDoc.data();
        // 2. Check if it's a new month to reset the counter
        if (data.lastMonth !== datePart) {
          nextNumber = 1;
          transaction.update(counterRef, { lastNumber: 1, lastMonth: datePart });
        } else {
          // 3. Increment the counter and update it
          nextNumber = data.lastNumber + 1;
          transaction.update(counterRef, { lastNumber: nextNumber });
        }
      }

      const formattedNumber = String(nextNumber).padStart(4, "0");
      return `${prefix}${datePart}-${formattedNumber}`;
    });

    return newInvoiceNumber;
  } catch (error) {
    console.error("❌ Transaction failed: ", error);
    throw error;
  }
};