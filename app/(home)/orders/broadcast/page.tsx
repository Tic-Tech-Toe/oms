"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/app/config/firebase";
import { useCustomerStore } from "@/hooks/zustand_stores/useCustomerStore";
import { sendBroadcast } from "@/app/services/whatsapp/sendBroadcast";
import { Upload } from "lucide-react";

export default function BroadcastPage() {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [template, setTemplate] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    url: string;
  } | null>(null);

  const { toast } = useToast();
  const userId = auth.currentUser?.uid;
  const { customers, loadCustomers } = useCustomerStore();

  useEffect(() => {
    if (userId) {
      loadCustomers(userId);
    }
  }, [userId, loadCustomers]);

  const toggleContact = (phone: number) => {
    setSelectedContacts((prev) =>
      prev.includes(phone) ? prev.filter((p) => p !== phone) : [...prev, phone]
    );
  };

  const handleBroadcast = async () => {
    if (!template || !selectedContacts.length) {
      toast({
        title: "Missing fields ⚠️",
        description: "Please select contacts and a template.",
      });
      return;
    }
  
    const file = selectedImage?.file;
  
    const toastId = Math.random().toString(); // unique ID
  
    toast({
      id: toastId,
      title: "Uploading Image 🖼️",
      description: "Please wait while we upload your image to WhatsApp...",
      duration: 999999, // keep it open until manually updated
    });
  
    const result = await sendBroadcast({
      phoneNumber: selectedContacts.map((num) => String(num)),
      templateName: template,
      file: file as File,
    });
  
    if (!result.success) {
      toast({
        id: toastId,
        title: "Failed ❌",
        description: result.message || "Something went wrong.",
        variant: "destructive",
      });
      return;
    }
  
    // Show sending toast
    toast({
      id: toastId,
      title: "Sending Broadcast 📤",
      description: "Sending message to WhatsApp recipients...",
    });
  
    // Add delay for nice animation effect
    setTimeout(() => {
      toast({
        id: toastId,
        title: "Broadcast Sent ✅",
        description: `Successfully sent to ${selectedContacts.length} contact${
          selectedContacts.length > 1 ? "s" : ""
        }.`,
      });
    }, 800); // subtle delay after "sending"
    
    setSelectedContacts([]);
    setCustomMessage("");
    setSelectedImage(null);
  };
  

  return (
    <div className="h-full relative p-6 mt-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-background dark:to-gray-900">
      {/* Main Card */}
      <Card className="w-full max-w-4xl mx-auto shadow-xl border-none rounded-3xl bg-white dark:bg-zinc-900">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-dark-primary">
            📣 Send a Broadcast Message
          </CardTitle>
          <p className="text-muted-foreground mt-1">
            Reach multiple contacts at once via WhatsApp
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Template Input */}
          <div>
            <Label className="mb-1 text-sm text-muted-foreground">
              Template Name
            </Label>
            <Input
            className="mt-2"
              placeholder="e.g. payment_reminder_3"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <Label className="mb-2 text-sm text-muted-foreground">
              Upload Image (Optional)
            </Label>
            <div className="relative border-2 border-dashed mt-2 border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all hover:border-light-primary cursor-pointer bg-zinc-50 dark:bg-zinc-800">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    const url = URL.createObjectURL(file);
                    setSelectedImage({ file, url });
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {!selectedImage ? (
                <>
                  <Upload className="text-zinc-400 w-10 h-10 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click or drag an image here to upload
                  </p>
                </>
              ) : (
                <div className="relative w-full max-w-xs">
                  <img
                    src={selectedImage.url}
                    alt="Preview"
                    className="rounded-xl object-cover max-h-48 w-full border border-zinc-300"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-1 right-1 text-xs bg-black/70 text-white px-2 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contacts List */}
          <div>
            <Label className="mb-2 text-sm text-muted-foreground">
              Select Contacts
            </Label>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => {
                const allSelected = customers.every((c) =>
                  selectedContacts.includes(Number(c.whatsappNumber))
                );
                setSelectedContacts(
                  allSelected
                    ? []
                    : customers.map((c) => Number(c.whatsappNumber))
                );
              }}
            >
              {selectedContacts.length === customers.length
                ? "Deselect All"
                : "Select All"}
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-2">
              {customers.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-zinc-800"
                >
                  <Checkbox
                    className="bg-background"
                    checked={selectedContacts.includes(
                      Number(contact.whatsappNumber)
                    )}
                    onCheckedChange={() =>
                      toggleContact(Number(contact.whatsappNumber))
                    }
                  />

                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.whatsappNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Dock - Shown only if some contacts selected */}
      {selectedContacts.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-800 shadow-lg border dark:border-zinc-700 rounded-full md:px-6 md:py-3 p-2 flex items-center gap-4 z-50 md:gap-4 sm:gap-2">
          {/* Mobile View: Only show number of selected contacts with a round icon */}
          <span className="hidden md:block font-semibold text-dark-primary dark:text-white">
            {selectedContacts.length}{" "}
            {selectedContacts.length === 1 ? "Contact" : "Contacts"} Selected
          </span>

          {/* For mobile view, show only the count with an icon */}
          <div className="md:hidden flex items-center justify-between gap-2">
            <span className="font-semibold text-dark-primary dark:text-white">
              {selectedContacts.length}
            </span>
          </div>

          {/* Send Now Button */}
          <Button
            onClick={handleBroadcast}
            className="rounded-full bg-light-primary hover:bg-light-primary/90 text-white"
          >
            Send Now
          </Button>
        </div>
      )}
    </div>
  );
}
