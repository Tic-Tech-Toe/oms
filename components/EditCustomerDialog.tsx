"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { CustomerType } from "@/types/orderType";
import { X } from "lucide-react";

interface Props {
  customer: CustomerType;
  open: boolean;
  onClose: () => void;
  onSave: (updatedData: CustomerType) => void;
}

export default function EditCustomerDialog({
  customer,
  open,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] = useState(customer);

  useEffect(() => {
    setFormData(customer);
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="p-5 sm:p-6 border border-zinc-300/20 dark:border-white/10 
                   shadow-2xl rounded-xl 
                   w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto 
                   bg-white dark:bg-zinc-900 
                   text-zinc-800 dark:text-zinc-100 
                   scrollbar-thin scrollbar-thumb-zinc-400/40 
                   scrollbar-track-transparent scrollbar-thumb-rounded-full"
      >
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Edit Customer
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Update the details below
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-3" />

        <div className="space-y-3 sm:space-y-4">
          <StyledInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Stack inputs vertically on mobile */}
          <div className="flex flex-col sm:flex-row sm:gap-4 gap-3">
            <StyledInput
              label="Reward Point"
              name="rewardPoint"
              type="number"
              value={formData.rewardPoint}
              onChange={handleChange}
            />
            <StyledInput
              label="WhatsApp Number"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              required
            />
          </div>

          <StyledInput
            label="GST Number"
            name="GSTNumber"
            value={formData.GSTNumber || ""}
            onChange={handleChange}
          />
          <StyledInput
            label="Shipping Address"
            name="shippingAddress"
            value={formData.shippingAddress?.replaceAll("|", ",") || ""}
            onChange={handleChange}
            type="text"
          />
          <StyledInput
            label="Email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            type="email"
          />
        </div>

        <DialogFooter
          className="mt-6 flex flex-row justify-end  items-center gap-2"
        >
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            className="h-9 w-9 flex items-center justify-center 
                       text-zinc-500 hover:text-red-600 hover:bg-red-50 
                       dark:hover:bg-red-900/30 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>

          <Button
            onClick={handleSubmit}
            className="h-9 px-4 sm:px-6 bg-black text-white 
                       dark:bg-white dark:text-black 
                       rounded-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StyledInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="relative w-full flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-zinc-600 dark:text-zinc-300 text-sm font-medium"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder="Enter..."
        className="h-10 px-3 rounded-lg text-sm border border-zinc-300 dark:border-zinc-700 
                   bg-white dark:bg-zinc-800 
                   focus:ring-2 focus:ring-black dark:focus:ring-white 
                   outline-none transition-all"
      />
    </div>
  );
}
