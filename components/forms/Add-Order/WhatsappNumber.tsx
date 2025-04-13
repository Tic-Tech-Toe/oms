//@ts-nocheck
"use client"; 

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



const WhatsAppNumberField = ({whatsappNum, setWhatsappNum}) => {
  const [manuallyEdited, setManuallyEdited] = useState(false);

  const handleFocus = () => {
    if (!manuallyEdited && whatsappNum) {
      setWhatsappNum(""); // Clear autofilled number
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setWhatsappNum("91" + inputValue.replace(/^91/, "")); // ensure no duplicate '91'
    setManuallyEdited(true);
  };



  return (
    <div className="mt-5 flex flex-col gap-2">
      <Label htmlFor="whatsapp-no" className="text-slate-600">
        Whatsapp Number
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          id="whatsapp-no"
          value={whatsappNum.replace(/^91/, "")} // remove '91' prefix in display
          onFocus={handleFocus}
          onChange={handleChange}
          className="h-11 shadow-none rounded-xl"
          placeholder="Enter number .."
        />
      </div>
    </div>
  );
};

export default WhatsAppNumberField;
