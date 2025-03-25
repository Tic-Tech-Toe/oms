// @ts-nocheck


import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input"; // Ensure you're importing the Input component correctly

import { CircleMinus} from "lucide-react";
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { mockCustomers } from "@/data/customers";
import { Label } from "@/components/ui/label";

const CustomerNameField = () => {
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [nameSuggestions, setNameSuggestions] = useState([]);

  const onSearchCustomer = useCallback(
    debounce((query: string, field: "name") => {
      if (query) {
        // Filter customers based on name or number
        const results = mockCustomers.filter((customer) =>
          customer[field].toLowerCase().includes(query.toLowerCase())
        );
        if (field === "name") {
          setNameSuggestions(results);
        }
      } else {
        // Clear suggestions when there's no query
        if (field === "name") {
          setNameSuggestions([]);
        }
      }
    }, 300),
    []
  );

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mt-5 flex flex-col gap-2">
      <Label htmlFor="customer-name" className="text-slate-600">
        {`Customer Name`}
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          id="customer-name"
          className="h-11 shadow-none"
          placeholder="Enter name .."
          {...register("customerName")}
        />
      </div>
      {nameSuggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-white z-10 shadow-lg border rounded-md">
          {nameSuggestions.map((customer) => (
            <div
              key={customer.name}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setNameSearchQuery(customer.name); // Set the selected name in input
                field.onChange(customer.name); // Update the form field value using field.onChange
                setNameSuggestions([]); // Clear suggestions after selecting
              }}
            >
              {customer.name}
            </div>
          ))}
        </div>
      )}
      {errors.customerName && (
        <div className="text-red-500 flex gap-1 items-center text-[13px]">
          <CircleMinus size={12} />
          <p>The name is required</p>
        </div>
      )}
    </div>

    // <FormField control={control} name="custName">
    //   {({ field }) => (
    //     <FormItem className="flex w-full flex-col gap-2.5">
    //       <FormLabel className="text-base">Customer Name</FormLabel>
    //       <FormControl>
    //         <div className="relative">
    //           <div className="text-base p-2 rounded-md border outline-none flex placeholder-gray-500 items-center gap-2">
    //             <Search size={24} className="transform scale-x-[-1] text-gray-500" />
    //             <Input
    //               {...field} // Spread the field methods
    //               type="text"
    //               value={nameSearchQuery}
    //               onChange={(e) => {
    //                 const value = e.target.value;
    //                 setNameSearchQuery(value);
    //                 onSearchCustomer(value, "name"); // Trigger the search
    //               }}
    //               className="text-base min-h-12 rounded-1.5 border outline-none"
    //               placeholder="Start typing to search customer"
    //             />
    //           </div>

    //           {/* Suggestions dropdown */}
    //           {nameSuggestions.length > 0 && (
    //             <div className="absolute w-full mt-1 bg-white z-10 shadow-lg border rounded-md">
    //               {nameSuggestions.map((customer) => (
    //                 <div
    //                   key={customer.name}
    //                   className="p-2 cursor-pointer hover:bg-gray-100"
    //                   onClick={() => {
    //                     setNameSearchQuery(customer.name); // Set the selected name in input
    //                     field.onChange(customer.name); // Update the form field value using field.onChange
    //                     setNameSuggestions([]); // Clear suggestions after selecting
    //                   }}
    //                 >
    //                   {customer.name}
    //                 </div>
    //               ))}
    //             </div>
    //           )}
    //         </div>
    //       </FormControl>
    //       <FormMessage />
    //     </FormItem>
    //   )}
    // </FormField>
  );
};

export default CustomerNameField;
