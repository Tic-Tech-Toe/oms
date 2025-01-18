import { z } from 'zod';

export const AddOrderSchema = z.object({
  customerName: z
    .string()
    .min(1, { message: 'Name is required' }),
  orderDate: z
    .date({required_error:"Please select date"})
    .refine((date) => !!date,"Date is required"),
  items: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z
          .number()
          .min(1, { message: "Quantity should be at least 1" }),
      })
    )
    .min(1, { message: "Order must have at least one item" }), 
});
