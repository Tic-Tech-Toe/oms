"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
const AddCustomerSchema = z.object({
  // id:z.string(),
  name: z.string().min(1, "Full Name is required"),
  whatsappNumber: z.string().min(10, "WhatsApp number is required"),
  rewardPoint: z.number(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  alternatePhoneNumber: z.string().optional(),
  shippingAddress: z.string().optional(),
  billingAddress: z.string().optional(),
});

type FormData = z.infer<typeof AddCustomerSchema>;

export default function AddCustomerDialog({
  onSubmitCustomer,
}: {
  onSubmitCustomer: (customer: FormData) => void;
}) {
  const [open, setOpen] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(AddCustomerSchema),
    defaultValues: {
      // id: "pers1",
      name: "",
      whatsappNumber: "",
      rewardPoint: 0,
      email: "",
      phoneNumber: "",
      alternatePhoneNumber: "",
      shippingAddress: "",
      billingAddress: "",
    },
  });

  const handleDialogClose = () => {
    methods.reset();
    setOpen(false);
  };

  const onSubmit = (data: FormData) => {
    //console.log("Customer form data:", data);
    onSubmitCustomer(data);
    handleDialogClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-light-primary text-white px-4 py-2 rounded-2xl hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </DialogTrigger>

      <DialogContent className="p-6  border border-zinc-300/20 dark:border-white/10 shadow-2xl rounded-xl max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Customer
          </DialogTitle>
          <DialogDescription>
            Fill the details below to add a customer
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-3" />

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FloatingInput label="Full Name" name="name" required />
            <FloatingInput
              label="WhatsApp Number"
              name="whatsappNumber"
              required
            />
            <FloatingInput label="Email" name="email" type="email" />
            {/* <FloatingInput label="Phone Number" name="phoneNumber" /> */}
            {/* <FloatingInput label="Alternate Phone" name="alternatePhoneNumber" /> */}
            {/* <FloatingInput label="Shipping Address" name="shippingAddress" /> */}
            {/* <FloatingInput label="Billing Address" name="billingAddress" /> */}

            <DialogFooter className="mt-6 flex justify-between items-center">
              <Button
                type="button"
                onClick={handleDialogClose}
                variant="ghost"
                className="h-10 text-zinc-500 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </Button>
              <Button
                type="submit"
                className="h-10 px-6 bg-black text-white rounded-md hover:scale-[1.02]"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

import { useFormContext } from "react-hook-form";

function FloatingInput({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: keyof FormData;
  type?: string;
  required?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <div className="relative w-full flex flex-col gap-2">
      <label htmlFor={name} className="text-slate-600 text-sm font-medium">
        {label}
      </label>
      <input
        {...register(name)}
        type={type}
        placeholder="Enter..."
        required={required}
        className="h-11 px-3 rounded-xl text-sm  border  shadow-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus focus:border-black transition-all"
      />
      {errors[name] && (
        <p className="text-xs text-red-500 mt-1">
          {(errors[name]?.message as string) || ""}
        </p>
      )}
    </div>
  );
}
