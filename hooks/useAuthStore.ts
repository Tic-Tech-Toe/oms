

import { useState, useEffect } from "react";
import { auth } from "@/app/config/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";

// ✅ Custom Hook for Authentication
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // setUser(userCredential.user);
  
    // 🔐 Create a secure session cookie (optional, only if you're using sessions)
    const token = await userCredential.user.getIdToken();
    await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  };
  

  const logout = async () => {
    try {
      // Clear session cookie on the server
      await fetch('/api/logout', { method: 'POST' });
  
      // Sign out from Firebase
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  

  return { user, loading, login, logout };
}
