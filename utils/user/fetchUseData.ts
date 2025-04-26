import { db } from "@/app/config/firebase";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const fetchUserData = async (user: User) => {
  if (!user) return null;

  // console.log(user)

  try {
    const userRef = doc(db, "users", user.uid);
    // console.log(userRef)
    const userSnap = await getDoc(userRef);
    // console.log(userSnap)
    // console.log("Firestore document exists:", userSnap.exists()); // Log to check if document exists

    if (userSnap.exists()) {
      return {
        ...userSnap.data(),
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
