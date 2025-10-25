"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";
import { ChevronDown, ChevronUp, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CollapsibleWrapper from "./CollapsibleWrapper";
import ChargesEditor, { Charge } from "./ChargesEditor";

const BillDetailsCard = ({
  charges,
  setCharges,
  subtotal,
  totalItemGst,
  totalAmount,
  fixedChargesAmount,
  percentChargesAmount,
  loading,
  onPlaceOrder,
}: {
  charges: Charge[];
  setCharges: (charges: Charge[]) => void;
  subtotal: number;
  totalItemGst: number;
  totalAmount: number;
  fixedChargesAmount: number;
  percentChargesAmount: number;
  loading: boolean;
  onPlaceOrder: () => void;
}) => {
  const [billOpen, setBillOpen] = useState(false);
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Bill</CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Subtotal</div>
          <div className="font-mono font-semibold">{useCurrency(subtotal)}</div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBillOpen((s) => !s)}
          >
            {billOpen ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <CollapsibleWrapper open={billOpen}>
          <div className="py-2">
            <div className="text-sm text-muted-foreground mb-2">
              Apply charges (amount or %)
            </div>
            <ChargesEditor
              charges={charges}
              subtotal={subtotal}
              onChange={setCharges}
            />

            <div className="mt-4 border-t pt-3 space-y-2">
                {/* ADD THIS BLOCK to display item-level GST */}
                            <div className="flex justify-between text-sm text-blue-600 font-semibold">
                                <span>Total Item GST</span>
                                <span>{useCurrency(totalItemGst)}</span>
                            </div>
                            {/* End of new block */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Fixed charges</span>
                <span>{useCurrency(fixedChargesAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Percent charges</span>
                <span>{useCurrency(percentChargesAmount)}</span>
              </div>
            </div>
          </div>
        </CollapsibleWrapper>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-mono font-bold">
              {useCurrency(totalAmount)}
            </span>
          </div>

          <div className="flex gap-3 mt-2 w-full">
            {/* <Button variant="outline" className="flex-1" onClick={() => router.push("/add-items")}>
                            Add More Items
                        </Button> */}
            <Button
              className="flex-1 bg-dark-primary text-white"
              onClick={onPlaceOrder}
              disabled={loading}
            >
              {loading ? "Placing..." : "Place Order"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillDetailsCard;
