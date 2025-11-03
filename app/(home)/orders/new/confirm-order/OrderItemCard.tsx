"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCurrency } from "@/hooks/useCurrency";
import { OrderItem } from "@/types/orderType";
import { ChevronDown, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import SwitchGST from "./SwitchGST";
import { cn } from "@/lib/utils";

const gstRates = [0, 5, 12, 18, 28];

const gstTypes = ["GST", "IGST"];

const OrderItemsCard = ({
  items,
  onQuantityChange,
  onDelete,
  onItemChange,
}: {
  items: OrderItem[];
  onQuantityChange: (idx: number, newQty: number) => void;
  onDelete: (idx: number) => void;
  onItemChange: (idx: number, field: string, value: any) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [gstType, setGstType] = useState<"GST" | "IGST">("GST");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Horizontal scrolling with mouse wheel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 2,
          behavior: "smooth",
        });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const calculateOrderTotals = (items: OrderItem[]) => {
  let subtotal = 0;
  let gstTotal = 0;

  items.forEach((item) => {
    const baseTotal = item.price * item.quantity;
    const gstAmount = (baseTotal * (item.gstRate || 0)) / 100;
    subtotal += baseTotal;
    gstTotal += gstAmount;
  });

  return {
    subtotal,
    gstTotal,
    grandTotal: subtotal + gstTotal,
  };
};


  // Compute totals
  const computedItems = useMemo(() => {
    return items.map((item) => {
      const baseTotal = item.price * item.quantity;
      const gstRate = item.gstRate ?? 0;
      const gstAmount = (baseTotal * gstRate) / 100;
      const totalWithGST = baseTotal + gstAmount;
      return { ...item, baseTotal, gstAmount, totalWithGST };
    });
  }, [items]);

  const grandTotal = useMemo(
    () => computedItems.reduce((sum, i) => sum + i.totalWithGST, 0),
    [computedItems]
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Items</CardTitle>
        </div>
        <SwitchGST value={gstType} onChange={setGstType} />
      </CardHeader>

      <CardContent>
        {/* 💻 Desktop / Tablet Table */}
        <div
          ref={scrollRef}
          className="hidden sm:block overflow-x-auto whitespace-nowrap border rounded-md scrollbar-thin"
        >
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-center">HSN</th>
                <th className="p-2 text-center">GST %</th>
                <th className="p-2 text-right">Rate</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-right">GST Charge</th>
                <th className="p-2 text-right">Total (incl. GST)</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {computedItems.map((item, idx) => (
                <tr
                  key={item.itemId ?? idx}
                  className="border-t hover:bg-muted/30 transition-colors"
                >
                  <td className="p-2 font-medium">{item.itemName}</td>

                  <td className="p-2 text-center">
                    <Input
                      placeholder="HSN"
                      value={item.hsnCode || ""}
                      onChange={(e) =>
                        onItemChange(idx, "hsnCode", e.target.value)
                      }
                      className="text-center w-20 mx-auto"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <Select
                      value={item.gstRate?.toString() || ""}
                      onValueChange={(v) =>
                        onItemChange(idx, "gstRate", parseFloat(v))
                      }
                    >
                      <SelectTrigger className="w-16 mx-auto text-xs">
                        <SelectValue placeholder="%" />
                      </SelectTrigger>
                      <SelectContent>
                        {gstRates.map((rate) => (
                          <SelectItem key={rate} value={rate.toString()}>
                            {rate}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  <td className="p-2 text-right font-mono text-nowrap">
                    {useCurrency(item.price)}
                  </td>

                  <td className="p-2 text-center">
                    <Input
                      type="number"
                      min={1}
                      value={String(item.quantity)}
                      onChange={(e) =>
                        onQuantityChange(idx, parseInt(e.target.value || "1"))
                      }
                      className="w-14 text-center mx-auto"
                    />
                  </td>

                  <td className="p-2 text-right font-semibold text-nowrap text-blue-600">
                    {useCurrency(item.gstAmount)}
                  </td>

                  <td className="p-2 text-right font-semibold text-nowrap text-green-700">
                    {useCurrency(item.totalWithGST)}
                  </td>

                  <td className="p-2 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(idx)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t bg-muted/20 font-semibold">
                <td colSpan={6} className="p-2 text-right">
                  Grand Total ({gstType})
                </td>
                <td className="p-2 text-right text-green-700">
                  {useCurrency(grandTotal)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 📱 Mobile View */}
        <div className="block sm:hidden mt-2 space-y-2">
      {computedItems.map((item: any, idx: number) => {
        const isOpen = openIdx === idx;

        return (
          <div
            key={item.itemId ?? idx}
            className="border rounded-lg bg-card shadow-sm overflow-hidden"
          >
            {/* ===== Summary Header ===== */}
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full flex justify-between items-center px-3 py-2"
            >
              <div className="flex-1 min-w-0 text-left">
                <p className="font-medium text-sm truncate">
                  {item.itemName}
                </p>
                <p className="text-[12px] text-muted-foreground truncate">
                  Qty: {item.quantity} • {useCurrency(item.price)} each
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn("font-semibold text-sm",gstType === "GST" ? "text-green-600" : "text-blue-500")}>
                  {useCurrency(item.totalWithGST)}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </div>
            </button>

            {/* ===== Animated Expand Section ===== */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden border-t bg-muted/10"
                >
                  <div className="grid grid-cols-2 gap-2 p-3 text-xs">
                    <div>
                      <span className="text-muted-foreground text-[11px]">
                        HSN
                      </span>
                      <Input
                        value={item.hsnCode || ""}
                        onChange={(e) =>
                          onItemChange(idx, "hsnCode", e.target.value)
                        }
                        className="h-7 text-center mt-1 text-xs"
                        placeholder="HSN"
                      />
                    </div>

                    <div>
                      <span className="text-muted-foreground text-[11px]">
                        GST %
                      </span>
                      <Select
                        value={item.gstRate?.toString() || ""}
                        onValueChange={(v) =>
                          onItemChange(idx, "gstRate", parseFloat(v))
                        }
                      >
                        <SelectTrigger className="w-full h-7 text-xs mt-1">
                          <SelectValue placeholder="%" />
                        </SelectTrigger>
                        <SelectContent>
                          {gstRates.map((rate) => (
                            <SelectItem key={rate} value={rate.toString()}>
                              {rate}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <span className="text-muted-foreground text-[11px]">
                        Quantity
                      </span>
                      <Input
                        type="number"
                        min={1}
                        value={String(item.quantity)}
                        onChange={(e) =>
                          onQuantityChange(idx, parseInt(e.target.value || "1"))
                        }
                        className="h-7 text-center mt-1 text-xs"
                      />
                    </div>

                    <div>
                      <span className="text-muted-foreground text-[11px]">
                        Price
                      </span>
                      <p className="text-center mt-1 text-xs font-mono text-foreground/80">
                        {useCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t px-3 py-2 text-xs">
                    <span className="text-muted-foreground">
                      GST Charge:{" "}
                      <span className="text-blue-600 font-medium">
                        {useCurrency(item.gstAmount)}
                      </span>
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(idx)}
                      className="text-red-500 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* ===== Grand Total ===== */}
      <div className="border-t pt-2 text-right font-semibold text-green-700 text-sm">
        Total ({gstType}): {useCurrency(grandTotal)}
      </div>
    </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemsCard;
