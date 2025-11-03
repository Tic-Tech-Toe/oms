"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrency } from "@/hooks/useCurrency";
import { Edit, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

const InventoryTableView = ({ items, onDelete, onChange, onSave }: any) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<any>({});

  const startEditing = (item: any) => {
    setEditingId(item.itemId);
    setEditBuffer({ ...item });
  };

  const handleInputChange = (key: string, value: any, itemId: string) => {
    const updated = { ...editBuffer, [key]: value };
    setEditBuffer(updated);

    // 🔁 keep parent editState in sync (important for your handleSave)
    onChange(itemId, key, value);
  };

  const saveChanges = (itemId: string) => {
    onSave(itemId); // parent will use editState[itemId]
    setEditingId(null);
    setEditBuffer({});
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditBuffer({});
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-neutral-900/70 text-gray-700 dark:text-gray-100">
            <TableHead className="p-3">Name</TableHead>
            <TableHead className="p-3">Cost</TableHead>
            <TableHead className="p-3">Sell</TableHead>
            <TableHead className="p-3">Qty</TableHead>
            <TableHead className="p-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item: any) => {
            const isEditing = editingId === item.itemId;

            return (
              <TableRow
                key={item.itemId}
                className={`border-b border-gray-200 dark:border-neutral-800 transition-colors duration-200 ${
                  isEditing
                    ? "bg-yellow-50 dark:bg-neutral-800/70"
                    : "hover:bg-gray-50 dark:hover:bg-neutral-800/40"
                }`}
              >
                {isEditing ? (
                  <>
                    <TableCell className="p-3">
                      <input
                        type="text"
                        value={editBuffer.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value, item.itemId)
                        }
                        className="w-full rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </TableCell>

                    <TableCell className="p-3">
                      <input
                        type="number"
                        value={editBuffer.cPrice || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cPrice",
                            parseFloat(e.target.value) || 0,
                            item.itemId
                          )
                        }
                        className="w-24 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </TableCell>

                    <TableCell className="p-3">
                      <input
                        type="number"
                        value={editBuffer.sPrice || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "sPrice",
                            parseFloat(e.target.value) || 0,
                            item.itemId
                          )
                        }
                        className="w-24 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </TableCell>

                    <TableCell className="p-3">
                      <input
                        type="number"
                        value={editBuffer.quantity || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "quantity",
                            parseInt(e.target.value) || 0,
                            item.itemId
                          )
                        }
                        className="w-20 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </TableCell>

                    <TableCell className="p-3 text-right space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg px-3 py-1 transition-colors"
                        onClick={() => saveChanges(item.itemId)}
                      >
                        <Save size={14} className="mr-1" /> Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-gray-400 dark:border-neutral-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg px-3 py-1 transition-colors"
                        onClick={cancelEditing}
                      >
                        <X size={14} className="mr-1" /> Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="p-3 text-gray-800 dark:text-gray-100">
                      {item.name}
                    </TableCell>
                    <TableCell className="p-3 text-gray-800 dark:text-gray-100">
                      {useCurrency(item.cPrice)}
                    </TableCell>
                    <TableCell className="p-3 text-gray-800 dark:text-gray-100">
                      {useCurrency(item.sPrice)}
                    </TableCell>
                    <TableCell className="p-3 text-gray-800 dark:text-gray-100">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="p-3 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 text-xs rounded-lg px-3 py-1 transition-colors"
                        onClick={() => startEditing(item)}
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg px-3 py-1 transition-colors"
                        onClick={() => onDelete(item.itemId)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTableView;
