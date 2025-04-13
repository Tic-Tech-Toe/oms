// @ts-nocheck
"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ShoppingBag, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ShoppingBagDialog = ({ cartState, setCartState }) => {
  const cartItems = Object.values(cartState);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer">
          <ShoppingBag size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl shadow-2xl border dark:border-zinc-700 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
            🛒 Shopping Bag
          </DialogTitle>
        </DialogHeader>

        {cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.itemId}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    {item.itemName}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    ₹{item.quantity * item.price}
                  </p>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setCartState((prev) => {
                        const updated = { ...prev };
                        delete updated[item.itemId];
                        return updated;
                      });
                    }}
                  >
                    <Trash size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-200 text-base font-semibold">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-zinc-400 mt-4">
            Your cart is empty
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingBagDialog;
