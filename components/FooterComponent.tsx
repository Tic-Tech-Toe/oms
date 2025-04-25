"use client"

import { OrderType } from "@/types/orderType";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import OrderPaymentCollect from "./OrderPaymentCollect";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { auth } from "@/app/config/firebase";

interface FooterComponentProps {
  text: string;
  status: string;
  order: OrderType;
  buttonOneLabel: string;
  buttonTwoLabel: string;
  onButtonOneClick?: (order: OrderType) => void;
  onButtonTwoClick?: (order: OrderType) => void;
  showDialogForButtonTwo?: boolean;
}

const FooterComponent = ({
  text,
  status,
  order,
  buttonOneLabel,
  buttonTwoLabel,
  onButtonOneClick,
  onButtonTwoClick,
  showDialogForButtonTwo = false,
}: FooterComponentProps) => {
  const [open, setOpen] = useState(false);
  const { loadAllOrders } = useOrderStore();

  const isDisabled = status.toLowerCase() === "paid";

  const refreshOrders = () => {
    const user = auth.currentUser;
    if (user) loadAllOrders(user.uid);
  };

  const buttons = (
    <div className="flex gap-2">
      <Button
        onClick={() => onButtonOneClick?.(order)}
        disabled={isDisabled}
        className={`border-purple-700 border-2 text-purple-500 hover:bg-purple-800 hover:text-white rounded-xl ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {buttonOneLabel}
      </Button>

      <Button
        onClick={() => {
          if (!showDialogForButtonTwo) onButtonTwoClick?.(order);
        }}
        disabled={isDisabled}
        className={`bg-purple-700 text-white hover:bg-purple-800 rounded-xl ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {buttonTwoLabel}
      </Button>
    </div>
  );

  return (
    <div className="bg-light-light-gray dark:bg-dark-background mt-2 p-4 flex items-center justify-between rounded-b-2xl">
      <span className="text-sm font-semibold">{text}</span>

      {showDialogForButtonTwo ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>{buttons}</DialogTrigger>
          <DialogContent>
            <OrderPaymentCollect
              order={order}
              setOpen={setOpen}
              refreshOrders={refreshOrders}
            />
          </DialogContent>
        </Dialog>
      ) : (
        buttons
      )}
    </div>
  );
};

export default FooterComponent