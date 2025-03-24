import { OrderType } from "@/types/orderType";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useOrderStore } from "@/hooks/useOrderStore";
import { Checkbox } from "./ui/checkbox";
import { useCurrency } from "@/hooks/useCurrency";
import { ChevronDown, ChevronUp } from "lucide-react";

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

  const getTotalPayment = (order: OrderType, redeemReward: boolean) => {
    const discount = redeemReward ? order.customer.rewardPoint : 0;
    const totalAfterDiscount = Math.max(order.totalAmount - discount, 0);
    const remainingBalance = Math.max(
      totalAfterDiscount - order.payment.totalPaid,
      0
    );
    return remainingBalance;
  };

  const handleCompletePay = async () => {
    console.log("⏳ Processing Payment...");

    const rewardAmount = redeemReward ? order.customer.rewardPoint : 0; // Deduct rewards if applied
    const remainingBalance = getTotalPayment(order, redeemReward) - rewardAmount;
    const totalPaid = (order.payment?.totalPaid || 0) + remainingBalance;

    const isFullyPaid = totalPaid >= order.payment.totalAmount; // Check if fully paid

    // 🏆 Check if payment is within 7 days of order date
    const orderDate = new Date(order.orderDate);
    const today = new Date();
    const diffInDays = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    const isEligibleForReward = diffInDays <= 7;

    // Grant 10% of total order value as reward if eligible
    const newRewardPoints = isEligibleForReward ? Math.floor(order.totalAmount * 0.1) : 0;
    console.log("New reward point",newRewardPoints)
    const { updateOrder, loadAllOrders } = useOrderStore.getState();

    console.log("🔹 Before Update:", order);

    // 🔹 Update the order in Zustand store
    updateOrder(order.id, {
    //   paymentStatus: isFullyPaid ? "paid" : "partially_paid",
      paymentStatus:"paid",
      payment: {
        totalAmount: order.payment.totalAmount, // Keep totalAmount same
        totalPaid: totalPaid, // Updated paid amount
        partialPayments: [
          ...(order.payment?.partialPayments || []),
          { date: today.toISOString(), amountPaid: remainingBalance },
        ],
      },
      customer: {
        rewardPoint: (redeemReward ? 0 : order.customer.rewardPoint) + newRewardPoints, // Add new reward if eligible
      },
    });

    console.log(`✅ Order updated in Zustand Store! (New Reward: ${newRewardPoints})`);

    // 🔹 Wait for Zustand update
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("🔹 After Update:", useOrderStore.getState().allOrders.find(o => o.id === order.id));

    // 🔹 Close dialog and refresh orders
    setOpen(false);
};
  

  return (
    <div className="flex flex-col py-4">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">
          Collect Payment of:{" "}
          {useCurrency(getTotalPayment(order, redeemReward))}
        </span>
        {isMiniBill ? (
          <ChevronUp size={14} onClick={() => setIsMiniBill(false)} />
        ) : (
          <ChevronDown size={14} onClick={() => setIsMiniBill(true)} />
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
                Discount <span>{useCurrency(order.customer.rewardPoint)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold">
              Paid by customer{" "}
              <span>{useCurrency(order.payment.totalPaid)}</span>
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
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi">UPI</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="debit" id="debit" />
            <Label htmlFor="debit">Debit Card</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="w-full h-10 mt-6 flex flex-col items-center">
        {order.customer.rewardPoint > 0 && (
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
                Reward points of {order.customer.rewardPoint} will be applied
              </span>
            </label>
          </div>
        )}
        <Button
          onClick={handleCompletePay}
          className="mt-4 bg-dark-primary w-full hover:bg-light-button-hover"
        >
          Complete payment
        </Button>
      </div>
    </div>
  );
};

export default OrderPaymentCollect;
