"use client"

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import dynamic from "next/dynamic";

const Features = dynamic(() => import('@/components/Features'), {
  ssr: false,
  loading: () => <div className="h-48 flex justify-center items-center">Loading Features...</div>,
});
const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
  loading: () => <div className="h-48 flex justify-center items-center">Loading Features...</div>,
});

const PricingPage = dynamic(() => import('@/components/PricingPage'), {
  ssr: false,
  loading: () => <div className="h-48 flex justify-center items-center">Loading Pricing...</div>,
});

// const GenJaadu = dynamic(() => import('@/components/GenJaadu'), {
//   ssr: false,
//   loading: () => <div className="h-48 flex justify-center items-center">Loading Features...</div>,
// });
export default function   FasterHero() {
  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden">
      <div className="aurora absolute z-0" />
      
      {/* Content goes above */}
      <Header /> {/* Likely z-50 */}
      <Hero id="hero" />
      <Features id="features" />
      {/* <GenJaadu id="genjaadu" /> */}
      <PricingPage id="pricing" />
      
      {/* Footer at the bottom */}
      <Footer id="footer" />
    </div>
  );
}