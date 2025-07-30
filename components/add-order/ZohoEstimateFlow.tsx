"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const ZohoEstimate = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [estimateId, setEstimateId] = useState("");

  const handleNext = () => {
    // Trigger fetch logic or pass to parent
    console.log("Zoho Estimate ID:", estimateId);
    onClose(); // optionally close
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fetch Zoho Estimate</DialogTitle>
        </DialogHeader>
        <Separator />
        <p className="text-md mt-4 text-slate-400">
          Enter the Zoho Estimate ID to automatically populate order details.
        </p>
        <div className="mt-2 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="zoho-id" className="text-slate-600">
              Estimate ID
            </Label>
            <Input
              id="zoho-id"
              type="text"
              placeholder="Enter Zoho Estimate ID"
              className="h-11 rounded-xl shadow-none"
              value={estimateId}
              onChange={(e) => setEstimateId(e.target.value)}
            />
          </div>

          <Button
            onClick={handleNext}
            className="h-12 w-full sm:flex-[2] rounded-xl bg-light-primary text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold shadow-md"
            disabled={!estimateId.trim()}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZohoEstimate;
