"use client";

import OrderDialog from "@/components/add-order/OrderDialog";
import ZohoEstimate from "@/components/add-order/ZohoEstimateFlow";
import Image from "next/image";
import { useState } from "react";

const page = () => {
    const [openZoho, setOpenZoho] = useState(false);
  const [openManual, setOpenManual] = useState(false);
  return (
    <div className="md:px-8 md:py-6">
      {/* Divider */}
      <div className="h-[1px] w-[90%] mx-auto bg-slate-400 mt-4 rounded-full" />

      {/* Title */}
      <h1 className="text-2xl font-semibold mt-6 text-center">
        How do you want to add order?
      </h1>

      {/* Entry Options */}
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {/* Zoho Estimate Entry */}
        <div className="flex w-full md:w-1/2 rounded-3xl hover:bg-neutral-700/10 cursor-pointer p-6 items-center gap-6 transition" onClick={() => setOpenZoho(true)}>
          {/* Text Section */}
          <div className="w-3/5 flex flex-col space-y-2">
            <span className="text-base text-muted-foreground font-medium">Recommended</span>
            <span className="font-bold text-2xl">Add via Zoho Estimate</span>
            <span className="text-base text-neutral-500">
              Import order details directly from a Zoho Estimate.
            </span>
          </div>

          {/* Image Section */}
          <div className="relative w-2/5 aspect-[2/1]">
            <Image
              src="/add-order-flow/zoho-entry.png"
              alt="zoho-estimate"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Manual Entry */}
        <div className="flex w-full md:w-1/2 rounded-3xl hover:bg-neutral-700/10 cursor-pointer p-6 items-center gap-6 transition"  onClick={() => setOpenManual(true)}>
          {/* Text Section */}
          <div className="w-3/5 flex flex-col space-y-2">
            <span className="font-bold text-2xl">Add Manually</span>
            <span className="text-base text-neutral-500">
              Enter order details manually, including customer information, items, and pricing.
            </span>
          </div>

          {/* Image Section */}
          <div className="relative w-2/5 aspect-[2/1]">
            <Image
              src="/add-order-flow/manual-entry.png"
              alt="manual-entry"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <ZohoEstimate open={openZoho} onClose={() => setOpenZoho(false)} />
      <OrderDialog open={openManual} onClose={() => setOpenManual(false)} />
    </div>
  );
};

export default page;
