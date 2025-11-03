"use client";

import { create } from "zustand";
import { auth } from "@/app/config/firebase";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

type subscription.status = "free" | "monthly" | "yearly" | null;

interface AuthState {
  user: User | null;
  loading: boolean;
  subscription.status: subscription.status;
  subscriptionEnd: Date | null;

  // actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setSubscription: (status: subscription.status, end?: Date | null) => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  subscription.status: null,
  subscriptionEnd: null,

  // ✅ Auth methods
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Optional: create a session cookie
    const token = await userCredential.user.getIdToken();
    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    set({ user: userCredential.user });
  },

  logout: async () => {
    await fetch("/api/logout", { method: "POST" });
    await signOut(auth);
    set({ user: null, subscription.status: null, subscriptionEnd: null });
  },

  setSubscription: (status, end = null) =>
    set({ subscription.status: status, subscriptionEnd: end }),

  initAuth: () => {
    // ✅ runs once, keeps store in sync with Firebase
    onAuthStateChanged(auth, (firebaseUser) => {
      set({ user: firebaseUser, loading: false });
    });
  },
}));
