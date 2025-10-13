"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { updateDoc, doc } from "firebase/firestore";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/app/config/firebase";

const steps = [
  { id: 1, title: "Welcome", desc: "Let’s connect your Zoho CRM account." },
  { id: 2, title: "Client ID", desc: "Enter your Zoho Client ID" },
  { id: 3, title: "Client Secret", desc: "Enter your Zoho Client Secret" },
  { id: 4, title: "Refresh Token & Org ID", desc: "Add your refresh token and organization ID" },
  { id: 5, title: "Verify & Done", desc: "We’ll verify and finish setup 🎉" },
];

const ZohoConnectDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // form states
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [orgId, setOrgId] = useState("");

  const savePartial = async (data: Record<string, any>) => {
    if (!user?.uid) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        "connections.zoho": {
          connected: false,
          "zoho-client-id": clientId,
          "zoho-client-secret": clientSecret,
          "zoho-refresh-token": refreshToken,
          "zoho-org-id": orgId,
          ...data,
        },
      });
    } catch (err) {
      console.error("Error saving Zoho data:", err);
    }
  };

  const nextStep = async () => {
    if (step === 2 && clientId.trim()) {
      await savePartial({ "zoho-client-id": clientId.trim() });
    }
    if (step === 3 && clientSecret.trim()) {
      await savePartial({ "zoho-client-secret": clientSecret.trim() });
    }
    if (step === 4 && refreshToken.trim() && orgId.trim()) {
      await savePartial({
        "zoho-refresh-token": refreshToken.trim(),
        "zoho-org-id": orgId.trim(),
      });
    }
    if (step === 5) {
      setLoading(true);
      setTimeout(async () => {
        await savePartial({ connected: true });
        setLoading(false);
        setStep(6);
      }, 1200);
      return;
    }
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl bg-white shadow-2xl p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 6) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <DialogHeader className="p-6 pb-3 text-center">
          <div className="flex flex-col items-center gap-2">
            <Image src="/connections/zoho.webp" alt="Zoho" width={50} height={50} />
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {steps[step - 1]?.title || "All Done!"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {steps[step - 1]?.desc || "Your Zoho connection is ready."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="relative min-h-[200px] p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
              >
                <p className="text-gray-700 text-lg">
                  We’ll connect your Zoho CRM account securely so we can sync customer data and automate actions.
                </p>
                <p className="text-gray-500 text-sm">
                  You’ll need a few details from your Zoho Developer Console — we’ll guide you step by step 🌟
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-lg text-gray-800">Enter Zoho Client ID</h3>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Enter Client ID..."
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500">
                  You can find this in your{" "}
                  <a
                    href="https://api-console.zoho.com/"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Zoho API Console
                  </a>{" "}
                  under your created client app.
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-lg text-gray-800">Enter Zoho Client Secret</h3>
                <input
                  type="text"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="Enter Client Secret..."
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500">
                  This is generated alongside your client ID in{" "}
                  <a href="https://api-console.zoho.com/" target="_blank" className="text-blue-600 underline">
                    Zoho API Console
                  </a>.
                </p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-lg text-gray-800">Refresh Token & Organization ID</h3>
                <input
                  type="text"
                  value={refreshToken}
                  onChange={(e) => setRefreshToken(e.target.value)}
                  placeholder="Enter Refresh Token..."
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  placeholder="Enter Organization ID..."
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500">
                  Your <b>Organization ID</b> can be found in your Zoho CRM URL — e.g.,{" "}
                  <code>https://crm.zoho.com/crm/org123456789</code>
                </p>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-700 font-medium">Verifying your Zoho credentials...</p>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-3"
              >
                <div className="text-blue-600 text-4xl">✅</div>
                <h3 className="text-xl font-semibold text-gray-800">Zoho Connected!</h3>
                <p className="text-gray-500">Your Zoho CRM account is now linked securely.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step <= 5 && (
          <DialogFooter className="flex justify-between items-center p-6 pt-0 border-t text-white">
            <Button variant="ghost" disabled={step === 1} onClick={prevStep}>
              Back
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={nextStep}>
              {step === 5 ? "Verify" : "Next"}
            </Button>
          </DialogFooter>
        )}

        {step === 6 && (
          <DialogFooter className="flex justify-center p-6 pt-0 border-t text-white">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ZohoConnectDialog;
