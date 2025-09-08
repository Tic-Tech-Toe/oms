"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ArrowRightCircle, CalendarSearchIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { TimePicker } from "./TimePicker";
import { useState } from "react";

const formSchema = z.object({
  dateTime: z.date(),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface Props {
  onConfirm: (formatted: string) => void;
}

const DateTimePicker = ({ onConfirm }: Props) => {
  const [dateFlag, setDateFlag] = useState(false);
  const [open, setOpen] = useState(false);

  const dateTimeForm = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: FormSchemaType) {
    const formattedDate = format(values.dateTime, "EEE, MMM d yyyy, 'at' HH:mm");
    // setDeliveryWindow(formattedDate); // Send formatted date to parent component
    onConfirm(formattedDate)
    setOpen(false); // Close the popover
    // onClose?.(); // Close the dialog

    // Optionally log the result or perform additional actions
    console.log(formattedDate);
  }

  return (
    <Form {...dateTimeForm}>
      <form onSubmit={dateTimeForm.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={dateTimeForm.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Pick Date</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className={`w-[280px] justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                  >
                    <CalendarSearchIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "PPP - HH:mm")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  {dateFlag ? (
                    <div className="px-2 py-1 flex items-end">
                      <Button
                        variant="ghost"
                        onClick={() => setDateFlag((prev) => !prev)}
                        className="w-full flex justify-start rotate-180"
                      >
                        <ArrowRightCircle size={16} />
                      </Button>
                      <TimePicker date={field.value} setDate={field.onChange} />
                    </div>
                  ) : (
                    <>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => { field.onChange(date); setDateFlag(true); }}

                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                      <Button
                        variant="ghost"
                        disabled={!field.value}
                        onClick={() => setDateFlag((prev) => !prev)}
                        className="w-full flex justify-end"
                      >
                        <ArrowRightCircle size={16} />
                      </Button>
                    </>
                  )}
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-light-primary text-white rounded-full flex justify-self-end hover:bg-blue-700">
          Next
        </Button>
      </form>
    </Form>
  );
};

export default DateTimePicker;
