"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "@/app/config/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// ✅ Define the shape of AuthContext
interface AuthContextType {
  user: Record<string, any> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ✅ Create Context with a default value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

// ✅ Define Props for the Provider
interface AuthProviderProps {
  children: ReactNode;
}

// ✅ Fetch user data from Firestore & update if needed
export const fetchUserData = async (user: User) => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    let profilePic = user.photoURL || null; // From Firebase Auth

    if (userSnap.exists()) {
      const existingData = userSnap.data();
      profilePic = existingData.profilePic || profilePic; // Prefer Firestore pic

      // ✅ Only update Firestore if profilePic is missing or outdated
      if (!existingData.profilePic || existingData.profilePic !== profilePic) {
        await setDoc(userDocRef, { profilePic }, { merge: true });
      }

      return { ...existingData, profilePic };
    } else {
      console.log("New user detected. Creating profile...");
      const newUserData = {
        displayName: user.displayName || "",
        email: user.email || "",
        profilePic: profilePic || "default-avatar-url", // ✅ Fallback avatar
      };
      await setDoc(userDocRef, newUserData);
      return newUserData;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};


// ✅ AuthProvider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = await fetchUserData(currentUser);
        if (userData) {
          setUser({ uid: currentUser.uid, email: currentUser.email, ...userData });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await fetchUserData(userCredential.user);

      if (userData) {
        setUser({ uid: userCredential.user.uid, email: userCredential.user.email, ...userData });
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    // Optional: Refresh the page (React Router should handle it automatically)
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
