import React, { useState } from "react";
import { ItemType, OrderItem, OrderType } from "@/types/orderType";
import { useInventoryStore } from "@/hooks/zustand_stores/useInventoryStore";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrderDetailComponent({ order }: { order: OrderType }) {
  const inventory = useInventoryStore((state) => state.inventory);
  const updateOrderItemQuantity = useOrderStore((state) => state.updateOrderItemQuantity);
  const addItemToOrder = useOrderStore((state) => state.addItemToOrder);

  const [open, setOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    () =>
      order.items.reduce((acc, item) => {
        acc[item.itemId] = item.quantity;
        return acc;
      }, {} as Record<string, number>)
  );

  const handleQuantityChange = (itemId: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleQuantityBlur = (itemId: string) => {
    const newQty = quantities[itemId] ?? 0;
    updateOrderItemQuantity(order.id, itemId, newQty);
  };

  const handleAddItem = (item: ItemType) => {
    addItemToOrder(order.id, { ...item, quantity: 1, itemId: item.id });
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header: Add Item Button */}
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-semibold">Items</h4>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-blue-500 text-white hover:bg-blue-600">Add Item</Button>
          </DialogTrigger>
          <DialogContent className="w-[400px] bg-white rounded-lg shadow-lg p-6">
            <h5 className="text-lg font-semibold mb-4">Add Item to Order</h5>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {inventory.map((item) => (
                <div
                  key={item.itemId}
                  className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-700">{item.itemName}</p>
                    <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                  </div>
                  <Button size="xs" className="bg-green-500 text-white" onClick={() => handleAddItem(item)}>
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* List of Current Order Items */}
      <div className="space-y-4">
        {order.items.map((item: OrderItem) => (
          <div
            key={item.itemId}
            className="flex justify-between items-center  rounded-2xl shadow px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all"
          >
            <div>
              <h5 className="text-md font-semibold text-gray-800 dark:text-white">{item.itemName}</h5>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={0}
                className="w-20 text-center"
                value={quantities[item.itemId] ?? 0}
                onChange={(e) =>
                  handleQuantityChange(item.itemId, parseInt(e.target.value, 10))
                }
                onBlur={() => handleQuantityBlur(item.itemId)}
              />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                ₹{((quantities[item.itemId] ?? 0) * item.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
