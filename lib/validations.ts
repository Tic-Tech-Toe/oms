import { z } from 'zod';


export const AddOrderSchema = z.object({
    custName: z.string().min(6,{message: 'Name is required'}).max(50, {message:"Name cannot exceed 50 charaters"}),
    whatsappNo: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }) 
    .length(10, { message: "Phone number must be exactly 10 digits" }),
    pickOrder: z
    .string()
    .min(1, { message: "You must pick an order" }) 
    .refine((val) => val !== "", { message: "Pick an order from the list" }),
})