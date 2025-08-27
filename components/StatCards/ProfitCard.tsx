import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { EllipsisVertical, Menu } from "lucide-react";

const ProfitCard = () => {
  return (
    <div className="w-full aspect-square rounded-[2.5rem] bg-amber-200 flex flex-col items-center py-4 px-6 ">
      <div className="flex justify-between items-center  w-full">
        <div className="flex items-center gap-2">
          <Image src={"/money.png"} height={45} width={45} alt="Profit-Image" className="bg-amber-500 p-[6px] rounded-2xl" />
          <span className="text-neutral-900 font-semibold text-2xl">Profit</span>
        </div>
        {/* <Button className="text-neutral-900   p-2" variant={"ghost"}>
          <EllipsisVertical size={18} />
        </Button> */}
      </div>
      <DotLottieReact
        src="https://lottie.host/2057495f-3fe3-4a3f-b25b-d330b4540b52/27Mk3jzmc6.lottie"
        loop
        autoplay
        style={{ width: "70%", height: "70%" }}
      />
      <div className=" w-full">
        <p className="text-sm text-gray-600"> <span className="font-semibold text-black">+14% </span>Since last week</p>
        <h2 className="text-xl font-bold text-gray-800">12,345</h2>
      </div>
    </div>
  );
};

export default ProfitCard;
