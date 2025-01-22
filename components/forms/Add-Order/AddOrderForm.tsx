import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DefaultValues, FieldValues, useForm, SubmitHandler, Control } from "react-hook-form";
import CustomerNameField from "./CustomerName";
import WhatsAppNumberField from "./WhatsappNumber";
import PickOrderField from "./PickOrder";

interface AddOrderFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  formType: "ADD_ORDER";
  defaultVal: T;
  onSubmit: (data: T) => void;
}

const AddOrderForm = <T extends FieldValues>({
  schema,
  formType,
  defaultVal,
  onSubmit,
}: AddOrderFormProps<T>) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultVal as DefaultValues<T>,
  });

  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const { setValue, handleSubmit, control } = form;

  // Use effect to ensure form is only rendered client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFormSubmit: SubmitHandler<T> = (data) => {
    // Log only the form data here
    console.log("Form Data:", data);

    // You can then use the form data for any further processing, such as creating an order
    // Example (optional for logging order generation):
    const newOrder = {
      id: generateOrderId(),
      orderDate: new Date().toISOString(),
      status: "pending",
      totalAmount: 100, // Default total, can be dynamically set
      paymentStatus: "pending",
      shippingAddress: "", // Optionally add shipping address
      billingAddress: "", // Optionally add billing address
      items: data.pickOrder.map((item: { name: string; quantity: number }) => ({
        productId: item.name,
        quantity: item.quantity,
      })),
      customer: { name: data.custName, whatsappNumber: data.whatsappNo },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // You can log the order if needed
    console.log("New Order Object:", newOrder);

    // Call the parent component's onSubmit function
    onSubmit(newOrder);

    // Show success toast message
    toast({
      title: "Order added successfully",
      description: "Your order has been added to the list.",
    });
    form.reset();
  };

  // Prevent rendering the form before client-side mount to avoid hydration error
  if (!isClient) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-10 w-full">
        {/* Customer Name Field */}
        <CustomerNameField control={control} />

        <WhatsAppNumberField
        control={control}
        name="whatsappNumber"  
        selectedCustomer={null} 
      />

        {/* Pick Order Field */}
        <PickOrderField control={control} setValue={setValue} />

        <div className="flex justify-between items-center">
          <div>
            <input
              type="checkbox"
              checked={form.getValues("sendToWhatsapp")}
              onChange={(e) => setValue("sendToWhatsapp", e.target.checked)} // Connect checkbox state to form
              className="mr-2"
            />
            <span>Send to WhatsApp</span>
          </div>
          <Button type="submit">Add order</Button>
        </div>
      </form>
    </Form>
  );
};

// Helper function to generate a unique order ID
const generateOrderId = () => {
  return 'order-' + Math.random().toString(36).substr(2, 9); // Generates a random string for the order ID
};

export default AddOrderForm;
