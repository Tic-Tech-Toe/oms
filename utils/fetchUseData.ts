// utils/fetchUserData.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/config/firebase"; // your Firestore instance
import { User } from "firebase/auth";

export const fetchUserData = async (user: User) => {
  if (!user) return null;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return {
      ...userSnap.data(), // should include profilePic
    };
  }

  return null;
};
