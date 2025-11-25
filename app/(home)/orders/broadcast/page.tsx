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
import Image from "next/image";

export default function BroadcastPage() {
  const [search, setSearch] = useState("");
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
        variant: "destructive",
      });
      return;
    }

    const file = selectedImage?.file;
   


    const toastId = Math.random().toString(); // unique ID

    toast({
      id: toastId,
      title: "Uploading Image",
      description: "Please wait while we upload your image to WhatsApp...",
      variation: "loading",
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
      title: "Sending Broadcast",
      description: "Sending message to WhatsApp recipients...",
      variant: "loading",
    });

    // Add delay
    setTimeout(() => {
      toast({
        id: toastId,
        title: "Broadcast Sent ",
        description: `Successfully sent to ${selectedContacts.length} contact${
          selectedContacts.length > 1 ? "s" : ""
        }.`,
        variant: "success",
      });
    }, 800); // subtle delay after "sending"

    setSelectedContacts([]);
    setCustomMessage("");
    setSelectedImage(null);
  };

  const term = search.trim().toLowerCase();

const filteredCustomers = customers
  .filter((c) => {
    if (!term) return true;
    return (
      c.name.toLowerCase().includes(term) ||
      c.shippingAddress?.toLowerCase().includes(term)
    );
  })
  .sort((a, b) => a.name.localeCompare(b.name));


  return (
    <div className="relative p-6 mt-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-background dark:to-gray-900">
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

            {/* Clickable Upload Card */}
            <label
              htmlFor="imageUpload"
              className="relative border-2 border-dashed mt-2 border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all hover:border-light-primary cursor-pointer bg-zinc-50 dark:bg-zinc-800"
            >
              {!selectedImage ? (
                <>
                  <Upload className="text-zinc-400 w-10 h-10 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag an image here
                  </p>
                </>
              ) : (
                <div className="relative w-full max-w-xs h-48 rounded-xl overflow-hidden border border-zinc-300">
                  <Image
                    src={selectedImage.url}
                    alt="Preview"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                    }}
                    className="absolute top-1 right-1 text-xs bg-black/70 text-white px-2 py-1 rounded-md"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </label>

            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  const url = URL.createObjectURL(file);
                  setSelectedImage({ file, url });
                  e.target.value = ""; // Reset input to allow re-selection
                }
              }}
              className="hidden"
            />
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
            <Input
  placeholder="Search by name or address..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="mt-2 mb-3"
/>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
  {filteredCustomers.map((contact) => (
    <div
      key={contact.id}
      className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border flex gap-3"
    >
      {/* Checkbox */}
      <Checkbox
        className="mt-1"
        checked={selectedContacts.includes(Number(contact.whatsappNumber))}
        onCheckedChange={() =>
          toggleContact(Number(contact.whatsappNumber))
        }
      />

      {/* Info */}
      <div className="flex flex-col">
        <p className="font-semibold text-[15px]">{contact.name}</p>
        <p className="text-sm text-muted-foreground">
          {contact.whatsappNumber}
        </p>

        {contact.shippingAddress && (
          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
            {contact.shippingAddress}
          </p>
        )}
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
