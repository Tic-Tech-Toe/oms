// utils/updateUserDetailsIfExists.ts
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/config/firebase";

type PartialUserInfo = {
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  whatsappSecret?: string; // 
};

export const updateUserDetailsIfExists = async ({
  email,
  displayName,
  photoURL,
  whatsappSecret,
}: PartialUserInfo) => {
  if (!email) return;

  const userRef = doc(db, "users", email.toLowerCase());

  const updatePayload: Record<string, any> = {};

  if (displayName !== undefined) updatePayload.displayName = displayName || "";
  if (photoURL !== undefined) updatePayload.profilePic = photoURL || null;
  if (whatsappSecret !== undefined)
    updatePayload.whatsappSecret = whatsappSecret;

  await updateDoc(userRef, updatePayload);
};
