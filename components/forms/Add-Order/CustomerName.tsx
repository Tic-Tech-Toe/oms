// @ts-nocheck

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // ← import a Switch component
import { CircleMinus } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { useAuth } from "@/hooks/useAuthStore";
import { getCustomers } from "@/utils/getFirestoreCustomers";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/config/firebase";

// import { mockCustomers } from "@/data/customers";

const CustomerNameField = ({customers,isNewCustomer, setIsNewCustomer}) => {
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  // const [customers, setCustomers] = useState();
  console.log(customers)

 

  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();

  const customerNameValue = watch("customerName");

  const onSearchCustomer = useCallback(
    debounce((query: string) => {
      if (query && !isNewCustomer) {
        const results = customers.filter((customer) =>
          customer.name.toLowerCase().includes(query.toLowerCase())
        );
        setNameSuggestions(results);
      } else {
        setNameSuggestions([]);
      }
    }, 300),
    [isNewCustomer]
  );

  const handleSelectCustomer = (customer) => {
    setValue("customerName", customer.name);
    setNameSuggestions([]);
    // You can optionally set other fields here if needed
  };

  return (
    <div className="mt-5 flex flex-col gap-2 relative">
      <Label htmlFor="customer-name" className="text-slate-600">
        Customer Name
      </Label>
      <Input
        type="text"
        id="customer-name"
        className="h-11 shadow-none rounded-xl"
        placeholder="Start typing to search customer"
        {...register("customerName")}
        onChange={(e) => {
          const value = e.target.value;
          setValue("customerName", value);
          onSearchCustomer(value);
        }}
        disabled={false}
      />

      {/* Suggestions */}
      {!isNewCustomer && nameSuggestions.length > 0 && (
        <div className="absolute w-full mt-20 bg-background z-10 shadow-lg border rounded-xl max-h-48 overflow-y-auto">
          {nameSuggestions.map((customer) => (
            <div
              key={customer.id}
              className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleSelectCustomer(customer)}
            >
              {customer.name}
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {errors.customerName && (
        <div className="text-red-500 flex gap-1 items-center text-[13px]">
          <CircleMinus size={12} />
          <p>{errors.customerName.message || "The name is required"}</p>
        </div>
      )}

      {/* Switch to add new customer */}
      <div className="mt-3 flex items-center gap-3">
        <Switch
        className="bg-light-primary/40"
          id="new-customer-toggle"
          checked={isNewCustomer}
          onCheckedChange={(checked) => {
            setIsNewCustomer(checked);
            if (checked) {
              setNameSuggestions([]); // Hide suggestions
            }
          }}
        />
        <Label htmlFor="new-customer-toggle" className="text-sm text-slate-700">
          This is a new customer
        </Label>
      </div>
    </div>
  );
};

export default CustomerNameField;
