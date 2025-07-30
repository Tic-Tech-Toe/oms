'use client'

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AddOrderLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
      router.prefetch("/orders");
    }, [router]);
  return (
    <div className="min-h-screen ">
      <div className="flex items-center justify-between mt-20">
        <div></div>
        <h1 className="text-2xl font-semibold">Add Order</h1>
        <Button
          variant="ghost"
          size="icon"
          className=" text-gray-600 hover:text-black"
          onClick={() => router.push("/orders")}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {children}
    </div>
  );
};

export default AddOrderLayout;
