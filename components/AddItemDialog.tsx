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
import { X } from "lucide-react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemType } from "@/types/orderType";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Schema
const AddItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  cPrice: z.number().min(0.01, "Cost Price must be > 0"),
  sPrice: z.number().min(0.01, "Selling Price must be > 0"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  itemImage: z.string().optional(),
  sku: z.string().optional(),
  category: z.string().optional(),
});


type FormData = z.infer<typeof AddItemSchema>;

export default function AddItemDialog({
  onAdd,
  onClose,
}: {
  onAdd: (item: ItemType) => void;
  onClose: () => void;
}) {
  const methods = useForm<FormData>({
    resolver: zodResolver(AddItemSchema),
    defaultValues: {
      name: "",
      price: 0,
      quantity: 1,
      itemImage: "",
      sku: "",
      category: "",
    },
  });

  const { toast } = useToast(); // ✅ Use toast

  const onSubmit = (data: FormData) => {
    const itemWithId: ItemType = {
      itemId: crypto.randomUUID(),
      ...data,
    };
    // alert("Addign Item")

    onAdd(itemWithId);
    toast({
      title: "Item added",
      description: `${data.name} added to inventory.`,
    });
    methods.reset(); // Clear form
    onClose(); // ✅ Close dialog
  };

  useEffect(() => {
    methods.reset(); // Reset form when dialog opens
  }, []);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="p-6 border border-zinc-300/20 dark:border-white/10 shadow-2xl rounded-xl max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Item</DialogTitle>
          <DialogDescription>
            Enter item details to add it to inventory
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-3" />

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FloatingInput name="name" label="Item Name" required />
            <div className="flex gap-4 items-center">

            <FloatingInput name="cPrice" label="Cost Price" type="number" step="0.01" required />
            <FloatingInput name="sPrice" label="Selling Price" type="number" step="0.01" required />
            </div>
            <FloatingInput
              name="quantity"
              label="Quantity"
              type="number"
              required
            />
            {/* <FloatingInput name="sku" label="SKU" /> */}
            {/* <FloatingInput name="category" label="Category" /> */}
            {/* <FloatingInput name="itemImage" label="Image URL" /> */}

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
                type="submit"
                className="h-10 px-6 bg-light-primary text-white rounded-lg hover:scale-[1.02]"
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

function FloatingInput({
  label,
  name,
  type = "text",
  required = false,
  step,
}: {
  label: string;
  name: keyof FormData;
  type?: string;
  required?: boolean;
  step?:string
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
      {...register(name, { valueAsNumber: type === "number" })}
      type={type}
      placeholder={`Enter ${label.toLowerCase()}`}
      required={required}
      step={step}
      className="h-11 px-3 rounded-xl text-sm border shadow-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black transition-all"
    />
    {errors[name] && (
      <p className="text-xs text-red-500 mt-1">
        {(errors[name]?.message as string) || ""}
      </p>
    )}
  </div>
  );
}
