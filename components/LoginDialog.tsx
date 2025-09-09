"use client";

import React, { useEffect, useState } from "react";
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
import { Button } from "./ui/button"; // ShadCN Button
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/config/firebase";
import { fetchUserData } from "@/utils/user/fetchUseData";
import { MagicCard } from "./magicui/magic-card";
import { useRouteChange } from "@/app/context/RouteChangeContext";
import { useAuth } from "@/app/context/AuthContext";

const LoginDialog = () => {
  const { user, login, loading: authLoading } = useAuth();
  const router = useRouter();
  const theme = useTheme().theme;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setRouteLoading } = useRouteChange();

const handleEmailLogin = async () => {
  try {
    setRouteLoading(true);
    setError("");

    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCred.user.getIdToken();

    // 1️⃣ Call login API
    const loginRes = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      credentials: "include", // ✅ ensure cookies are saved
    });

    if (!loginRes.ok) {
      throw new Error("Login API failed");
    }

    // 2️⃣ Directly fetch user data (skip subscription check for now)
    const userData = await fetchUserData(userCred.user);

    // 3️⃣ Route based on role
    if (userData?.role === "admin") {
      router.push("/admin/invite");
    } else {
      router.push("/orders");
    }

  } catch (err) {
    console.error(err);
    setError("Login failed. Check credentials.");
  } finally {
    setRouteLoading(false);
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

  useEffect((  ) => {
    fetchUserData(user).then((data) => {
      if (data?.role === "admin") {
        router.push("/admin/invite");
      } else if (data?.role === "member") {
        router.push("/orders");
      } else {
        setError("Unauthorized user.");
      }
    }).catch((err) => {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data.");
    });
  },[user,router])
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black/80 text-white hover:scale-[1.02] transition-all duration-200 rounded-full px-6 py-2 backdrop-blur-sm shadow-md hover:shadow-lg">
          Login
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-md">
        <Card className="bg-white/5 dark:bg-black/30  shadow-2xl border border-white/10 rounded-[20px] overflow-hidden">
          <MagicCard
            gradientColor={theme === "dark" ? "#3c3c3c" : "#f4f4f4"}
            className="p-6 rounded-4xl"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight text-dark-background dark:text-white">
                Welcome to <span className="text-light-primary font-clash">Shiptrack</span> 👋
              </CardTitle>
              <CardDescription className="text-gray-400">
                Use your email/password to log in
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
                  className="bg-white/10 border-white/20  placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20  placeholder:text-white/40"
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
            </CardFooter>
          </MagicCard>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
