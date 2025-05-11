import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { auth } from "@/app/config/firebase";
import { STATUS_WHATSAPP_CONFIG } from "@/utils/whatsappConfig";
import DeliveryWindowDialog from "../DeliveryWindowDialog";

interface StatusActionsProps {
  row: any;
  field: "status" | "paymentStatus";
  statuses: string[];
  getStatusBadgeClass: (status: string) => string;
}

const StatusActions: React.FC<StatusActionsProps> = ({
  row,
  field,
  statuses,
  getStatusBadgeClass,
}) => {
  const initialValue = row.original[field] as string;
  const [newStatus, setNewStatus] = useState(initialValue);

  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [deliveryWindow, setDeliveryWindow] = useState<string>("");

  const { updateOrder } = useOrderStore();
  const { toast, dismiss } = useToast();
  const userId = auth.currentUser?.uid;

  // Keep local select in sync with external changes
  useEffect(() => {
    setNewStatus(initialValue);
  }, [initialValue]);

  /**
   * Central update+notification logic.
   * If `deliveryWindow` is provided, it updates that field too.
   */
  const updateStatusAndNotify = async (
    statusValue: string,
    deliveryWindow: string
  ) => {
    setNewStatus(statusValue);

    // Grab the existing timeline (fall back to empty array)
    const oldTimeline: Array<{ date: string; action: string }> =
      row.original.timeline ?? [];

    // Create a new timeline entry based on the status change
    const newEntry = {
      date: new Date().toISOString(),
      action:
        statusValue === "Shipped" && deliveryWindow
          ? `Shipped (window: ${deliveryWindow})`
          : statusValue,
    };

    // Build the Firestore update payload
    const updatePayload: Record<string, any> = {
      [field]: statusValue,
      timeline: [...oldTimeline, newEntry],
    };

    if (deliveryWindow) {
      updatePayload.deliveryWindow = deliveryWindow;
    }

    try {
      // 1️⃣ Update in Zustand + Firestore
      await updateOrder(userId, row.original.id, updatePayload);

      // 2️⃣ If we're dealing with an order status, fire off WhatsApp prompt
      if (field === "status" && STATUS_WHATSAPP_CONFIG[statusValue]) {
        const { apiRoute, getPayload } = STATUS_WHATSAPP_CONFIG[statusValue];

        // Inject our chosen window for shipped
        const enrichedRow = {
          ...row,
          original: {
            ...row.original,
            deliveryWindow: deliveryWindow,
          },
        };
        const payload = getPayload(enrichedRow);

        // Show toast with action buttons
        const handle = toast({
          title: `Order ${statusValue}`,
          description: `Send "${statusValue}" update via WhatsApp?`,
          duration: 5000,
          action: (
            <div className="flex items-center  gap-2">
              <Button
                variant="ghost"
                size="icon"
                // onClick={async () => {
                //   const res = await fetch(apiRoute, {
                //     method: "POST",
                //     headers: { "Content-Type": "application/json" },
                //     body: JSON.stringify(payload),
                //   });
                //   const data = await res.json();
                //   if (!data.success) {
                //     toast({
                //       title: "WhatsApp error",
                //       description: data.message,
                //       variant: "destructive",
                //     });
                //   }
                //   if(data.success){
                //     toast({
                //       title: "Message Sent",
                //       description: data.message,
                //       variant: "success",
                //     });
                //   }

                //   dismiss(handle.id);
                // }}
              onClick={async () => {
  // Step 1: Create the action toast and hold the toast ID
  const actionToast = toast({
    title: "Ready to send?",
    description: "Clicking this will notify the customer.",
    variant: "info", // This is your starting state (could be "default")
    duration: Infinity, // Keep it open until manual dismissal or update
  });

  // Step 2: Update to loading state (still using the same toast ID)
  toast({
    id: actionToast.id, // Reuse the same toast ID
    title: "Sending message...",
    description: "", // Optional: No description for loading
    variant: "loading", // Your custom loading variant
    duration: Infinity, // Keep it open until fetch finishes
  });

  try {
    const res = await fetch(apiRoute, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    // Step 3: Show success or error, still updating the same toast ID
    if (!data.success) {
      toast({
        id: actionToast.id, // Reuse the same toast ID
        title: "WhatsApp error",
        description: data.message,
        variant: "destructive", // Error state
      });
    } else {
      toast({
        id: actionToast.id, // Reuse the same toast ID
        title: "Message Sent",
        description: data.message,
        variant: "success", // Success state
      });
    }
  } catch (err) {
    // Handle network error, update the same toast ID
    toast({
      id: actionToast.id, // Reuse the same toast ID
      title: "Network Error",
      description: "Failed to reach WhatsApp API.",
      variant: "destructive", // Error state
    });
  }
}}

              >
                <Check className="w-4 h-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dismiss(handle.id)}
              >
                <X className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ),
        });
      } else if (field === "paymentStatus") {
        // Simple payment-status feedback
        toast({
          title: "Payment status updated",
          description: `Set to ${statusValue}`,
        });
      }
    } catch {
      toast({
        title: "Update failed",
        description: "Could not save change. Try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Called when the user picks a status from the dropdown.
   * - For "Shipped", we first show the dialog.
   * - Otherwise, we immediately update+notify.
   */
  const handleStatusChange = (value: string) => {
    if (value === "Shipped") {
      setShowDeliveryDialog(true);
      return;
    }
    updateStatusAndNotify(value, deliveryWindow);
  };

  /** When user confirms a delivery window in the dialog */
  const handleDeliveryConfirm = (formattedWindow: string) => {
    setShowDeliveryDialog(false);
    setDeliveryWindow(formattedWindow);
    // Now actually update and prompt WhatsApp
    updateStatusAndNotify("Shipped", formattedWindow);
  };

  return (
    <>
      <div className="flex items-center  gap-2">
        {/* Badge */}
        <span
          className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
            newStatus
          )}`}
        >
          {newStatus}
        </span>

        {/* Dropdown */}
        <Select
          value={newStatus}
          onValueChange={handleStatusChange}
          onOpenChange={() => {}}
        >
          <SelectTrigger className="text-xs border-none " />
          <SelectContent className="text-xs">
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Delivery dialog */}
      {showDeliveryDialog && (
        <DeliveryWindowDialog
          open={showDeliveryDialog}
          onClose={() => setShowDeliveryDialog(false)}
          onConfirm={handleDeliveryConfirm}
          setDeliveryWindow={setDeliveryWindow}
        />
      )}
    </>
  );
};

export default StatusActions;
