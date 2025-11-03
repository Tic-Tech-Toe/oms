import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import EditableField from "./EditableField";

export default function InventoryCardView({
  item,
  editState,
  expandedItemId,
  onExpand,
  onChange,
  onDelete,
  onSave,
}: any) {
  const editing = editState[item.itemId] || {};
  const expanded = expandedItemId === item.itemId;

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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {item.category || "Uncategorized"}
          </p>
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
          <button onClick={() => onExpand(expanded ? null : item.itemId)}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button onClick={() => onDelete(item.itemId)}>
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
          <Button onClick={() => onSave(item.itemId)} className="w-full mt-2 rounded-xl text-sm">
            Save
          </Button>
        </div>
      )}
    </div>
  );
}
