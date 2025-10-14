"use client";

import { useEffect, useState, useMemo } from "react";
import { auth } from "@/app/config/firebase";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronDown, ChevronUp, Search } from "lucide-react";
import { ItemType } from "@/types/orderType";
import clsx from "clsx";
import { useInventoryStore } from "@/hooks/zustand_stores/useInventoryStore";
import { useToast } from "@/hooks/use-toast";
import AddItemDialog from "@/components/AddItemDialog";

export default function Inventory() {
  const user = auth.currentUser;
  const { toast } = useToast();
  const { inventory, loadInventory, updateItem, deleteItem } =
    useInventoryStore();

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

  const getBadgeColor = (qty: number) => {
    if (qty < 20) return "bg-red-500";
    if (qty < 50) return "bg-yellow-400";
    return "bg-green-500";
  };

  // 🔹 Filtered & Sorted inventory
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
      <div className="flex flex-col md:flex-row  items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Inventory</h1>
        
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

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 rounded-xl border dark:bg-neutral-800 dark:text-white"
        >
          <option value="name">Sort: Name</option>
          <option value="price">Sort: Price</option>
          <option value="quantity">Sort: Quantity</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border dark:bg-neutral-800 dark:text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat || "Uncategorized"}
            </option>
          ))}
        </select>
        <Button
          onClick={() => setShowAddItemDialog(true)}
          className="bg-light-primary text-white px-4 py-2 rounded-2xl hover:bg-blue-700"
        >
          + Add Item
        </Button>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {filteredInventory.map((item) => {
          const editing = editState[item.itemId] || {};
          const expanded = expandedItemId === item.itemId;

          return (
            <div
              key={item.itemId}
              className={clsx(
                "self-start relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-3xl px-6 py-5 shadow-md transition-all",
                expanded ? "ring-2 ring-blue-500" : ""
              )}
            >
              {/* Header Section */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {editing.name ?? item.name}
                  </h2>

                  {/* Prices */}
                  <div className="flex flex-wrap gap-2 mt-1 text-sm font-medium">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                      Cost: ₹{editing.cPrice ?? item.cPrice}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                      Selling: ₹{editing.sPrice ?? item.sPrice}
                    </span>
                  </div>
                </div>

                {/* Quantity Badge */}
                <span
                  className={`text-xs text-white px-2 py-0.5 rounded-full font-medium text-nowrap ${getBadgeColor(
                    editing.quantity ?? item.quantity
                  )}`}
                >
                  {editing.quantity ?? item.quantity} pcs
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    onClick={() =>
                      setExpandedItemId((prev) =>
                        prev === item.itemId ? null : item.itemId
                      )
                    }
                  >
                    {expanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.itemId)}
                    className="hover:scale-110 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {expanded && (
                  <Button
                    onClick={() => handleSave(item.itemId)}
                    className="rounded-xl text-sm py-1 px-4  border-2 border-light-primary dark:border-white/20 
                   dark:bg-dark-dark-gray dark:hover:bg-white dark:hover:text-black 
                   hover:bg-dark-dark-gray hover:text-white transition"
                  >
                    Save
                  </Button>
                )}
              </div>

              {/* Expanded Section */}
              {expanded && (
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <EditableField
                    label="Name"
                    value={editing.name ?? item.name}
                    onChange={(val) =>
                      handleFieldChange(item.itemId, "name", val)
                    }
                  />
                  <EditableField
                    label="Cost Price"
                    type="number"
                    value={editing.cPrice ?? item.cPrice}
                    onChange={(val) =>
                      handleFieldChange(item.itemId, "cPrice", parseFloat(val))
                    }
                  />
                  <EditableField
                    label="Selling Price"
                    type="number"
                    value={editing.sPrice ?? item.sPrice}
                    onChange={(val) =>
                      handleFieldChange(item.itemId, "sPrice", parseFloat(val))
                    }
                  />
                  <EditableField
                    label="Quantity"
                    type="number"
                    value={editing.quantity ?? item.quantity}
                    onChange={(val) =>
                      handleFieldChange(
                        item.itemId,
                        "quantity",
                        parseFloat(val)
                      )
                    }
                  />
                  {/* <EditableField
                    label="Category"
                    value={editing.category ?? item.category ?? ""}
                    onChange={(val) =>
                      handleFieldChange(item.itemId, "category", val)
                    }
                  /> */}
                  {/* <EditableField
                    label="SKU"
                    value={editing.sku ?? item.sku ?? ""}
                    onChange={(val) =>
                      handleFieldChange(item.itemId, "sku", val)
                    }
                  /> */}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredInventory.length === 0 && (
        <div className="text-gray-400 mt-10 text-center">
          {inventory.length === 0
            ? "No inventory yet."
            : "No items match your search/filter."}
        </div>
      )}

      {/* Add Dialog */}
      {showAddItemDialog && (
        <AddItemDialog
          onAdd={(item) => {
            if (user?.uid) {
              useInventoryStore.getState().addItem(user.uid, item);
            }
          }}
          onClose={() => setShowAddItemDialog(false)}
        />
      )}
    </div>
  );
}

// 🔹 Editable Field
function EditableField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-gray-500 mb-1">{label}</label>
      <input
        className="w-full rounded-lg border px-3 py-1.5 text-sm dark:bg-neutral-800 dark:text-white"
        value={value}
        type={type}
        step={type === "number" ? "0.01" : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
