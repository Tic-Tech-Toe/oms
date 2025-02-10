"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { Table, TableCaption } from "./ui/table";
import TableArea from "./Table/TableArea";
import OrderDialog from "./OrderDialog";
import { orders } from "@/data/orders";
import { OrderType } from "@/types/orderType";
import { useOrderStore } from "@/hooks/useOrderStore";
import { SelectScrollUpButton } from "@radix-ui/react-select";
import { ArrowRight, ChevronRight, MoveRight } from "lucide-react";
import Iphone15Pro from "./magicui/iphone-15-pro";
import { Safari } from "./magicui/safari";

const Hero = () => {
  const { allOrders, addOrder } = useOrderStore();
  // const [order, setOrder] = useState<OrderType[]>(orders);
  const addNewOrder = (newOrder) => {
    addOrder(newOrder);
  };
  return (
    <section className="w-full flex md:flex-row flex-col mt-8 px-10 py-4 gap-6">
      <div className="md:flex-1">
        <h1 className="text-7xl font-bold md:w-4/5">
          Seamless Order & Inventory Management for Growing Businesses
        </h1>
        <h2 className="text-lg mt-6 md:w-4/5 font-semibold dark:text-dark-text-secondary text-dark-text-secondary ">
          Manage orders, track shipments, and streamline inventory—all in one
          powerful dashboard.
        </h2>
        <Button className="bg-light-primary rounded-full text-white mt-4 group">
          Book a call
          <span className="relative w-5 h-5">
            <ChevronRight className="absolute inset-0 transition-opacity duration-300 opacity-100 top-[2px] group-hover:opacity-0" />
            <MoveRight className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 top-[2px]" />
          </span>
        </Button>
      </div>
      <div className="md:flex-1 rounded-3xl  relative">
      <Safari
        url="shiptrack.com"
        className="size-full"
        imageSrc="./webMock.jpg"
      />
      <Iphone15Pro className="size-[70%] absolute  bottom-0" src="./whatsappMock.jpg" stroke="2px"/>
      </div>
    </section>
  );
};

export default Hero;
