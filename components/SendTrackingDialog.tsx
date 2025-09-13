'use client';

import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DeliveryWindowDialog from './DeliveryWindowDialog';
import { useToast } from '@/hooks/use-toast';
import { updateOrderInFirestore } from '@/utils/order/getFireStoreOrders';
import { useOrderStore } from '@/hooks/zustand_stores/useOrderStore';
import { Input } from './ui/input';
import { Cross, X } from 'lucide-react';
import { uniqueId } from 'lodash';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/config/firebase';

import { nanoid } from 'nanoid';

type Props = {
  open: boolean;
  onClose: () => void;
  orderId: string;
  phoneNumber: string;
  customerName: string;
  userId: string;
};

export default function SendTrackingDialog({
  open,
  onClose,
  orderId,
  phoneNumber,
  customerName,
  userId,
}: Props) {
  const [trackingLink, setTrackingLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeliveryWindow, setShowDeliveryWindow] = useState(false);
  const [eta, setEta] = useState('');
  const { toast } = useToast();

  const { updateOrder: updateOrde } = useOrderStore();

const handleSend = async () => {
  if (!trackingLink || !eta) {
    toast({ description: "⚠️ Please enter both tracking link and select ETA." });
    return;
  }
  if (!userId) {
    toast({ description: "❌ User not authenticated." });
    return;
  }

  setLoading(true);
  try {
    // 1. Fetch the current order to check for an existing shareKey
    const docRef = doc(db, 'users', userId, 'orders', orderId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      toast({ description: "❌ Order not found." });
      setLoading(false);
      return;
    }
    
    const currentOrder = docSnap.data();
    let shareKey = currentOrder.shareKey;

    // 2. If no shareKey exists, generate a new one
    if (!shareKey) {
      shareKey = nanoid(); // Use a reliable library like nanoid for unique IDs
    }

    // 3. Update the order with tracking link, ETA, and the shareKey
    const updatedData = {
      trackingLink,
      estimatedDeliveryDate: eta,
      shareKey, // Add or update the shareKey
    };
    await updateOrde(userId, orderId, updatedData);

    // 4. (Optional) Construct the public link
    const publicLink = `/${shareKey}`;
    console.log("Public Share Link:", publicLink);
    
    // Send WhatsApp message with the public link
    // You can uncomment the following code and pass `publicLink` in the body
    const res = await fetch("/api/send-track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        phoneNumber,
        orderId,
        eta,
        publicLink, // Pass the new public link
      }),
    });

    const data = await res.json();
     if (data.success) {
        toast({ description: "✅ Tracking link sent via WhatsApp!" });
        setTrackingLink('');
        setEta('');
        onClose();
      } else {
        toast({ description: data.message || "❌ Failed to send tracking link." });
      }
    } catch (err) {
      console.error(err);
      toast({ description: "❌ Something went wrong." });
    } finally {
      setLoading(false);
    }
  
};

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Send Tracking Link</DialogTitle>
        </DialogHeader>

        <Input
          type="text"
          placeholder="Paste tracking link here"
          className="w-full p-3 rounded-lg border border-gray-300 mb-4"
          value={trackingLink}
          onChange={(e) => setTrackingLink(e.target.value)}
        />

        <Button onClick={() => setShowDeliveryWindow(true)} className="mb-4">
          {eta ? `Delivery Window: ${eta}` : "Select Delivery Window"}
        </Button>

        {showDeliveryWindow && (
          <DeliveryWindowDialog
            open={showDeliveryWindow}
            onClose={() => setShowDeliveryWindow(false)}
            onConfirm={(window) => {
              setEta(window); // window should be friendly string like "Tomorrow 5PM"
              setShowDeliveryWindow(false);
            }}
          />
        )}

        <div className="flex items-center justify-end gap-4">
  <DialogClose asChild>
    <Button
      variant="destructive"
      className="rounded-2xl bg-red-600 text-white"
    >
      <X size={16} />
    </Button>
  </DialogClose>

  <Button
    onClick={handleSend}
    disabled={loading}
    className="bg-light-primary text-white rounded-2xl"
  >
    {loading ? "Sending..." : "Send Tracking"}
  </Button>
</div>

        
      </DialogContent>
    </Dialog>
  );
}
