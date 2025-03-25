//@ts-nocheck
"use client"; 

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
// import { debounce } from "lodash";
// import { mockCustomers } from "@/data/customers";
import { Label } from "@/components/ui/label";



const WhatsAppNumberField = ({setWhatsappNum}) => {
  const [numberSearchQuery, setNumberSearchQuery] = useState("");
  const [numberSuggestions, setNumberSuggestions] = useState([]);

  // const onSearchCustomer = useCallback(
  //   debounce((query: string) => {
  //     if (query) {
  //       const results = mockCustomers.filter((customer) =>
  //         customer.whatsappNumber.includes(query)
  //       );
  //       setNumberSuggestions(results);
  //     } else {
  //       setNumberSuggestions([]);
  //     }
  //   }, 300),
  //   []
  // );

  return (
    <div className="mt-5 flex flex-col gap-2">
      <Label htmlFor="whatsapp-no" className="text-slate-600">
        {`Whatsapp Number`}
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          id="whatsapp-no"
          onChange={(num) => setWhatsappNum("91"+num.target.value)}
          className="h-11 shadow-none"
          placeholder="Enter number .."
        />
      </div>
    </div>
    // <Controller
    //   name={name} // Form field name
    //   control={control} // Pass the control prop from the parent form
    //   render={({ field }) => (
    //     <FormItem className="flex w-full flex-col gap-2.5">
    //       <FormLabel className="text-base">Whatsapp Number</FormLabel>
    //       <FormControl>
    //         <div className="relative">
    //           <div className="text-base p-2 rounded-md border outline-none flex placeholder-gray-500 items-center gap-2">
    //             <Search size={24} className="transform scale-x-[-1] text-gray-500" />
    //             <Input
    //               {...field} // Spread field methods
    //               type="text"
    //               value={numberSearchQuery}
    //               onChange={(e) => {
    //                 const value = e.target.value;
    //                 setNumberSearchQuery(value);
    //                 onSearchCustomer(value); // Trigger search with debounced input
    //               }}
    //               className="text-base min-h-12 rounded-1.5 border outline-none"
    //               placeholder="Start typing to search number"
    //             />
    //           </div>

    //           {/* Suggestions dropdown */}
    //           {numberSuggestions.length > 0 && (
    //             <div className="absolute w-full mt-1 bg-white z-10 shadow-lg border rounded-md">
    //               {numberSuggestions.map((customer) => (
    //                 <div
    //                   key={customer.whatsappNumber}
    //                   className="py-2 px-6 cursor-pointer hover:bg-gray-100 flex justify-between"
    //                   onClick={() => {
    //                     setNumberSearchQuery(customer.whatsappNumber); // Set the selected number in input
    //                     field.onChange(customer.whatsappNumber); // Update form field value
    //                     setNumberSuggestions([]); // Clear suggestions after selection
    //                   }}
    //                 >
    //                   <span className="font-bold">{customer.whatsappNumber}</span>
    //                   <span>{customer.name}</span>
    //                 </div>
    //               ))}
    //             </div>
    //           )}
    //         </div>
    //       </FormControl>
    //       <FormMessage />
    //     </FormItem>
    //   )}
    // />
  );
};

export default WhatsAppNumberField;
