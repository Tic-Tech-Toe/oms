import { ItemType, OrderItem, OrderType } from "@/types/orderType";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { NumberTicker } from "./magicui/number-ticker";

// ✅ Counter Component with Proper Typing
const Counter = ({
  item,
  updateQuantity,
}: {
  item: OrderItem;
  updateQuantity: (itemId: string, newQuantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState<number>(item.quantity);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(item.itemId!, newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(item.itemId!, newQuantity);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex items-center border rounded-xl overflow-hidden hover:ring-2">
        <Plus
          size={24}
          className="border border-r h-full px-1 dark:hover:bg-zinc-800 hover:bg-light-light-gray cursor-pointer"
          onClick={handleIncrement}
        />
        {/* ✅ NumberTicker added for animation */}
        <span className="text-sm font-semibold border border-x py-1 px-2 h-full">{quantity}</span>
        <Minus
          size={24}
          className="border p-1 border-l h-full px-1 dark:hover:bg-zinc-800 hover:bg-light-light-gray cursor-pointer"
          onClick={handleDecrement}
        />
      </div>
      <span className="text-sm font-semibold text-center mt-2">
        &#x20B9; {(quantity * item.price).toFixed(2)}
      </span>
    </div>
  );
};

// ✅ OrderDetailComponent with Proper Types
const OrderDetailComponent = ({ order }: { order: OrderType }) => {
  const [updatedItems, setUpdatedItems] = useState<OrderItem[]>(order.items);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setUpdatedItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <div className="grid gap-2 grid-rows-1 mt-4">
      {updatedItems.map((item, i) => (
        <div key={i} className="flex items-center justify-between row-span-1 px-4">
          <div className="flex gap-2">
            {/* {item && <Image
              src={item.itemImage}
              alt={item.name}
              width={100}
              height={100}
              className="rounded-xl shadow-md"
            />} */}
            
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs dark:text-light-light-gray text-gray-700">{item.category}</span>
              <span className="text-md font-semibold">{item.itemName}</span>
            </div>
          </div>
          <Counter item={item} updateQuantity={updateQuantity} />
        </div>
      ))}
    </div>
  );
};

export default OrderDetailComponent;
