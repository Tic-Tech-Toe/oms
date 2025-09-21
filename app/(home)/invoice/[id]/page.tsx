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

export default function InvoicePage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderType | null>(null);
  const invoiceRef = useRef(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showOverrideWarning, setShowOverrideWarning] = useState(false);
  const [dontRemind, setDontRemind] = useState(false);
  const isPaid = order?.paymentStatus === "paid";
  const paidEvent =
    order &&
    order.timeline?.find((event) => event.action.includes("Payment of"));
  const paidDate = isPaid && (paidEvent ? paidEvent.date : null);
  // //console.log({paidDate})
  const { setTheme } = useTheme();
  const userId = auth.currentUser?.uid;
  const { userDoc } = useAuth();
  //console.log({userDoc});
  // const {userDoc} = useAuth().currentUser
  // const companyAddress = auth.currentUser?.company;
  //console.log("Current user",auth.currentUser);

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

  const handleSendInvoice = async () => {
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
        <Button
          onClick={handleSendInvoice}
          className="rounded-xl px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
        >
          Send Invoice via WhatsApp
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-2">
          Upload invoice
        </h2>
        <div
          className="relative flex flex-col items-center justify-center w-full p-6 border-4 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800"
          style={{ borderColor: "#d1d5db" }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute w-full h-full opacity-0 cursor-pointer"
            accept="image/*, .pdf"
          />
          <Upload size={32} className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PDF or Image (JPG, PNG)
          </p>
          {uploadedFile && (
            <p className="mt-2 text-sm text-green-600">
              File selected: {uploadedFile.name}
              {uploadedFile.type.startsWith("image/") &&
                " (Will be converted to PDF)"}
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={handleGenerateInvoice}
        className="mb-4 rounded-xl px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg w-full shadow-md hover:shadow-lg transition-all duration-300"
      >
        Generate Invoice
      </Button>

      {/* Popover warning */}
      {showOverrideWarning && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Override Warning</h3>
              <button
                onClick={handleWarningReject}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Clicking on "Generate Invoice" will override the uploaded file.
            </p>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="dontRemind"
                checked={dontRemind}
                onChange={(e) => setDontRemind(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label
                htmlFor="dontRemind"
                className="ml-2 text-sm text-gray-700 dark:text-gray-400"
              >
                Don't remind me for this session
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleWarningReject}
                variant="outline"
                className="border-gray-300 hover:bg-gray-100"
              >
                Reject
              </Button>
              <Button
                onClick={handleWarningAccept}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}

      {isGenerated ? (
        <div
          ref={invoiceRef}
          className="bg-white dark:bg-zinc-950 rounded-3xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 relative overflow-hidden"
        >
          {isPaid && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] pointer-events-none">
              <span className="text-6xl sm:text-6xl font-black text-green-600 dark:text-green-500 opacity-20">
                PAID
              </span>
              {paidDate && (
                <span className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 text-md text-green-600 dark:text-green-500 opacity-20">
                  {format(paidDate, "dd - MMM, yyyy - hh:mm a")}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Invoice
              </h1>
              <p className="text-sm text-gray-500">
                Invoice No:{" "}
                {order.invoiceNumber || `INV-${order.id.slice(0, 6)}`}
              </p>
              <p className="text-sm text-gray-500">
                Date: {format(new Date(order.orderDate), "dd MMM yyyy")}
              </p>
            </div>
            <div className="mt-4 sm:mt-0"></div>
          </div>
          <Separator className="my-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="font-semibold mb-1">From</h2>
              <p className="text-sm">{userDoc?.company}</p>
              <p className="text-sm">support - {userDoc?.email}</p>
            </div>
            <div>
              <h2 className="font-semibold mb-1">Bill To</h2>
              <p className="text-sm">{order.customer?.name}</p>
              <p className="text-sm">+91 {order.customer?.whatsappNumber}</p>
              <p className="text-sm">Customer ID: {order.customer?.id}</p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 mb-8">
            <table className="min-w-full border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900">
                <tr className="text-left text-sm font-semibold">
                  <th className="p-3">Item</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="text-sm border-t border-zinc-200 dark:border-zinc-800"
                  >
                    <td className="p-3">{item.itemName}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">
                      ₹{item.price.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      ₹{item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              {order.charges.map((charge) => (
                <div key={charge.id} className="flex justify-between">
                  <span>{charge.name}</span>
                  <span>
                    {charge.type === "percent"
                      ? `${charge.value}%`
                      : `₹${charge.value}`}
                  </span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid:</span>
                <span>₹{order.payment?.totalPaid.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between text-red-600 font-bold">
                <span>Balance Due:</span>
                <span>₹{balanceDue.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <div>
            <h2 className="font-semibold mb-3">Order Timeline</h2>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              {order.timeline.map((event, idx) => (
                <li key={idx}>
                  <span className="font-medium">{event.action}</span> –{" "}
                  {format(new Date(event.date), "dd MMM yyyy, hh:mm a")}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10 text-center text-sm text-gray-500">
            Thank you for your business ✨
          </div>
        </div>
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
