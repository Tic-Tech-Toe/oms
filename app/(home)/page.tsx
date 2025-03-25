// @ts-nocheck


import Features from "@/components/Features";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Image from "next/image";

export default function Home() {

  return (
    <div className="relative w-screen h-screen overflow-x-hidden">
      <Header />
      <Hero />
      {/* <Features /> */}
      <div className="aurora dark:opacity-80"></div>
    </div>
  );
}
