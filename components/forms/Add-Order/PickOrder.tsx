import { useState, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Search, List, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "lodash";
import { mockItemsData } from "@/data/item";

const PickOrderField = () => {
  const { setValue, getValues, formState: { errors } } = useFormContext(); // Access form context
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [cartState, setCartState] = useState({});
  const [toastMessage, setToastMessage] = useState("");

  const { toast } = useToast();

  // Debounced function to handle product search
  const onSearchProduct = useCallback(
    debounce((query) => {
      if (query) {
        const results = mockItemsData.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setProductSuggestions(results);
      } else {
        setProductSuggestions([]);
      }
    }, 300),
    []
  );

  // Function to handle increase in product quantity
  const handleIncrease = (productName) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productName]: (prevQuantities[productName] || 0) + 1,
    }));
  };

  // Function to handle decrease in product quantity
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

  // Function to handle direct quantity input
  const handleQuantityChange = (productName, value) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productName]: parsedValue,
      }));
    } else if (value === "") {
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productName]: 0,
      }));
    }
  };

  // Function to handle when product checkbox is selected
  const handleCheckboxChange = (product, checked) => {
    setCartState((prevCartState) => {
      const newCartState = { ...prevCartState };

      // If the product is checked, add it to the cart state
      if (checked) {
        newCartState[product.itemId] = {
          itemId: product.itemId,  // Store itemId
          quantity: productQuantities[product.name] || 1,  // Store quantity
          price: product.price,  // Store price
          sku: product.sku,      // Store SKU if available
          category: product.category,  // Store category if available
        };

        // Toast notification for added item
        toast({
          title: `${product.name} added to the cart`,
          description: `You added ${productQuantities[product.name] || 1} of ${product.name} to your cart.`,
        });
      } else {
        // If the product is unchecked, remove it from the cart state
        delete newCartState[product.itemId];
        toast({
          title: `${product.name} removed from cart`,
          description: `You removed ${product.name} from your cart.`,
        });
      }

      // Update the form state (items) with the new cart state
      setValue(
        "items",
        Object.values(newCartState)
      );
      console.log("Cart State Updated: ", newCartState);
      return newCartState;
    });
  };

  return (
    <FormField name="pickOrder" render={({ field }) => (
      <FormItem className="flex w-full flex-col gap-2.5">
        <FormLabel className="text-base">Pick Order</FormLabel>
        <FormControl>
          <div className="relative">
            <div className="text-base p-2 rounded-md border outline-none flex placeholder-gray-500 items-center gap-2">
              <Search size={24} className="transform scale-x-[-1] text-gray-500" />
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
              <div className="absolute w-full mt-1 bg-light-background dark:bg-dark-dark-gray z-10 shadow-lg border rounded-md">
                {productSuggestions.map((product) => (
                  <div key={product.itemId} className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-background">
                    <div className="flex items-center justify-between px-4 gap-1">
                      <Image
                        src={product.itemImage || '/fallback-image.png'} // Fallback image
                        alt={product.name}
                        width={24}
                        height={24}
                        className="rounded-md"
                      />
                      <span className="text-sm w-full font-semibold ml-8">{product.name}</span>
                      <div className="flex ml-8">
                        <Minus
                          size={16}
                          className="bg-gray-200 dark:bg-gray-900 hover:border hover:border-red-400 rounded-full p-0.5 mr-4"
                          onClick={() => handleDecrease(product.name)}
                        />
                        <input
                          type="number"
                          value={productQuantities[product.name] || 1}
                          onChange={(e) => handleQuantityChange(product.name, e.target.value)}
                          className="w-12 text-xs font-bold text-center border rounded-md"
                        />
                        <Plus
                          size={16}
                          className="bg-gray-200 dark:bg-gray-800 dark:hover:bg-green-600 hover:bg-green-600 rounded-full p-0.5 ml-4"
                          onClick={() => handleIncrease(product.name)}
                        />
                        <input
                          type="checkbox"
                          className="ml-4"
                          onChange={(e) => handleCheckboxChange(product, e.target.checked)} // Passing the product directly
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
    )} />
  );
};

export default PickOrderField;
