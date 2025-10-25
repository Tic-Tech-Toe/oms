"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils"; // (optional) for cleaner class handling

const SwitchGST = ({
  value = "GST",
  onChange,
}: {
  value?: "GST" | "IGST";
  onChange?: (v: "GST" | "IGST") => void;
}) => {
  const [gstType, setGstType] = useState<"GST" | "IGST">(value);

  const handleToggle = (checked: boolean) => {
    const newValue = checked ? "IGST" : "GST";
    setGstType(newValue);
    onChange?.(newValue);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 px-3 py-2 rounded-xl transition-all duration-300"
      )}
    >
      {/* GST Label */}
      <span
        className={cn(
          "text-sm font-semibold transition-colors rounded-xl p-1 px-2",
          gstType === "GST"
            ? "bg-green-700 dark:bg-green-400 text-white "
            : "bg-transparent  text-muted-foreground"
        )}
      >
        GST
      </span>

      {/* Beautiful colored switch */}
      <Switch
        checked={gstType === "IGST"}
        onCheckedChange={handleToggle}
        className={cn(
          "data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-green-500"
        )}
      />

      {/* IGST Label */}
      <span
        className={cn(
          "text-sm font-semibold transition-colors rounded-xl p-1 px-2",
          gstType === "IGST"
            ? "bg-blue-700 dark:bg-blue-400 text-white"
            : "bg-transparent  text-muted-foreground"
        )}
      >
        IGST
      </span>
    </div>
  );
};

export default SwitchGST;
