//@ts-nocheck
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import OrderPaymentCollect from "./OrderPaymentCollect";
import { OrderType } from "@/types/orderType";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { auth } from "@/app/config/firebase";

interface FooterComponentProps {
  text: string;
  status: string;
  order: OrderType;
  buttonOne: string;
  buttonTwo: string;
}

const FooterComponent = ({
  text,
  status,
  order,
  buttonOne,
  buttonTwo,
}: FooterComponentProps) => {
  const isCollectPayment = buttonTwo === "Collect payment";
  const [open, setOpen] = useState(false);
  const { loadAllOrders } = useOrderStore();

  const { user } = auth.currentUser();

  const refreshOrders = () => {
    loadAllOrders(user.id);
  };
  const buttonElement = (
    <div className="flex gap-2">
      <Button
        className={`border-purple-700 border-2 text-purple-500 hover:bg-purple-800 hover:text-white rounded-xl 
        ${status.toLowerCase() === "paid" ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {buttonOne}
      </Button>

      <Button
        className={`bg-purple-700 text-white hover:bg-purple-800 rounded-xl 
        ${status.toLowerCase() === "paid" ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={status.toLowerCase() === "paid"}
      >
        {buttonTwo}
      </Button>
    </div>
  );

  return (
    <div className="bg-light-light-gray dark:bg-dark-background mt-2 p-4 flex items-center justify-between">
      <span className="text-sm font-semibold">{text}</span>

      {isCollectPayment ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>{buttonElement}</DialogTrigger>
          <DialogContent>
            {/* <h1>Hi</h1> */}
            <OrderPaymentCollect
              order={order}
              setOpen={setOpen}
              refreshOrders={refreshOrders}
            />
          </DialogContent>
        </Dialog>
      ) : (
        buttonElement
      )}
    </div>
  );
};

export default FooterComponent;
