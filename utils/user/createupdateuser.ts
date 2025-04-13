// utils/updateUserDetailsIfExists.ts
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/config/firebase";

type PartialUserInfo = {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export const updateUserDetailsIfExists = async ({
  email,
  displayName,
  photoURL,
}: PartialUserInfo) => {
  if (!email) return;

  const userRef = doc(db, "users", email.toLowerCase());

  // Only update if user exists
  await updateDoc(userRef, {
    displayName: displayName || "",
    profilePic: photoURL || null,
  });
};
