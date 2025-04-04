// @ts-nocheck


import Features from "@/components/Features";
import Footer from "@/components/Footer";
import GenJaadu from "@/components/GenJaadu";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SparkTrail from "@/components/SparkTrail";
import Image from "next/image";

export default function Home() {

  return (
    <div className="relative w-screen h-screen overflow-x-hidden">
      {/* <SparkTrail /> */}
      <Header />
      <Hero />
      <Features />
      <GenJaadu />
      <Footer />
      <div className="aurora dark:opacity-80"></div>
    </div>
  );
}
