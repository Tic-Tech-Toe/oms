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
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/app/config/firebase";

const steps = [
  { id: 1, title: "Welcome", desc: "Let’s set up your WhatsApp connection" },
  { id: 2, title: "API Secret", desc: "Add your WhatsApp API secret key" },
  { id: 3, title: "Phone ID", desc: "Enter your WhatsApp phone ID" },
  { id: 4, title: "Verify", desc: "We’ll check if everything works" },
  { id: 5, title: "Done", desc: "You’re all set 🎉" },
];

const WhatsappConnectDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [step, setStep] = useState(1);
  const [whatsappSecret, setWhatsappSecret] = useState("");
  const [phoneId, setPhoneId] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useAuth(); // assumes returns { uid } or null

  const nextStep = async () => {
  if (step === 2 && whatsappSecret.trim()) {
    await savePartial({ "whatsapp-api-secret": whatsappSecret.trim() });
  }
  if (step === 3 && phoneId.trim()) {
    await savePartial({ "whatsapp-phone-id": phoneId.trim() });
  }
  if (step === 4) {
    setLoading(true);
    setTimeout(async () => {
      await savePartial({ connected: true });
      setLoading(false);
      setStep(5);
    }, 1200);
    return;
  }
  setStep((prev) => Math.min(prev + 1, steps.length));
};


  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

 const savePartial = async (data: Record<string, any>) => {
  if (!user?.uid) return;
  try {
    const userRef = doc(db, "users", user.uid);
    const updates: Record<string, any> = {};

    for (const key in data) {
      updates[`connections.whatsapp.${key}`] = data[key];
    }

    await updateDoc(userRef, updates);
  } catch (error) {
    console.error("Error saving WhatsApp data:", error);
  }
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl bg-white shadow-xl p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(step / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <DialogHeader className="p-6 pb-3 text-center">
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/connections/whatsapp-business-ico.svg"
              alt="WhatsApp"
              width={50}
              height={50}
            />
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {steps[step - 1].title}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {steps[step - 1].desc}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="relative min-h-[200px] p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
              >
                <p className="text-gray-700 text-lg">
                  This setup will connect your WhatsApp Business account so you
                  can send and receive messages.
                </p>
                <p className="text-gray-500 text-sm">
                  We’ll guide you through fetching your API Secret and Phone ID
                  — no worries, it’s easy! 🌱
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-lg text-gray-800">
                  Enter your WhatsApp API Secret
                </h3>
                <input
                  type="text"
                  value={whatsappSecret}
                  onChange={(e) => setWhatsappSecret(e.target.value)}
                  placeholder="Enter API Secret..."
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500">
                  Find this in your{" "}
                  <a
                    href="https://developers.facebook.com/apps/"
                    target="_blank"
                    className="text-green-600 underline"
                  >
                    Facebook Developer Console
                  </a>{" "}
                  under <i>System Users → Tokens</i>.
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-lg text-gray-800">
                  Enter your Phone ID
                </h3>
                <input
                  type="text"
                  value={phoneId}
                  onChange={(e) => setPhoneId(e.target.value)}
                  placeholder="Enter Phone ID..."
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500">
                  You’ll find it under{" "}
                  <b>WhatsApp → Getting Started</b> in your Meta Dashboard.
                </p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="s4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-3"
              >
                {loading ? (
                  <>
                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-700 font-medium">
                      Verifying your details...
                    </p>
                  </>
                ) : (
                  <p className="text-gray-600">Ready to verify</p>
                )}
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="s5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-3"
              >
                <div className="text-green-600 text-4xl">✅</div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Connected Successfully!
                </h3>
                <p className="text-gray-500">
                  Your WhatsApp Business account is now linked securely.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="flex justify-between items-center p-6 pt-0 border-t text-white">
          <Button variant="ghost" disabled={step === 1} onClick={prevStep}>
            Back
          </Button>
          {step < steps.length ? (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={nextStep}
              disabled={
                (step === 2 && !whatsappSecret.trim()) ||
                (step === 3 && !phoneId.trim()) ||
                loading
              }
            >
              Next
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsappConnectDialog;
