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
import { Input } from "@/components/ui/input";
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
      <DialogContent className="p-6 border border-zinc-300/20 dark:border-white/10 shadow-2xl rounded-xl max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Customer</DialogTitle>
          <DialogDescription>Update the details below</DialogDescription>
        </DialogHeader>
        <Separator className="my-3" />

        <div className="space-y-4 mt-4">
          <StyledInput label="Reward Point" name="rewardPoint" type="number" value={formData.rewardPoint} onChange={handleChange} />
          <StyledInput label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <StyledInput label="WhatsApp Number" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} required />
          <StyledInput label="Email" name="email" value={formData.email || ""} onChange={handleChange} type="email" />
          <StyledInput label="Phone Number" name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleChange} />
        </div>

        <DialogFooter className="mt-6 flex justify-between items-center">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            className="h-10 text-zinc-500 hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleSubmit}
            className="h-10 px-6 bg-black text-white rounded-md hover:scale-[1.02]"
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
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="relative w-full flex flex-col gap-2">
      <label htmlFor={name} className="text-slate-600 text-sm font-medium">
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
        className="h-11 px-3 rounded-xl text-sm border shadow-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
      />
    </div>
  );
}
