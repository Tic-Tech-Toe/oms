"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/app/config/firebase";
import { useAuth } from "@/app/context/AuthContext";
import { fetchUserData } from "@/utils/fetchUseData";
import {updateUserDetailsIfExists } from "@/utils/createupdateuser";
import { MagicCard } from "./magicui/magic-card";
import { FaGoogle } from "react-icons/fa";

const LoginDialog = () => {
  const { login } = useAuth();
  const router = useRouter();
  const theme = useTheme().theme;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    try {
      setLoading(true);
      setError("");
      setResetSent(false);

      const userCred = await login(email, password);
      const token = await userCred.user.getIdToken();

      await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const userData = await fetchUserData(userCred.user);
      router.push(userData?.isAdmin ? "/invite" : "/orders");
    } catch (err) {
      console.error(err);
      setError("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
  
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const googleUser = userCred.user;
  
      if (!googleUser.email) {
        setError("No email found on Google account.");
        return;
      }
  
      // 🔍 Check Firestore for existing admin user
      const res = await fetch(`/api/check-user?email=${googleUser.email}`);
      const { exists, role } = await res.json();
  
      if (!exists || role !== "admin") {
        await googleUser.delete();
        await auth.signOut();
        setError("Access denied. Admins only.");
        return;
      }
  
      // 🔐 Get Firebase token and log in to backend session
      const token = await googleUser.getIdToken();
      await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
  
      // ✅ Go to admin dashboard
      router.push("/admin/invite");
    } catch (err) {
      console.error("❌ Google login failed:", err);
      setError("Google login failed.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handlePasswordReset = async () => {
    if (!email) return setError("Please enter your email first.");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      console.error(err);
      setError("Couldn't send reset email.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black/80 text-white hover:scale-[1.02] transition-all duration-200 rounded-full px-6 py-2 backdrop-blur-sm shadow-md hover:shadow-lg">
          Login
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-md">
        <Card className="bg-white/5 dark:bg-black/30 backdrop-blur-md shadow-2xl border border-white/10 rounded-[20px] overflow-hidden">
          <MagicCard
            // borderRadius="20px"
            gradientColor={theme === "dark" ? "#3c3c3c" : "#f4f4f4"}
            className="p-6 rounded-4xl"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight text-dark-background dark:text-white">
                Welcome to <span className="text-light-primary font-clash">Shiptrack</span>  👋
              </CardTitle>
              <CardDescription className="text-gray-400">
                Use your email/password or Google to log in
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}

              {resetSent && (
                <div className="text-green-400 text-sm text-center">
                  Reset email sent.
                </div>
              )}

              <button
                onClick={handlePasswordReset}
                className="text-sm text-blue-400 hover:underline transition-all text-left"
              >
                Forgot Password?
              </button>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 mt-4">
              <Button
                onClick={handleEmailLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
              >
                <span>
                    
                <FaGoogle size={10} />
                </span>
                Sign In as Admin
              </Button>
            </CardFooter>
          </MagicCard>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
