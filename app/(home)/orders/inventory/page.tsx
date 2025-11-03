"use client";

import { useEffect, useState, useMemo } from "react";
import { auth } from "@/app/config/firebase";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useInventoryStore } from "@/hooks/zustand_stores/useInventoryStore";
import { useToast } from "@/hooks/use-toast";
import AddItemDialog from "@/components/AddItemDialog";
import InventoryCardView from "./InventoryCardView";
import InventoryTableView from "./InventoryTableView";

export default function InventoryPage() {
  const user = auth.currentUser;
  const { toast } = useToast();
  const { inventory, loadInventory, updateItem, deleteItem, addItem } = useInventoryStore();

  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [editState, setEditState] = useState<Record<string, Partial<ItemType>>>(
    {}
  );
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);

  // Search & Sort
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "quantity">("name");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  useEffect(() => {
    if (user?.uid) loadInventory(user.uid);
  }, [user]);

  const handleFieldChange = (id: string, key: keyof ItemType, value: any) => {
    setEditState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  };

  const handleSave = async (id: string) => {
    if (!user?.uid) return;
    const updates = editState[id];
    try {
      await updateItem(user.uid, id, updates);
      toast({ title: "Success", description: "Item updated successfully." });
      setExpandedItemId(null);
      setEditState((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update item.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.uid) return;
    try {
      await deleteItem(user.uid, id);
      toast({ title: "Deleted", description: "Item removed from inventory." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive",
      });
    }
  };

  const handleAdd = async (item: any) => {
    if (!user?.uid) return; 
    try{
      await addItem(user.uid, item);
      toast({ title: "Added", description: "Item added successfully." });
    } catch {
      toast({
        title: "Error",
        description: "Could not add item.",
        variant: "destructive",
      });
    }
  }

  const filteredInventory = useMemo(() => {
    let items = [...inventory];

    if (search) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.sku ?? "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      items = items.filter((item) => item.category === categoryFilter);
    }

    items.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return (a.sPrice ?? 0) - (b.sPrice ?? 0);
      if (sortBy === "quantity") return (a.quantity ?? 0) - (b.quantity ?? 0);
      return 0;
    });

    return items;
  }, [inventory, search, sortBy, categoryFilter]);

  // 🔹 Get unique categories
  const categories = [
    "All",
    ...new Set(inventory.map((i) => i.category ?? "")),
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Inventory
        </h1>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border pl-9 pr-3 py-2 text-sm dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-4 ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border dark:bg-neutral-900 dark:text-gray-100"
          >
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="quantity">Sort: Quantity</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border dark:bg-neutral-900 dark:text-gray-100"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat || "Uncategorized"}
              </option>
            ))}
          </select>

          <Button
            onClick={() => setShowAddItemDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-5 py-2.5"
          >
            + Add Item
          </Button>
        </div>
      </div>

      {/* Views */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {filteredInventory.map((item) => (
          <InventoryCardView
            key={item.itemId}
            item={item}
            editState={editState}
            expandedItemId={expandedItemId}
            onExpand={setExpandedItemId}
            onChange={handleFieldChange}
            onDelete={handleDelete}
            onSave={handleSave}
          />
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <InventoryTableView
          items={filteredInventory}
          onDelete={handleDelete}
          onChange={handleFieldChange}
          onSave={handleSave}
        />
      </div>

      {showAddItemDialog && (
        <AddItemDialog onClose={() => setShowAddItemDialog(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
