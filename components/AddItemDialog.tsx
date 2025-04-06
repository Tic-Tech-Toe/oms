"use client";

import { ItemType } from "@/types/orderType";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type AddItemDialogProps = {
  onAdd: (item: ItemType) => void;
  onClose: () => void;
};

const AddItemDialog: React.FC<AddItemDialogProps> = ({ onAdd, onClose }) => {
  const [itemData, setItemData] = useState<ItemType>({
    itemId: crypto.randomUUID(),
    name: "",
    price: 0,
    itemImage: "",
    sku: "",
    category: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(itemData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-full max-w-md shadow-xl relative border border-zinc-200 dark:border-zinc-700">
        <Button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black dark:hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-semibold mb-5">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Item Name", name: "name", type: "text", required: true },
            { label: "Price", name: "price", type: "number", required: true },
            { label: "Image URL", name: "itemImage", type: "text" },
            { label: "SKU", name: "sku", type: "text" },
            { label: "Category", name: "category", type: "text" },
          ].map(({ label, name, type, required }) => (
            <div className="flex flex-col gap-1" key={name}>
              <Label htmlFor={name} className="text-sm text-zinc-600 dark:text-zinc-300">
                {label}
              </Label>
              <Input
                id={name}
                name={name}
                type={type}
                value={itemData[name as keyof ItemType] as string | number}
                onChange={handleChange}
                required={required}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-lg ring-1 ring-red-500 hover:ring-2"
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-lg bg-light-primary hover:bg-light-button-hover" variant="default">
              Add Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemDialog;
