import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"

import React, { useEffect, useState } from 'react'
import { CalendarIcon, MinusCircle } from 'lucide-react'
import { useFormContext } from 'react-hook-form'


const OrderDate = () => {
    const [date,setDate]=useState<Date | undefined>(new Date())
    const {
        setValue,
        clearErrors,
        formState: { errors }
    } = useFormContext()

    const handleDateChange = (selectedDate : Date | undefined) => {
        setDate(selectedDate)
        setValue("orderDate", selectedDate)
        if(selectedDate){
            clearErrors("orderDate")
        }
    }

    useEffect(() => {
        console.log(date);

        if(date){
            setValue("orderDate",date);
            clearErrors("orderDate")
        }
    },[])
  return (
    <div className='flex flex-col gap-2 md:mt-5'>
        <Label className="text-slate-600">Order/Update Date</Label>
        <Popover>
            <PopoverTrigger className='border' asChild>
                <Button variant='outline' className='border flex gap-1 items-center justify-start '>
                    <CalendarIcon className={`${!date &&  'text-slate-500'}`} />
                    {date ?(
                        format(date,"dd - MM - yy")
                    ):(
                        <span className='text-slate-500'>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar
                    mode='single'
                    selected={date}
                    onSelect={handleDateChange}
                    className='rounded-md'
                />
            </PopoverContent>
        </Popover>
        {errors.orderDate && (
            <div className='flex gap-1 items-center text-sm text-red-500'>
            <MinusCircle />
            <p>Please select date</p>
        </div>
        )}
        
    </div>
  )
}

export default OrderDate