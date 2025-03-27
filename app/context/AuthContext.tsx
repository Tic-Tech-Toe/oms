"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "@/app/config/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // ✅ Firestore methods

// ✅ Define the shape of AuthContext
interface AuthContextType {
  user: Record<string, any> | null; // 🔥 No need to extend User
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

// ✅ AuthProvider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid); // Reference Firestore document
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        // console.log("User Data : ", userSnap.data())
        return userSnap.data(); // ✅ Return Firestore user data
      } else {
        console.log("No user data found in Firestore.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = await fetchUserData(currentUser.uid);
        // console.log("USer Data : ", userData)
        setUser(userData ? { uid: currentUser.uid, email: currentUser.email, ...userData } : null); // ✅ Merge Firebase Auth + Firestore Data
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userData = await fetchUserData(userCredential.user.uid); // ✅ Fetch Firestore user data
    setUser(userData ? { uid: userCredential.user.uid, email: userCredential.user.email, ...userData } : null);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    window.location.href="/";
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
