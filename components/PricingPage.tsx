"use client";
import clsx from "clsx";
import { useState } from "react";
import CountUp from "react-countup";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: 1,
    title: "Starter",
    caption: "Best for individuals & small shops",
    priceMonthly: 1200,
    priceYearly: 12000,
    features: [
      "Track up to 50 shipments",
      "Email notifications",
      "Basic analytics",
    ],
    highlight: false,
  },
  {
    id: 2,
    title: "Pro",
    caption: "Perfect for growing businesses",
    priceMonthly: 2500,
    priceYearly: 25000,
    features: [
      "Unlimited shipments",
      "SMS + Email alerts",
      "Advanced analytics",
      "Priority support",
    ],
    highlight: true, // middle card highlighted
  },
  {
    id: 3,
    title: "Enterprise",
    caption: "For large-scale logistics teams",
    priceMonthly: 5000,
    priceYearly: 50000,
    features: [
      "Custom shipment limits",
      "Dedicated account manager",
      "API & integrations",
      "24/7 support",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  const [monthly, setMonthly] = useState(true);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Flexible pricing for every business
        </h2>
        <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
          Choose a plan that scales with your shipments
        </p>

        {/* Toggle Monthly / Yearly */}
        <div className="mt-8 flex justify-center">
          <div className="relative flex w-64 rounded-full border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
            <button
              onClick={() => setMonthly(true)}
              className={clsx(
                "w-1/2 rounded-full py-2 text-sm font-medium transition",
                monthly
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-300"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setMonthly(false)}
              className={clsx(
                "w-1/2 rounded-full py-2 text-sm font-medium transition",
                !monthly
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-300"
              )}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-14 flex flex-col items-center gap-6 md:gap-0 lg:flex-row lg:justify-center">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              className={clsx(
                "relative flex flex-col rounded-2xl border bg-white p-8 shadow-md transition dark:bg-gray-800 dark:border-gray-700",
                plan.highlight
                  ? "lg:scale-110 border-4 border-indigo-600 shadow-xl z-10" // <-- Add z-10 here
                  : "lg:scale-95",
                idx === 0 && "lg:rounded-r-none",
                idx === 2 && "lg:rounded-l-none"
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-md">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
                {plan.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                {plan.caption}
              </p>
              <div className="mt-6 flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  ₹
                  <CountUp
                    end={monthly ? plan.priceMonthly : plan.priceYearly}
                    duration={0.4}
                    preserveValue
                  />
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  /{monthly ? "mo" : "yr"}
                </span>
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                className="mt-8 w-full rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
                href={{
                  pathname: "/subscribe",
                  query: {
                    planId: plan.id,
                    cycle: monthly ? "monthly" : "yearly",
                  },
                }}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
