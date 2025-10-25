"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getBadgeClass } from "@/utils/statusUtils";
import { OrderType } from "@/types/orderType";
import { format } from "date-fns";
import html2pdf from "html2pdf.js";
import { Printer } from "lucide-react";
import { useTheme } from "next-themes";
import { auth } from "@/app/config/firebase";
import { getOrderFromFirestore } from "@/utils/order/getFireStoreOrders";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import {
  generateInvoiceNumber,
  generateUniqueInvoiceNumber,
} from "@/utils/invoiceUtils";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

// Import PDF-lib
import { PDFDocument } from "pdf-lib";
import { useAuth } from "@/app/context/AuthContext";
import { useCurrency } from "@/hooks/useCurrency";
import InvoicePreview from "./InvoicePreview";
import UploadInvoiceBox from "./UploadInvoiceBox";
import OverrideWarningModal from "./OverrideWarningModal";

export default function InvoicePage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderType | null>(null);
  const invoiceRef = useRef(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showOverrideWarning, setShowOverrideWarning] = useState(false);
  const [dontRemind, setDontRemind] = useState(false);
  
  // --- MODIFICATION 1: Add state for loading feedback ---
  const [isSending, setIsSending] = useState(false);

  const isPaid = order?.paymentStatus === "paid";
  const paidEvent =
    order &&
    order.timeline?.find((event) => event.action.includes("Payment of"));
  const paidDate = isPaid && (paidEvent ? paidEvent.date : null);
  const { setTheme } = useTheme();
  const userId = auth.currentUser?.uid;
  const { userDoc } = useAuth();

  const { allOrders, updateOrder } = useOrderStore();
  const toast = useToast();

  useEffect(() => {
    setTheme("light");

    if (!userId || !id) {
      return;
    }

    const fetchOrderAndGenerateInvoice = async () => {
      const fetchedOrder = await getOrderFromFirestore(userId, id);

      if (fetchedOrder) {
        if (!fetchedOrder.invoiceNumber) {
          try {
            const newInvoiceNumber = await generateUniqueInvoiceNumber(userId);
            await updateOrder(userId, id, { invoiceNumber: newInvoiceNumber });

            const updatedOrderFromStore = allOrders.find((o) => o.id === id);
            setOrder(updatedOrderFromStore);
          } catch (error) {
            console.error(
              "Failed to generate or update invoice number:",
              error
            );
          }
        } else {
          setOrder(fetchedOrder);
        }
      }
    };

    const foundInStore = allOrders.find((o) => o.id === id);
    if (foundInStore && foundInStore.invoiceNumber) {
      setOrder(foundInStore);
    } else {
      fetchOrderAndGenerateInvoice();
    }
  }, [id, userId, allOrders, toast, setTheme, updateOrder]);

  const convertImageToPdf = async (file) => {
    const pdfDoc = await PDFDocument.create();
    const imgBytes = await file.arrayBuffer();

    let embeddedImage;
    if (file.type === "image/jpeg") {
      embeddedImage = await pdfDoc.embedJpg(imgBytes);
    } else if (file.type === "image/png") {
      embeddedImage = await pdfDoc.embedPng(imgBytes);
    } else {
      throw new Error("Unsupported image format.");
    }

    const size = embeddedImage.size();
    const page = pdfDoc.addPage([size.width, size.height]);
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
  };

  // --- MODIFICATION 2: Update the send invoice handler ---
  const handleSendInvoice = async () => {
    setIsSending(true); // Start loading
    try {
      let fileToSend = null;
      let fileName = "";

      if (isGenerated) {
        if (!invoiceRef.current || !order) return;
        try {
          const opt = {
            margin: 0.5,
            filename: `invoice_${order.invoiceNumber || order.id}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
          };
          fileToSend = await html2pdf()
            .set(opt)
            .from(invoiceRef.current)
            .outputPdf("blob");
          fileName = `invoice_${order.invoiceNumber || order.id}.pdf`;
        } catch (err) {
          console.error("Failed to generate PDF:", err);
          alert("❌ Error while generating PDF.");
          return;
        }
      } else if (uploadedFile) {
        if (uploadedFile.type.startsWith("image/")) {
          try {
            fileToSend = await convertImageToPdf(uploadedFile);
            const originalName = uploadedFile.name
              .split(".")
              .slice(0, -1)
              .join(".");
            fileName = `${originalName}.pdf`;
          } catch (err) {
            console.error("Failed to convert image to PDF:", err);
            alert("❌ Error while converting image to PDF.");
            return;
          }
        } else {
          fileToSend = uploadedFile;
          fileName = uploadedFile.name;
        }
      } else {
        alert("Please upload a file or generate an invoice first.");
        return;
      }

      if (fileToSend) {
        try {
          const base64File = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(fileToSend);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
          });

          const res = await fetch("/api/send-inv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              customerNumber: order.customer?.whatsappNumber,
              customerName: order.customer?.name,
              fileName: fileName,
              fileData: base64File,
            }),
          });

          const data = await res.json();
          if (data.success) {
            alert("✅ Invoice sent successfully via WhatsApp!");
          } else {
            alert("❌ Failed to send invoice: " + data.message);
          }
        } catch (err) {
          console.error("Send invoice error:", err);
          alert("❌ Error while sending invoice.");
        }
      }
    } finally {
      setIsSending(false); // Stop loading, regardless of the outcome
    }
  };


  const handleDownloadPDF = async () => {
    if (isGenerated) {
      if (!invoiceRef.current || !order) return;
      const options = {
        margin: 0.5,
        filename: `invoice_${order.invoiceNumber || order.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(options).from(invoiceRef.current).save();
    } else if (uploadedFile) {
      if (uploadedFile.type.startsWith("image/")) {
        try {
          const pdfBlob = await convertImageToPdf(uploadedFile);
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement("a");
          link.href = url;
          const originalName = uploadedFile.name
            .split(".")
            .slice(0, -1)
            .join(".");
          link.download = `${originalName}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error("Download error:", err);
          alert("❌ Error while converting and downloading.");
        }
      } else {
        const url = URL.createObjectURL(uploadedFile);
        const link = document.createElement("a");
        link.href = url;
        link.download = uploadedFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } else {
      alert("Please upload a file or generate an invoice first.");
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
      setIsGenerated(false);
    }
  };

  const handleGenerateInvoice = () => {
    if (uploadedFile && !dontRemind) {
      setShowOverrideWarning(true);
    } else {
      setIsGenerated(true);
      setShowOverrideWarning(false);
    }
  };

  const handleWarningAccept = () => {
    setIsGenerated(true);
    setShowOverrideWarning(false);
  };

  const handleWarningReject = () => {
    setShowOverrideWarning(false);
  };

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading invoice...</p>
      </div>
    );
  }

  const balanceDue = order.totalAmount - (order.payment?.totalPaid || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 light">
      <div className="flex flex-row justify-end gap-2 mb-4">
        <Button
          onClick={handleDownloadPDF}
          className="rounded-xl flex gap-2 px-4 py-4 hover:bg-neutral-200 dark:hover:bg-purple-800/30 aspect-square text-purple-600 border-2 border-purple-600"
        >
          <Printer size={18} />
        </Button>

        {/* --- MODIFICATION 3: Update the Button to show loading state --- */}
        <Button
          onClick={handleSendInvoice}
          disabled={isSending}
          className="rounded-xl px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {isSending ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send Invoice via WhatsApp"
          )}
        </Button>
      </div>

        
      <UploadInvoiceBox uploadedFile={uploadedFile} onChange={handleFileChange}/>
      <Button
        onClick={handleGenerateInvoice}
        className="mb-4 rounded-xl px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg w-full shadow-md hover:shadow-lg transition-all duration-300"
      >
        Generate Invoice
      </Button>
      
      {showOverrideWarning && (
        <OverrideWarningModal open={showOverrideWarning} onAccept={handleWarningAccept} onReject={handleWarningReject} dontRemind={dontRemind} setDontRemind={setDontRemind}/>
        
      )}
      {isGenerated ? (
        <InvoicePreview order={order} userDoc={userDoc} isPaid={isPaid} paidDate={paidDate} invoiceRef={invoiceRef} userId={userId} />
      ) : (
        uploadedFile && (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl bg-green-50 text-green-800 border-2 border-green-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <p className="text-lg font-semibold">File ready to be sent:</p>
            <p className="text-md text-green-700 font-medium">
              {uploadedFile.name}
              {uploadedFile.type.startsWith("image/") &&
                " (Will be converted to PDF)"}
            </p>
          </div>
        )
      )}
    </div>
  );
}