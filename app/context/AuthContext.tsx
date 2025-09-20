"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/app/config/firebase";
import { useRouter } from "next/navigation";

// Define the shape of your Firestore user document
interface UserDocType {
  displayName?: string;
  email?: string;
  company?: string;
  whatsappSecret?: string;
  rewardPercentage?: number;
  createdAt?: any; // Firestore Timestamp type can be more specific
  // Add any other fields you have in your user documents
}

interface AuthContextType {
  user: User | null;
  userDoc: UserDocType | null; // Add the userDoc to the context
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userDoc: null, // Initial value for userDoc
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDocType | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Listener for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      // We don't set loading to false here, as we still need to fetch the Firestore data
    });
    return () => unsubscribe();
  }, []);

  // Listener for Firestore user document changes
  useEffect(() => {
    let unsubscribeFromFirestore = () => {};

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setLoading(true); // Start loading state for Firestore data

      unsubscribeFromFirestore = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserDoc(docSnap.data() as UserDocType);
        } else {
          setUserDoc(null);
        }
        setLoading(false); // End loading state when data is fetched
      }, (error) => {
        console.error("Error fetching user document:", error);
        setUserDoc(null);
        setLoading(false); // End loading state even on error
      });
    } else {
      // If no user is logged in, clear the userDoc state
      setUserDoc(null);
      setLoading(false);
    }

    // Cleanup function to detach the listener
    return () => unsubscribeFromFirestore();
  }, [user]); // This effect runs whenever the `user` (from Firebase Auth) changes

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);

    const token = await userCredential.user.getIdToken();
    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    return userCredential;
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // setUser and userDoc states are handled by the useEffect listeners
      await fetch("/api/logout", { method: "POST" });
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userDoc, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};