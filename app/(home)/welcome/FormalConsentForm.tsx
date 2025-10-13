"use client";

import { useAuth } from "@/app/context/AuthContext";
import React, { useState, useEffect, useRef } from "react";
import crypto from "crypto";
import { Toaster, toast } from "sonner"; // 👈 Sonner toast import
import { doc, updateDoc } from "firebase/firestore";
import { app, db } from "@/app/config/firebase";

// --- Utility Components (stand-ins for icons and buttons) ---
const FileText = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);
const Signature = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 14c.83-.83 1.5-1 2-1 1.07.03 2.5 0 3.5 0 1 0 1.5.33 2 1s.83 1.5 1 2c.17.5.33 1.5 0 2-1 1-2 1.5-3.5 1.5h-2s-1 1-3 1c-1.5 0-2.5-1-2.5-2.5 0-1.5 1-2.5 2.5-2.5h2" />
    <path d="M18 10h.01" />
    <path d="M10 10h.01" />
    <path d="M14 10h.01" />
    <path d="M18 10v.01" />
  </svg>
);
const Check = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const Button = (props) => (
  <button
    {...props}
    className={`
      rounded-lg transition-all duration-200 p-3 shadow-md font-semibold flex items-center justify-center
      ${props.className || "bg-gray-500 text-white hover:bg-gray-600"}
    `}
    onClick={props.onClick}
    disabled={props.disabled}
  >
    {props.children}
  </button>
);

const ConsentDetail = ({ title, description }) => (
  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
    <h4 className="font-semibold text-gray-800">{title}</h4>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </div>
);

// --- Generate App ID ---
function generateAppId(user) {
  if (!user?.email && !user?.name) return "Shiptrack-app-id-unknown";
  const hash = crypto
    .createHash("md5")
    .update(`${user.email}-${user.company}`)
    .digest("hex")
    .slice(0, 8);
  return `Ship-app-id-${user.name?.replace(/\s+/g, "")}-${hash}`;
}

// --- Main Component ---
const FormalConsentForm = ({ user, hasConsented, setHasConsented }) => {
  //   const [isHtml2PdfLoaded, setIsHtml2PdfLoaded] = useState(false);
  //   const consentRef = useRef(null);
  const { userDoc } = useAuth();

  const __app_id = generateAppId(userDoc);

  const handleConsentSign = async () => {
    try {
      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        consent: {
          agreed: true,
          app_id: __app_id,
          timestamp: new Date().toISOString(),
        },
      });

      setHasConsented(true);
      toast.success("🎉 Agreement Confirmed!", {
        description:
          "Thanks for agreeing - we are ready to set up your workspace.",
      });
    } catch (error) {
      console.error("Error signing consent:", error);
      toast.error("🎉 Agreement Confirmed!", {
        description:
          "Thanks for agreeing - we are ready to set up your workspace.",
      });
    }
  };

  return (
    <>
      {/*  Sonner toaster  */}
      <Toaster
        position="top-center"
        theme="light" //  force light theme
        toastOptions={{
          style: {
            borderRadius: "20px",
            border: "3px solid #7C3AED", // Deep purple border
            background: "linear-gradient(135deg, #F9F9FB, #FFFFFF)",
            color: "#2D1B69",
            boxShadow: "0 4px 20px rgba(124, 58, 237, 0.15)",
            padding: "16px 20px",
            letterSpacing: "0.3px",
          },
          className: "text-base tracking-wide text-xl",
        }}
      />

      <div className="p-8 bg-white rounded-xl shadow-2xl border-4 border-purple-600 space-y-6 max-w-3xl mx-auto my-10 font-sans">
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
            .font-sans { font-family: 'Inter', sans-serif; }
            button:disabled { cursor: not-allowed; }
          `}
        </style>

        <div className="p-4 rounded-lg bg-white">
          <div className="flex items-center space-x-3 text-3xl font-bold text-purple-700 pb-2 border-b border-purple-200">
            <FileText className="w-10 h-10" />
            <h2 className="md:text-3xl text-lg">
              Digital Account Usage Agreement
            </h2>
          </div>

          <p className="text-gray-600 text-lg mt-4">
            By digitally signing below, you acknowledge and **formally agree**
            to the data access terms for the following connected services:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y py-4 my-4">
            <ConsentDetail
              title="WhatsApp Business"
              description="Sending messages, retrieving conversations, and promotional campaigns."
            />
            <ConsentDetail
              title="Zoho CRM (Estimates)"
              description="Fetching customer contact details and order data from Zoho Estimates."
            />
            <ConsentDetail
              title="Google Account (Drive/Contacts)"
              description="Saving reports/PDFs to Drive and synchronizing Google Contacts."
            />
          </div>

          <div className="pt-4 flex justify-between md:flex-row flex-col items-start signature-area">
            <div className="flex flex-col mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                Digital Signature (User Email):{" "}
                <span className="font-medium text-gray-700">
                  {user?.email || "N/A"}
                </span>
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-1">
                Date: {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-1">
                App ID: {hasConsented && __app_id}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 non-pdf">
          <Button
            onClick={() => {
              handleConsentSign();
            }}
            disabled={hasConsented}
            className={`text-lg px-8 py-3 transition-all duration-300 text-white ${
              hasConsented
                ? "bg-green-600 hover:bg-green-600 cursor-default"
                : "bg-purple-600 hover:bg-purple-700 "
            }`}
          >
            {hasConsented ? (
              <>
                <Check className="w-5 h-5 mr-2" /> Agreement Confirmed
              </>
            ) : (
              <>
                <Signature className="w-5 h-5 mr-2" /> Sign & Agree
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default FormalConsentForm;
