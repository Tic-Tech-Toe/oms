"use client";

import { useEffect, useState, useMemo } from "react";
import { auth } from "@/app/config/firebase";
import { Button } from "@/components/ui/button";
import { Search, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useInventoryStore } from "@/hooks/zustand_stores/useInventoryStore";
import { useToast } from "@/hooks/use-toast";
import AddItemDialog from "@/components/AddItemDialog";
import clsx from "clsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Inventory() {
  const user = auth.currentUser;
  const { toast } = useToast();
  const { inventory, loadInventory, updateItem, deleteItem } = useInventoryStore();

  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [editState, setEditState] = useState<Record<string, any>>({});
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "quantity">("name");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  useEffect(() => {
    if (user?.uid) loadInventory(user.uid);
  }, [user]);

  const handleFieldChange = (id: string, key: string, value: any) =>
    setEditState((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));

  const handleSave = async (id: string) => {
    if (!user?.uid) return;
    const updates = editState[id];
    try {
      await updateItem(user.uid, id, updates);
      toast({ title: "Saved", description: "Item updated successfully." });
      setExpandedItemId(null);
      setEditState((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not update item.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.uid) return;
    try {
      await deleteItem(user.uid, id);
      toast({ title: "Deleted", description: "Item removed." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive",
      });
    }
  };

  const filteredInventory = useMemo(() => {
    let items = [...inventory];
    if (search) {
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          (i.sku ?? "").toLowerCase().includes(search.toLowerCase())
      );
    }
    if (categoryFilter !== "All")
      items = items.filter((i) => i.category === categoryFilter);

    items.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return (a.sPrice ?? 0) - (b.sPrice ?? 0);
      if (sortBy === "quantity") return (a.quantity ?? 0) - (b.quantity ?? 0);
      return 0;
    });
    return items;
  }, [inventory, search, sortBy, categoryFilter]);

  const categories = ["All", ...new Set(inventory.map((i) => i.category ?? ""))];

  return (
    <div className="p-6 min-h-screen dark:bg-neutral-950 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Inventory</h1>
        
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 dark:border-neutral-700 pl-9 pr-3 py-2 text-sm bg-white dark:bg-neutral-900 dark:text-gray-100"
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

      {/* Mobile: Card View */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {filteredInventory.map((item) => (
          <InventoryCardView
            key={item.itemId}
            item={item}
            editing={editState[item.itemId]}
            expanded={expandedItemId === item.itemId}
            onExpand={() =>
              setExpandedItemId((prev) =>
                prev === item.itemId ? null : item.itemId
              )
            }
            onDelete={() => handleDelete(item.itemId)}
            onSave={() => handleSave(item.itemId)}
            onChange={handleFieldChange}
          />
        ))}
      </div>

      {/* Desktop: Table View */}
      <div className="hidden md:block overflow-x-auto">
        <InventoryTableView
          items={filteredInventory}
          onDelete={handleDelete}
          onChange={handleFieldChange}
          onSave={handleSave}
        />
      </div>

      {showAddItemDialog && (
        <AddItemDialog onClose={() => setShowAddItemDialog(false)} />
      )}
    </div>
  );
}

/* ---------------- Card View ---------------- */
function InventoryCardView({ item, editing = {}, expanded, onExpand, onDelete, onSave, onChange }: any) {
  const getBadgeColor = (qty: number) =>
    qty < 20 ? "bg-red-500" : qty < 50 ? "bg-yellow-400" : "bg-green-500";

  return (
    <div
      className={clsx(
        "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm transition-all",
        expanded && "ring-2 ring-blue-500"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            {editing.name ?? item.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.category || "Uncategorized"}</p>
        </div>
        <span
          className={`text-xs text-white px-2 py-0.5 rounded-full font-medium ${getBadgeColor(
            editing.quantity ?? item.quantity
          )}`}
        >
          {editing.quantity ?? item.quantity} pcs
        </span>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="text-sm">
          <span className="block text-gray-600 dark:text-gray-400">
            Cost ₹{editing.cPrice ?? item.cPrice}
          </span>
          <span className="block text-gray-800 dark:text-gray-200 font-medium">
            Sell ₹{editing.sPrice ?? item.sPrice}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={onExpand}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2">
          <EditableField
            label="Name"
            value={editing.name ?? item.name}
            onChange={(v) => onChange(item.itemId, "name", v)}
          />
          <EditableField
            label="Quantity"
            type="number"
            value={editing.quantity ?? item.quantity}
            onChange={(v) => onChange(item.itemId, "quantity", parseInt(v))}
          />
          <Button onClick={onSave} className="w-full mt-2 rounded-xl text-sm">
            Save
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Table View ---------------- */
function InventoryTableView({ items, onDelete, onChange, onSave }: any) {
  const [editingSellId, setEditingSellId] = useState<string | null>(null);
  const [tempSellValue, setTempSellValue] = useState<number | null>(null);

  const handleSellClick = (item: any) => {
    setEditingSellId(item.itemId);
    setTempSellValue(item.sPrice);
  };

  const handleSellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTempSellValue(isNaN(value) ? 0 : value);
  };

  const handleSellSave = (item: any) => {
    if (tempSellValue !== null) {
      onChange(item.itemId, "sPrice", tempSellValue);
      onSave(item.itemId);
    }
    setEditingSellId(null);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-neutral-800">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-neutral-800 text-left text-gray-700 dark:text-gray-200">
            <TableHead className="p-3">Name</TableHead>
            <TableHead className="p-3">Cost</TableHead>
            <TableHead className="p-3">Sell</TableHead>
            <TableHead className="p-3">Qty</TableHead>
            <TableHead className="p-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => (
            <TableRow
              key={item.itemId}
              className="border-b dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
            >
              <TableCell className="p-3">{item.name}</TableCell>
              <TableCell className="p-3">₹{item.cPrice}</TableCell>

              {/* Editable Sell Column */}
              <TableCell
                className="p-3 cursor-pointer"
                onClick={() => editingSellId !== item.itemId && handleSellClick(item)}
              >
                {editingSellId === item.itemId ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={tempSellValue ?? ""}
                      onChange={handleSellChange}
                      className="w-20 rounded-md border px-2 py-1 text-sm dark:bg-neutral-800 dark:text-gray-100"
                      autoFocus
                      onBlur={() => handleSellSave(item)}
                    />
                    <Button
                      size="sm"
                      className="px-2 py-1 text-xs rounded-lg"
                      onClick={() => handleSellSave(item)}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>₹{item.sPrice}</>
                )}
              </TableCell>

              <TableCell className="p-3">{item.quantity}</TableCell>

              <TableCell className="p-3 text-right">
                <Button
                  onClick={() => onSave(item.itemId)}
                  className="text-xs rounded-lg px-3 py-1"
                >
                  Save
                </Button>
                <button
                  onClick={() => onDelete(item.itemId)}
                  className="ml-2 text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ---------------- Shared Field ---------------- */
function EditableField({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="block text-gray-500 dark:text-gray-400 text-xs mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-1.5 text-sm dark:bg-neutral-800 dark:text-gray-100"
      />
    </div>
  );
}
