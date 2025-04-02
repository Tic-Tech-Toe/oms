//@ts-nocheck

"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ShoppingBag, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShoppingBagDialog = ({ cartState, setCartState }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer">
          <ShoppingBag size={24} />
          {Object.keys(cartState).length > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {Object.keys(cartState).length}
            </span>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Shopping Cart</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {Object.values(cartState).length > 0 ? (
            Object.values(cartState).map((item) => (
              <div key={item.itemId} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">{item.sku} - {item.quantity}x</span>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    setCartState((prev) => {
                      const newCart = { ...prev };
                      delete newCart[item.itemId];
                      return newCart;
                    });
                  }}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty</p>
          )}
        </div>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingBagDialog;
