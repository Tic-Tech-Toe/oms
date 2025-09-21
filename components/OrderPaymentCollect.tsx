"use client";

import { OrderType } from "@/types/orderType";
import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { Checkbox } from "./ui/checkbox";
import { useCurrency } from "@/hooks/useCurrency";
import { ChevronDown, ChevronUp } from "lucide-react";
import { auth } from "@/app/config/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/app/context/AuthContext";
import { fetchUserData } from "@/utils/user/fetchUseData";
import { updateCurrentUser, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useCustomerStore } from "@/hooks/zustand_stores/useCustomerStore";
// import { toast } from "sonner";

const OrderPaymentCollect = ({
  order,
  setOpen,
  refreshOrders,
}: {
  order: OrderType;
  setOpen: (open: boolean) => void;
  refreshOrders: () => void;
}) => {
  const { updateOrder } = useOrderStore();
  const [redeemReward, setRedeemReward] = useState(false);
  const [isMiniBill, setIsMiniBill] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  const { customers, loadCustomers } = useCustomerStore();

  const userId = auth.currentUser?.uid || "";
  const { toast } = useToast();

  const getTotalPayment = (order: OrderType, redeemReward: boolean) => {
    if (!order) return 0;

    const totalAmount = order?.totalAmount;
    const rewardPoints = redeemReward ? customer?.rewardPoint : 0;
    const totalAfterDiscount = Math.max(totalAmount - rewardPoints, 0);
    const totalPaid = order.payment?.totalPaid ?? 0;

    return Math.max(totalAfterDiscount - totalPaid, 0);
  };

  const handleCompletePay = async () => {
    setLoading(true);
    const remainingBalance = getTotalPayment(order, redeemReward);
    const totalPaid = (order.payment?.totalPaid ?? 0) + remainingBalance;
    const isFullyPaid = totalPaid >= (order.totalAmount ?? 0);

    const orderDate = new Date(order.orderDate);
    const today = new Date();
    const diffInDays = Math.floor(
      (today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const isEligibleForReward = diffInDays <= 7;

    const newRewardPoints = isEligibleForReward
      ? Math.floor(((order.totalAmount ?? 0) * user?.rewardPercentage) / 100)
      : 0;

    try {
      // 1. Update the Customer's Reward Points in the Zustand store and Firestore
      const { updateCustomer } = useCustomerStore.getState(); // Access updateCustomer from the Zustand store
      const updatedRewardPoints =
        (redeemReward ? 0 : (order.customer.rewardPoint ?? 0)) +
        newRewardPoints;

      await updateCustomer(userId, order.customer.id, {
        rewardPoint: updatedRewardPoints,
      });

      // 2. Update Firestore Order Document (already done in the updateCustomer function)
      await updateOrder(userId, order.id, {
        paymentStatus: "paid",
        updatedAt: today.toISOString(),
        payment: {
          totalPaid,
          partialPayments: [
            ...(order.payment?.partialPayments || []),
            { date: today.toISOString(), amountPaid: remainingBalance },
          ],
        },
        customer: {
          ...order.customer,
          rewardPoint: updatedRewardPoints, // Updated rewardPoint after applying reward
        },
        timeline: [
          ...(order.timeline || []),
          {
            date: today.toISOString(),
            action: `💰 Payment of ${useCurrency(remainingBalance)} received`,
          },
        ],
      });

      // 3. Send WhatsApp Payment Received Message
      const phoneNumber = order.customer?.whatsappNumber;
      if (phoneNumber) {
        const messageBody = [
          order.customer?.name || "Customer",
          remainingBalance.toString(),
          order.invoiceNumber || order.id,
          redeemReward ? customer?.rewardPoint?.toString() : "0",
          updatedRewardPoints.toString(),
        ];

        const res = await fetch("/api/payment-received", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber, messageBody }),
        });

        const data = await res.json();
        if (!data.success) {
          console.error("Failed to send payment confirmation: ", data.message);
        }
      } else {
        console.warn(
          "Customer WhatsApp number is missing, skipping WhatsApp confirmation."
        );
      }

      toast({
        title: "Payment Updated",
        description: "✅ Payment completed & order updated.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        description: "❌ Failed to update order. Try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const user = fetchUserData(auth?.currentUser)
    const fetchUser = async () => {
      const res = await fetchUserData(auth?.currentUser);
      // //console.log(res)
      setUser(res);
      // //console.log(user)
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadCustomers(userId);
    }
  }, [userId, loadCustomers]);
  const customer = customers.find((c) => c.id === order?.customer?.id);

  return (
    <div className="flex flex-col py-4">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">
          Collect Payment of:{" "}
          {useCurrency(getTotalPayment(order, redeemReward))}
        </span>
        {isMiniBill ? (
          // <ChevronUp size={14} onClick={() => setIsMiniBill(false)} />
          <Button
            onClick={() => setIsMiniBill(false)}
            className="flex items-center gap-2  border-2 border-violet-700 rounded-full"
          >
            <span className="text-sm">Hide Mini Bill</span>
            <ChevronUp className="ml-2" size={14} />
          </Button>
        ) : (
          // <ChevronDown size={14} onClick={() => setIsMiniBill(true)} />
          <Button
            onClick={() => setIsMiniBill(true)}
            className="flex items-center gap-2 border border-violet-700 rounded-full"
          >
            <span className="text-sm">Show Mini Bill</span>
            <ChevronDown className="ml-2" size={14} />
          </Button>
        )}
      </div>

      {isMiniBill && (
        <div className="w-[70%] rounded-2xl border-2 mx-auto mt-6">
          <span className="text-2xl font-bold text-center py-4 block">
            Pacific Design
          </span>
          <div className="mt-4 px-4">
            <div className="flex justify-between text-sm font-semibold">
              Subtotal <span>{useCurrency(order.totalAmount)}</span>
            </div>
            {redeemReward && (
              <div className="flex justify-between text-sm font-semibold">
                Reward discount :{" "}
                <span>{useCurrency(customer?.rewardPoint)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold">
              Paid by customer{" "}
              <span>{useCurrency(order?.payment?.totalPaid)}</span>
            </div>

            <div className="h-[2px] mt-6 bg-gray-600 dark:bg-gray-300 rounded-full" />
            <div className="flex justify-between text-sm font-semibold mt-4 mb-4">
              Total{" "}
              <span>{useCurrency(getTotalPayment(order, redeemReward))}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <span>Payment mode: </span>
        <RadioGroup defaultValue="cash" className="flex flex-wrap gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash">Cash</Label>
          </div>
          {/* <div className="flex items-center space-x-2">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi">UPI</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="debit" id="debit" />
            <Label htmlFor="debit">Debit Card</Label>
          </div> */}
        </RadioGroup>
      </div>

      <div className="w-full h-10 mt-6 flex flex-col items-center">
        {customer?.rewardPoint > 0 && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="redeem-reward"
              checked={redeemReward}
              onCheckedChange={(checked) => setRedeemReward(!!checked)}
            />
            <label
              htmlFor="redeem-reward"
              className="text-sm font-medium leading-none"
            >
              <span className="text-xs font-semibold">
                Reward points of {customer?.rewardPoint} will be applied
              </span>
            </label>
          </div>
        )}
        <Button
          onClick={handleCompletePay}
          disabled={loading}
          className="mt-4 bg-dark-primary w-full hover:bg-light-button-hover"
        >
          {loading ? "Processing..." : "Complete payment"}
        </Button>
      </div>
    </div>
  );
};

export default OrderPaymentCollect;
