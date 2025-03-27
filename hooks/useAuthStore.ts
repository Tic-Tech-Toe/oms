// import { auth } from "@/app/config/firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { create } from "zustand";
// // import { auth, signInWithEmailAndPassword } from "";

// interface AuthState {
//   isAuthenticated: boolean;
//   user: any;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   isAuthenticated: false,
//   user: null,
//   login: async (email, password) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       set({ isAuthenticated: true, user: userCredential.user });
//       console.log("User details:", userCredential.user); 
//       console.log("User details:", auth.currentUser); 
//     } catch (error) {
//       console.error("Login failed:", error);
//       throw error; // Re-throw error to handle it in the component
//     }
//   },
//   logout: () => {
//     set({ isAuthenticated: false, user: null });
//     auth.signOut();
//   },
// }));


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
    setUser(userCredential.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return { user, loading, login, logout };
}
