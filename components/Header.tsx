//@ts-nocheck

"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import ThemeSwitch from "./ThemeSwitch";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "./ui/card";
import { MagicCard } from "./magicui/magic-card";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { fetchUserData, useAuth } from "@/app/context/AuthContext";
import { auth, db } from "@/app/config/firebase";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, collection, query, where } from "firebase/firestore";

const Header = () => {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const theme = String(useTheme());
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setResetSent(false);
  
    try {
      await login(email, password); // From useAuth()
      router.replace("/orders");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Enter your email to reset your password.");
      return;
    }

    try {
      // ✅ Check if the user exists in Firebase Authentication
      const userRef = doc(db, "users", email);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("This email is not registered. Please check and try again.");
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      setError("Failed to send reset email. Check if the email is correct.");
    }
  };

  return (
    <header className="flex justify-between py-4 px-2 gap-2 md:gap-0 md:px-24 items-center bg-transparent">
      <Link href={"/"}>
        <h1 className="md:text-3xl text-2xl  font-clash">ShipTrack</h1>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeSwitch />

        {user ? (
          <Button className="bg-red-500 text-white hover:scale-110 transition-all duration-400" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-dark-primary/[0.8] text-white hover:scale-x-110 shadow-none transition-all duration-400">
                Login
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none">
              <Card>
                <MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      {error && (
                        <div className="text-center mt-2">
                          <p className="text-red-500 text-sm">{error}</p>
                          <button
                            className="text-blue-500 text-sm hover:underline mt-1"
                            onClick={handlePasswordReset}
                          >
                            Reset Password
                          </button>
                        </div>
                      )}
                      {resetSent && <p className="text-green-500 text-sm">Reset link sent! Check your email.</p>}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-light-primary flex items-center justify-center gap-2"
                      onClick={handleLogin}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4" /> Signing In...
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
        )}
      </div>
    </header>
  );
};

export default Header;
