"use client";

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, Phone, Lock, Loader2 } from "lucide-react";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  ConfirmationResult,
} from "firebase/auth";
import { app } from "@/app/config/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useRouteChange } from "@/app/context/RouteChangeContext";
import { fetchUserData } from "@/utils/user/fetchUseData";
import { useEffect, useRef, useState } from "react";

// Initialize Firebase Auth
const auth = getAuth(app);

const LoginDialog = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { setRouteLoading } = useRouteChange();

  const [loginView, setLoginView] = useState<"otp" | "email">("otp");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Email State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // --- Phone & OTP State ---
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Setup reCAPTCHA for OTP login
  useEffect(() => {
    if (loginView === "otp" && !window.recaptchaVerifier) {
      // Add a small delay to ensure the 'recaptcha-container' div has been mounted by the Dialog
      const timer = setTimeout(() => {
        if (document.getElementById("recaptcha-container")) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
              size: "invisible",
              callback: (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
              },
            }
          );
        }
      }, 100);

      return () => clearTimeout(timer); // Cleanup function
    }
  }, [loginView]);

  const handleApiLogin = async (idToken: string) => {
    const loginRes = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
      credentials: "include",
    });

    if (!loginRes.ok) {
      throw new Error("Login API call failed. Please try again.");
    }
  };

  const routeUser = async (firebaseUser: any) => {
    const userData = await fetchUserData(firebaseUser);
    if (userData?.role === "admin") {
      router.push("/admin/invite");
    } else {
      router.push("/welcome");
    }
  };

  // --- Email Login Handler ---
  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");
    setResetSent(false);

    try {
      setRouteLoading(true);
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      await handleApiLogin(token);
      await routeUser(userCred.user);
    } catch (err: any) {
      setError(
        err.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
      setRouteLoading(false);
    }
  };

  // --- OTP Handlers ---
  const handleSendOtp = async () => {
    console.table({ phone });
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formattedPhone = `+91${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please check the number and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    if (!confirmationResult) {
      setError("Something went wrong. Please try sending the OTP again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setRouteLoading(true);
      const result = await confirmationResult.confirm(otp);
      const token = await result.user.getIdToken();
      await handleApiLogin(token);
      await routeUser(result.user);
    } catch (err) {
      console.error(err);
      setError("Invalid OTP or something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setRouteLoading(false);
    }
  };

  // --- Password Reset Handler ---
  const handlePasswordReset = async () => {
    if (!email)
      return setError("Please enter your email to reset the password.");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError("");
    } catch (err) {
      setError("Couldn't send reset email. Please check your email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      onOpenChange={() => {
        // Reset state when dialog is closed
        setError("");
        setLoading(false);
        setOtpSent(false);
        setResetSent(false);
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-black/80 text-white hover:scale-[1.02] transition-all duration-200 rounded-full px-6 py-2 backdrop-blur-sm shadow-md hover:shadow-lg">
          Login
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-sm w-full mx-auto rounded-3xl overflow-hidden">
        <div className="relative bg-card text-card-foreground">
          {/* Top 40% Decorative Header */}
          <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-br from-indigo-500 to-purple-600">
            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
              <h2 className="text-3xl font-bold">Welcome!</h2>
              <p className="text-sm opacity-80 mt-1">Sign in to continue</p>
            </div>
          </div>

          {/* Bottom 60% Form Area */}
          <div className="pt-[40%]">
            <div className="p-8 space-y-6">
              {loginView === "otp" ? (
                // OTP View
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="font-semibold text-center text-lg">
                    Enter your phone number
                  </h3>
                  {!otpSent ? (
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          +91
                        </span>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="98765 43210"
                          maxLength={10}
                          className="pl-12"
                        />
                      </div>
                      <Button
                        onClick={handleSendOtp}
                        disabled={loading}
                        className=" bg-light-primary"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        ) : null}
                        Send OTP
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-center text-xs text-muted-foreground">
                        An OTP has been sent to +91 {phone}
                      </p>
                      <Input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className="text-center tracking-widest text-lg"
                      />
                      <Button
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        ) : null}
                        Verify & Login
                      </Button>
                    </div>
                  )}
                  <p className="text-center text-xs">
                    <button
                      onClick={() => setLoginView("email")}
                      className="text-indigo-500 hover:underline"
                    >
                      Or login with Email and Password
                    </button>
                  </p>
                </div>
              ) : (
                // Email View
                <div className="space-y-4 animate-in fade-in duration-300 flex flex-col items-center">
                  <h3 className="font-semibold text-center text-lg">
                    Enter your credentials
                  </h3>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="text-right text-xs">
                    <button
                      onClick={handlePasswordReset}
                      className="text-indigo-500 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <Button
                    onClick={handleEmailLogin}
                    disabled={loading}
                    className="bg-light-primary"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    ) : null}
                    Sign In
                  </Button>
                  <p className="text-center text-xs">
                    <button
                      onClick={() => setLoginView("otp")}
                      className="text-indigo-500 hover:underline"
                    >
                      Login with Phone Number (OTP)
                    </button>
                  </p>
                </div>
              )}
              {error && (
                <p className="text-red-500 text-xs text-center pt-2">{error}</p>
              )}
              {resetSent && (
                <p className="text-green-500 text-xs text-center pt-2">
                  Password reset email sent successfully!
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
      <div id="recaptcha-container"></div>
    </Dialog>
  );
};

// This is required for RecaptchaVerifier to work globally in the component
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default LoginDialog;
