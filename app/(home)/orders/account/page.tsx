"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "@/app/config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function AccountPage() {
  const [whatsappSecret, setWhatsappSecret] = useState("");
  const [isEditingSecret, setIsEditingSecret] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const [company, setCompany] = useState("");
  const [isEditingCompany, setIsEditingCompany] = useState(false);

  const [rewardPercentage, setRewardPercentage] = useState("");
  const [isEditingReward, setIsEditingReward] = useState(false);

  // Destructure both the user (from Firebase Auth) and userDoc (from Firestore)
  const { user, userDoc } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [joinedDate, setJoinedDate] = useState("");

  //console.log(user)

  // Use userDoc to populate state variables
  useEffect(() => {
    // We check for userDoc because it contains all the custom data
    if (userDoc) {
      if (userDoc.createdAt) {
        // Firestore timestamps have a toDate() method
        const date = userDoc.createdAt.toDate();
        setJoinedDate(
          date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      }
      setCompany(userDoc.company || "N/a");
      setWhatsappSecret(userDoc.whatsappSecret || "");
      // Ensure the value is a string for the input field
      setRewardPercentage(userDoc.rewardPercentage?.toString() || "");
    }
  }, [userDoc]); // Dependency array now watches userDoc for changes

  // //console.log(userDoc); // Use this to inspect the data from Firestore

  async function handleSaveSecret() {
    // Ensure both user and userDoc are available
    if (!user || !userDoc) return;
    if (whatsappSecret.trim() === "") {
      setIsEditingSecret(false);
      setShowSecret(false);
      return;
    }
    try {
      await updateDoc(doc(db, "users", user.uid), {
        whatsappSecret: whatsappSecret.trim(),
      });
      toast({
        title: "Secret updated ✅",
        description: "Your WhatsApp secret has been saved.",
      });
    } catch (error) {
      console.error("Error saving secret:", error);
      toast({
        title: "Error ❌",
        description: "Could not save your secret. Please try again.",
      });
    }
    setIsEditingSecret(false);
    setShowSecret(false);
  }

  async function handleSaveCompany() {
    if (!user || !userDoc) return;
    if (company.trim() === "" || company.trim() === "N/a") {
      setIsEditingCompany(false);
      return;
    }
    try {
      await updateDoc(doc(db, "users", user.uid), {
        company: company.trim(),
      });
      toast({
        title: "Company updated ✅",
        description: "Your company name has been updated.",
      });
    } catch (error) {
      console.error("Error saving company:", error);
      toast({
        title: "Error ❌",
        description: "Could not save your company name. Please try again.",
      });
    }
    setIsEditingCompany(false);
  }

  async function handleSaveRewardPercentage() {
    if (!user || !userDoc) return;
    const confirmed = window.confirm(
      `Are you sure you want to set reward percentage to ${rewardPercentage}%? This is a sensitive setting.`
    );
    if (!confirmed) {
      setIsEditingReward(false);
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        rewardPercentage: Number(rewardPercentage),
      });
      toast({
        title: "Reward Percentage updated ✅",
        description: `Reward is now set to ${rewardPercentage}%.`,
      });
    } catch (error) {
      console.error("Error saving rewardPercentage:", error);
      toast({
        title: "Error ❌",
        description: "Could not save reward percentage. Please try again.",
      });
    }
    setIsEditingReward(false);
  }

  async function handleResetPassword() {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: "Password Reset Sent ✅",
        description: "Check your email to reset your password.",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error ❌",
        description: "Failed to send reset email. Try again later.",
      });
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-background dark:to-gray-900">
      <Card className="w-full shadow-2xl py-2 rounded-3xl border-none bg-white dark:bg-zinc-900">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-dark-primary">
            👋 Hey, {user?.displayName?.split(" ")[0] || "there"}!
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Here's your account info.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl">
              <p className="text-sm text-muted-foreground">Name</p>
              <h2 className="text-lg font-semibold">
                {user?.displayName || "—"}
              </h2>
            </div>

            {/* Email */}
            <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl">
              <p className="text-sm text-muted-foreground">Email</p>
              {/* Use 'user' object for email as it is more reliable for authentication */}
              <h2 className="text-lg font-semibold">{user?.email || "—"}</h2>
            </div>

            {/* Joined on */}
            <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl">
              <p className="text-sm text-muted-foreground">Joined on</p>
              <h2 className="text-lg font-semibold">{joinedDate}</h2>
            </div>

            {/* Company */}
            <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl relative">
              <p className="text-sm text-muted-foreground mb-1">Company</p>
              <div className="relative">
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={!isEditingCompany}
                  placeholder="Enter your company name"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (isEditingCompany) {
                      handleSaveCompany();
                    } else {
                      setIsEditingCompany(true);
                    }
                  }}
                  className="absolute right-2 top-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {isEditingCompany ? "Save" : "Edit"}
                </button>
              </div>
            </div>

            {/* WhatsApp Secret */}
            <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl relative">
              <p className="text-sm text-muted-foreground mb-1">
                WhatsApp Secret
              </p>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={whatsappSecret}
                  onChange={(e) => setWhatsappSecret(e.target.value)}
                  disabled={!isEditingSecret}
                  placeholder="Set your secret"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (isEditingSecret) {
                      handleSaveSecret();
                    } else {
                      setIsEditingSecret(true);
                      setShowSecret(true);
                    }
                  }}
                  className="absolute right-2 top-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {isEditingSecret ? "Save" : "Edit"}
                </button>
              </div>
            </div>

            {/* Reward Percentage */}
            <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl relative">
              <p className="text-sm text-muted-foreground mb-1">
                Reward Percentage
              </p>
              <div className="relative">
                <input
                  type="number"
                  value={rewardPercentage}
                  onChange={(e) => setRewardPercentage(e.target.value)}
                  disabled={!isEditingReward}
                  placeholder="Enter reward %"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                  min="0"
                  max="100"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (isEditingReward) {
                      handleSaveRewardPercentage();
                    } else {
                      setIsEditingReward(true);
                    }
                  }}
                  className="absolute right-2 top-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {isEditingReward ? "Save" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="text-center mt-4">
          <button
            onClick={handleResetPassword}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 cursor-pointer text-white text-sm font-semibold rounded-full shadow-md hover:bg-indigo-800 transition"
          >
            🔐 Reset Password
          </button>
        </div>
      </Card>
    </div>
  );
}
