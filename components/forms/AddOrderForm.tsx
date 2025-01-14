"use client"

import { zodResolver } from "@hookform/resolvers/zod";

import { z, ZodType } from "zod";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { Search, List, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";

// Mock customer data
const mockCustomers = [
  { id: 1, name: "Rajesh Kumar", number: "9876543210" },
  { id: 2, name: "Priya Sharma", number: "9123456789" },
  { id: 3, name: "Anil Verma", number: "8822334455" },
  { id: 4, name: "Sneha Gupta", number: "7012345678" },
  { id: 5, name: "Amit Patel", number: "9900112233" },
  { id: 6, name: "Meera Rao", number: "8877665544" },
  { id: 7, name: "Vijay Singh", number: "9587554433" },
  { id: 8, name: "Neha Yadav", number: "9333556677" },
  { id: 9, name: "Suresh Reddy", number: "9678123456" },
  { id: 10, name: "Rina Desai", number: "9422887665" },
];

const mockProductData = [
  {
    id: 1,
    orderName: "Ord001",
    productName: "Burger Boxes",
    productImage: "/products/burgerBox.webp",
  },
  {
    id: 2,
    orderName: "Ord002",
    productName: "Clampshell Boxes",
    productImage: "/products/clampShell.png",
  },
  {
    id: 3,
    orderName: "Ord003",
    productName: "Plastic Container",
    productImage: "/products/plasticBoxes.png",
  },
  {
    id: 4,
    orderName: "Ord004",
    productName: "Roll Box",
    productImage: "/products/rollBox.png",
  },
  {
    id: 5,
    orderName: "Ord005",
    productName: "Cling Roll",
    productImage: "/products/.png",
  },
];

interface AddOrderFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  formType: "ADD_ORDER";
  defaultVal: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
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

  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [numberSearchQuery, setNumberSearchQuery] = useState("");
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [numberSuggestions, setNumberSuggestions] = useState([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [productQuantities, setProductQuantities] = useState({});
  const [isEditingQuantity, setIsEditingQuantity] = useState(null);

  const [sendToWhatsapp, setSendToWhatsapp] = useState(false);

  const [cartState, setCartState] = useState({}); 
  const [toastMessage, setToastMessage] = useState(""); 

  
  // Set client-side flag after initial render
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { toast } = useToast();

  const handleSendToWhatsapp = (e) => {
    setSendToWhatsapp(e.target.checked);
  };


  const handleIncrease = (productName) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productName]: (prevQuantities[productName] || 0) + 1,
    }));
  };
  
  const handleDecrease = (productName) => {
    setProductQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productName] || 0;
      if (currentQuantity > 0) {
        return {
          ...prevQuantities,
          [productName]: currentQuantity - 1,
        };
      }
      return prevQuantities; // Don't allow negative quantities
    });
  };

  const handleQuantityChange = (productName, value) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productName]: parsedValue,
      }));
    } else if (value === "") {
        // Handle erasing the value
        setProductQuantities((prevQuantities) => ({
          ...prevQuantities,
          [productName]: 0, 
        }));
      }
  };
  
  const handleQuantityBlur = () => {
    setIsEditingQuantity(null);
  };
  
  const handleQuantityFocus = (productName) => {
    setIsEditingQuantity(productName);
  };

  // Debounced function to fetch suggestions for both fields
  const onSearchCustomer = useCallback(
    debounce((query: string, field: "name" | "number") => {
      if (query) {
        // Filter customers based on name or number
        const results = mockCustomers.filter((customer) =>
          customer[field].toLowerCase().includes(query.toLowerCase())
        );
        if (field === "name") {
          setNameSuggestions(results);
        } else {
          setNumberSuggestions(results);
        }
      } else {
        // Clear suggestions when there's no query
        if (field === "name") {
          setNameSuggestions([]);
        } else {
          setNumberSuggestions([]);
        }
      }
    }, 300),
    []
  );

  const onSearchProduct = useCallback(
    debounce((query) => {
      if (query) {
        const results = mockProductData.filter((product) =>
          product.productName.toLowerCase().includes(query.toLowerCase())
        );
        setProductSuggestions(results);
      } else {
        setProductSuggestions([]);
      }
    }, 300),
    []
  );

  const handleCheckboxChange = (productName, checked) => {
    if (checked) {
      toast({
        title: `${productQuantities[productName] || 0} ${productName} added to the cart`,
        description: `You added ${productQuantities[productName] || 0} of ${productName} to your cart.`,
      });
    } else {
      toast({
        title: `${productName} removed from cart`,
        description: `You removed ${productName} from your cart.`,
      });
    }
  };


  const handleSubmit: SubmitHandler<T> = async () => {};

  const buttonText = "Add order";

  // Prevent rendering suggestions and fields before the client-side mount
  if (!isClient) {
    return null; // This ensures that we don't attempt to render dynamic content on SSR
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 mt-10 md:w-2/5 w-full"
      >
        {/* Customer Name Field */}
        <FormField
          control={form.control}
          name="custName"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5">
              <FormLabel className="text-base">Customer Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="text-base p-2 rounded-md border outline-none flex placeholder-gray-500 items-center gap-2">
                    <Search
                      size={24}
                      className="transform scale-x-[-1] text-gray-500"
                    />
                    <Input
                      {...field}
                      type="text"
                      value={nameSearchQuery}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNameSearchQuery(value);
                        onSearchCustomer(value, "name");
                      }}
                      className="text-base min-h-12 rounded-1.5 border outline-none"
                      placeholder="Start typing to search customer"
                    />
                  </div>

                  {/* Suggestions dropdown */}
                  {nameSuggestions.length > 0 && (
                    <div className="absolute w-full mt-1 bg-white z-10 shadow-lg border rounded-md">
                      {nameSuggestions.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setNameSearchQuery(customer.name); // Set the selected name in input
                            field.onChange(customer.name); // Update the form field value
                            setNameSuggestions([]); // Clear suggestions after selecting
                          }}
                        >
                          {customer.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Whatsapp Number Field */}
        <FormField
          control={form.control}
          name="whatsappNo"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5">
              <FormLabel className="text-base">Whatsapp Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="text-base p-2 rounded-md border outline-none flex placeholder-gray-500 items-center gap-2">
                    <Search
                      size={24}
                      className="transform scale-x-[-1] text-gray-500"
                    />
                    <Input
                      {...field}
                      type="text"
                      value={numberSearchQuery}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNumberSearchQuery(value);
                        onSearchCustomer(value, "number");
                      }}
                      className="text-base min-h-12 rounded-1.5 border outline-none"
                      placeholder="Start typing to search number"
                    />
                  </div>

                  {/* Suggestions dropdown */}
                  {numberSuggestions.length > 0 && (
                    <div className="absolute w-full mt-1 bg-white z-10 shadow-lg border rounded-md">
                      {numberSuggestions.map((customer) => (
                        <div
                          key={customer.id}
                          className="py-2 px-6 cursor-pointer hover:bg-gray-100 flex justify-between"
                          onClick={() => {
                            setNumberSearchQuery(customer.number); // Set the selected number in input
                            field.onChange(customer.number); // Update the form field value
                            setNumberSuggestions([]); // Clear suggestions after selecting
                          }}
                        >
                          <span className="font-bold">{customer.number}</span>
                          <span>{customer.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pick Order Field */}
        {/* <FormField
          control={form.control}
          className="w-full"
          name="pickOrder"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5">
              <FormLabel className="text-base">Pick Order</FormLabel>
              <FormControl>
                <div className="text-base p-2 rounded-md border outline-none flex placeholder-gray-500 items-center gap-2">
                  <Search size={24} className="transform scale-x-[-1] text-gray-500" />
                  <Input placeholder="Start typing to search item" className="border-none" type="text" />
                  <List size={24} className="text-blue-500" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
        name="pickOrder"
        render={({ field }) => (
          <FormItem className="flex w-full flex-col gap-2.5">
            <FormLabel className="text-base">Pick Order</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="text-base p-2 rounded-md border outline-none flex placeholder-gray-500 items-center gap-2">
                  <Search
                    size={24}
                    className="transform scale-x-[-1] text-gray-500"
                  />
                  <Input
                    {...field}
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => {
                      const value = e.target.value;
                      setProductSearchQuery(value);
                      onSearchProduct(value); // Trigger debounced search
                    }}
                    className="text-base min-h-12 rounded-1.5 border outline-none"
                    placeholder="Start typing to search product"
                  />
                </div>

                {/* Suggestions dropdown */}
                {productSuggestions.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white z-10 shadow-lg border rounded-md">
                    {productSuggestions.map((product) => (
                      <div
                        key={product.id}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        
                      >
                        <div className="flex items-center justify-between px-4 gap-1">
                          <Image
                            src={product.productImage}
                            alt={product.productName}
                            width={24}
                            height={24}
                            className="rounded-md"
                          />
                          <span className="text-sm w-full font-semibold ml-8">
                            {product.productName}
                          </span>
                          <div className="flex ml-8">
                            <Minus
                              size={16}
                              className="bg-gray-200 hover:bg-red-300 rounded-full p-0.5 mr-4"
                              onClick={() => handleDecrease(product.productName)}
                            />
                            {isEditingQuantity === product.productName ? (
                              <input
                                type="number"
                                value={productQuantities[product.productName] || 0}
                                onChange={(e) => handleQuantityChange(product.productName, e.target.value)}
                                onBlur={handleQuantityBlur}
                                autoFocus
                                className="w-12 text-xs font-bold text-center border rounded-md"
                              />
                            ) : (
                              <span
                                className="text-xs font-bold"
                                onClick={() => handleQuantityFocus(product.productName)}
                              >
                                {productQuantities[product.productName] || 0}
                              </span>
                            )}
                            <Plus
                              size={16}
                              className="bg-gray-200 hover:bg-green-300 rounded-full p-0.5 ml-4"
                              onClick={() => handleIncrease(product.productName)}
                            />
                             <input
                                type="checkbox"
                                className="ml-4"
                                onChange={(e) =>
                                  handleCheckboxChange(product.productName, e.target.checked)
                                }
                              />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Other form fields */}
      <div className="flex justify-between items-center">
        <div>
          <input
            type="checkbox"
            checked={sendToWhatsapp}
            onChange={handleSendToWhatsapp}
            className="mr-2"
          />
          <span>Send to WhatsApp</span>
        </div>
        <Button type="submit">{buttonText}</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddOrderForm;