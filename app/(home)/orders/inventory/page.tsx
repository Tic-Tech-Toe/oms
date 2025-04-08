"use client";

import { useEffect, useState } from "react";
import AddItemDialog from "@/components/AddItemDialog";
import { auth } from "@/app/config/firebase";
import { mockItemsData } from "@/data/item";
import { Button } from "@/components/ui/button";
import { addItem, getItems } from "@/utils/getFireStoreInventory";
import { ItemType } from "@/types/orderType";

export default function Inventory() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchItems = async () => {
      if (user?.uid) {
        const data = await getItems(user.uid);
        setItems(data);
      }
    };

    fetchItems();
  }, [user]);

  const handleAddItem = async (item: ItemType) => {
    if (!user?.uid) return;
    await addItem(user.uid, item);
    setItems((prev) => [...prev, item]);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Inventory</h1>
          <Button
            onClick={() => setShowDialog(true)}
            className="bg-light-primary text-white px-4 py-2 rounded-2xl hover:bg-blue-700"
          >
            + Add Item
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.itemId}
              className="rounded-3xl border dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all p-4"
            >
              {/* <img
                src={item.itemImage}
                alt={item.name}
                className="w-full h-40 object-cover rounded-2xl mb-3"
              /> */}
              <h2 className="text-2xl font-semibold">{item.name}</h2>
              <p className="text-gray-500 text-sm">₹{item.price}</p>
              {item.category && (
                <p className="text-xs text-gray-400 mt-1">Category: {item.category}</p>
              )}
              {item.sku && (
                <p className="text-xs text-gray-400">SKU: {item.sku}</p>
              )}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-gray-400 mt-10 text-center">No inventory yet.</div>
        )}
      </div>

      {showDialog && (
        <AddItemDialog
          onAdd={handleAddItem}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
