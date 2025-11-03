import React, { use, useState } from "react";
import { ItemType, OrderItem, OrderType } from "@/types/orderType";
import { useInventoryStore } from "@/hooks/zustand_stores/useInventoryStore";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/hooks/useCurrency";

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
    <div className="space-y-6 p-6">
     {/* Header: Edit Order Button */}
<div className="flex justify-between items-center">
  <h4 className="text-xl font-semibold">Items</h4>
 
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
              
                <span>{quantities[item.itemId] ?? 0}</span>
               
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {useCurrency((quantities[item.itemId] ?? 0) * item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
