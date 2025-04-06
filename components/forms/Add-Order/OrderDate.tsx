import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CalendarIcon, MinusCircle } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const OrderDate = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const {
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setValue("orderDate", selectedDate);
    if (selectedDate) {
      clearErrors("orderDate");
    }
  };

  useEffect(() => {
    if (date) {
      setValue("orderDate", date);
      clearErrors("orderDate");
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 md:mt-5 w-full">
      <Label className=" text-slate-600">Order Date</Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full h-12 px-4 flex items-center justify-between text-left rounded-xl shadow-sm  hover:border-primary transition-colors ${
              !date ? "text-zinc-400" : "text-zinc-800 dark:text-zinc-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon
                className={`${
                  !date ? "text-zinc-400" : "text-zinc-700 dark:text-zinc-200"
                }`}
              />
              {date ? (
                <span className="font-medium">
                  {format(date, "dd MMM yyyy")}
                </span>
              ) : (
                <span className="text-zinc-400">Pick a date</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="p-2 border rounded-xl  w-auto shadow-md"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            className="rounded-xl"
            classNames={{
              // Calendar day cell
              day: "w-9 h-9 p-0 font-normal text-sm aria-selected:opacity-100 rounded-md",

              // Selected day styling
              day_selected:
                "bg-light-primary text-red-300 hover:bg-light-primary hover:text-red-300",

              // Today’s date styling
              day_today:
                "border border-light-primary text-light-primary font-semibold dark:border-white dark:text-white",

              // Month + arrows layout: centered and spaced
              caption:
                "flex justify-center items-center gap-4 text-sm font-medium mb-2",

              // Month label style
              caption_label: "text-sm font-medium text-center",

              // Navigation icon container (gap between arrows)
              nav: "flex items-center gap-2",

              // Navigation icon button (background + hover)
              nav_button:
                "h-7 w-7 bg-red-300 hover:bg-muted text-muted-foreground",

              // Remove absolute positioning to align arrows in-line
              nav_button_previous: "",
              nav_button_next: "",

              // Weekday headings
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            }}
          />
        </PopoverContent>
      </Popover>

      {errors.orderDate && (
        <div className="flex items-center gap-1 text-sm text-red-500 mt-1">
          <MinusCircle size={16} />
          <p>Please select a date</p>
        </div>
      )}
    </div>
  );
};

export default OrderDate;
