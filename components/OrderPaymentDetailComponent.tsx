import { useCurrency } from "@/hooks/useCurrency";
import { OrderType } from "@/types/orderType";
import React from "react";

const OrderPaymentDetailComponent = ({ order }: { order: OrderType }) => {
  const charges = [
    {
      name: "subtotal",
      des: order.items.length + "  " + "Items",
      amount: order.totalAmount,
    },
    {
      name: "discount",
      des: "Timely payment",
      amount: -2,
    },
    {
      name: "shipping",
      des: "Free shipping",
      amount: 0,
    },
  ];
  const totalAmount = charges.reduce(
    (total, charge) => total + charge.amount,
    0
  );
  return (
    <div className="mt-4 px-4">
      <div>
        {charges.map((charge, i) => (
          <div
            key={i}
            className="text-sm font-semibold text-gray-500 dark:text-gray-300 flex justify-between"
          >
            <span className=" inline-block w-2/3">
              {charge.name.charAt(0).toUpperCase() + charge.name.slice(1)}
            </span>
            <div className="flex gap-6  w-1/3 justify-between">
              <span className="text-left">{charge.des}</span>
              <span>&#x20B9; {charge.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
      <span className="text-sm font-bold inline-flex w-full justify-between mt-4">
        Total<span>&#x20B9;{totalAmount.toFixed(2)}</span>
      </span>

      <div className="h-[2px] dark:bg-gray-600 bg-gray-300 mt-4 mx-auto rounded-full" />
      <span className="text-xs font-bold inline-flex w-full justify-between mt-4 text-gray-500 dark:text-gray-300">
        Paid by customer
        <span>{ order.payment ? useCurrency(order.payment.totalPaid): 0}</span>
      </span>
    </div>
  );
};

export default OrderPaymentDetailComponent;
