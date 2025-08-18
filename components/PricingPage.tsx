"use client";

import { motion } from "framer-motion";
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";

const PricingPage = ({ id }: { id: string }) => {
  const handleClick = () => {
    const message = encodeURIComponent("Hi Ship, I’m interested in the pricing plan.");
    const phoneNumber = "+918981873533";
    const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `https://wa.me/${phoneNumber}?text=${message}`;
    } else {
      window.open(
        `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`,
        "_blank"
      );
    }
  };

  return (
    <section
      id={id}
      className="w-full flex flex-col md:flex-row mt-20 md:px-10 py-12 gap-8"
    >
      {/* Left - Headline */}
      <div className="md:flex-1 px-6 md:px-0 flex flex-col justify-center">
        <h1 className="md:text-6xl text-4xl font-clash font-semibold leading-tight">
          Simple Pricing, Full Access
        </h1>
        <h2 className="text-lg mt-6 md:w-4/5 font-medium dark:text-dark-text-secondary text-dark-dark-gray">
          Choose a plan that fits your business. Upgrade or cancel anytime.
        </h2>
      </div>

      {/* Right - Pricing Cards */}
      <div className="md:flex-1 grid md:grid-cols-2 gap-6 px-6 md:px-0">
        {/* Monthly Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card text-card-foreground shadow-lg rounded-3xl border border-muted p-8 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-2xl font-semibold mb-2">Monthly</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Pay as you go. Perfect for trying us out.
            </p>
            <p className="text-5xl font-bold">₹1200</p>
            <p className="text-muted-foreground">per month</p>
          </div>
          <div className="mt-8 gradient-border">
            <InteractiveHoverButton
              className="gradient-border-inner w-full text-lg"
              onClick={handleClick}
            >
              Get Started
            </InteractiveHoverButton>
          </div>
        </motion.div>

        {/* Yearly Plan - Highlighted */}
       {/* Yearly Plan - Highlighted */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1.05 }} // <- Default highlight
  transition={{ duration: 0.7, ease: "easeOut" }}
  whileHover={{ scale: 1.08 }} // <- Extra lift on hover
  className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 
             text-white shadow-2xl rounded-3xl p-8 flex flex-col justify-between 
             overflow-hidden ring-2 ring-white/40"
>
  {/* Glow effect */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

  {/* Badge */}
  <span className="absolute top-2 right-4 bg-white text-indigo-600 px-3 py-1 
                   text-xs font-semibold rounded-full shadow">
    Best Value
  </span>

  <div>
    <h3 className="text-2xl font-semibold mb-2">Yearly</h3>
    <p className="text-sm text-indigo-100 mb-6">
      Save more with an annual plan — <strong>2 months free!</strong>
    </p>
    <p className="text-5xl font-bold">₹12,000</p>
    <p className="opacity-80">per year</p>
    <p className="text-sm mt-2 bg-white/20 rounded-lg px-2 py-1 inline-block">
      You save <span className="font-bold">₹2,400</span> compared to monthly
    </p>
  </div>

  <motion.div
    whileHover={{ scale: 1.05 }}
    className="mt-8 gradient-border"
  >
    <InteractiveHoverButton
      className="gradient-border-inner w-full text-lg bg-white text-indigo-600 font-semibold"
      onClick={handleClick}
    >
      Choose Yearly Plan
    </InteractiveHoverButton>
  </motion.div>
</motion.div>

      </div>
    </section>
  );
};

export default PricingPage;
