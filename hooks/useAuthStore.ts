import { auth } from "@/app/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { create } from "zustand";
// import { auth, signInWithEmailAndPassword } from "";

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ isAuthenticated: true, user: userCredential.user });
      console.log("User details:", userCredential.user); 
      console.log("User details:", auth.currentUser); 
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw error to handle it in the component
    }
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
    auth.signOut();
  },
}));
