//@ts-nocheck

"use client"

import { useState, useCallback, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Search, Plus, Minus, ShoppingBag, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "lodash";
import { mockItemsData } from "@/data/item";
import ShoppingBagDialog from "@/components/ShoppingBagDialog";

const PickOrderField = () => {
  const { setValue, formState: { errors } } = useFormContext();
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productSuggestions, setProductSuggestions] = useState(mockItemsData);
  const [productQuantities, setProductQuantities] = useState({});
  const [cartState, setCartState] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef(null);

  // Debounced function to handle product search
  const onSearchProduct = useCallback(
    debounce((query) => {
      if (query.trim() === "") {
        setProductSuggestions(mockItemsData); // Show all products when input is empty
      } else {
        const results = mockItemsData.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setProductSuggestions(results);
      }
    }, 300),
    []
  );

  // Function to clear input field
  const clearSearch = () => {
    setProductSearchQuery("");
    setProductSuggestions(mockItemsData);
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <FormField name="pickOrder" render={({ field }) => (
      <FormItem className="flex w-full flex-col mt-5">
        <FormLabel className="text-slate-600">
          <div className="flex justify-between items-center">
            <span>Pick Order</span>
            {/* <div className="relative">
              <ShoppingBag />
              {Object.keys(cartState).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {Object.keys(cartState).length}
                </span>
              )}
            </div> */}

            <ShoppingBagDialog cartState={cartState} setCartState={setCartState} />
          </div>
        </FormLabel>
        <FormControl>
          <div className="relative" ref={inputRef}>
            <div className="text-base p-2 rounded-md border outline-none flex items-center gap-2">
              <Search size={24} className="transform scale-x-[-1] text-gray-500" />
              <Input
                {...field}
                type="text"
                value={productSearchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setProductSearchQuery(value);
                  onSearchProduct(value);
                  setIsDropdownOpen(true); // Open dropdown when typing
                }}
                onFocus={() => setIsDropdownOpen(true)} // Open dropdown when input is focused
                className="text-base min-h-12 rounded-1.5 border outline-none flex-1"
                placeholder="Start typing to search product"
              />
              {productSearchQuery && (
                <button onClick={clearSearch} className="text-gray-500 hover:text-gray-800">
                  <X size={20} />
                </button>
              )}
              <button onClick={toggleDropdown} className="text-gray-500 hover:text-gray-800">
                <ChevronDown size={20} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Suggestions dropdown */}
            {isDropdownOpen && productSuggestions.length > 0 && (
              <div className="absolute w-full mt-1 bg-white z-10 shadow-lg border rounded-md">
                {productSuggestions.map((product) => (
                  <div key={product.itemId} className="p-2 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 bg-background">
                    <div className="flex items-center justify-between px-4 gap-1">
                      <Image
                        src={product.itemImage || '/fallback-image.png'}
                        alt={product.name}
                        width={24}
                        height={24}
                        className="rounded-md"
                      />
                      <span className="text-sm w-full font-semibold ml-8">{product.name}</span>
                      <div className="flex ml-8">
                        <Minus
                          size={16}
                          className="bg-gray-200 hover:border hover:border-red-400 rounded-full p-0.5 mr-4"
                          onClick={() => setProductQuantities((prev) => ({
                            ...prev, [product.name]: Math.max((prev[product.name] || 1) - 1, 0),
                          }))}
                        />
                        <input
                          type="number"
                          value={productQuantities[product.name] || 1}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            setProductQuantities((prev) => ({
                              ...prev,
                              [product.name]: isNaN(value) || value < 0 ? 0 : value,
                            }));
                          }}
                          className="w-12 text-xs font-bold text-center border rounded-md"
                        />
                        <Plus
                          size={16}
                          className="bg-gray-200 hover:bg-green-600 rounded-full p-0.5 ml-4"
                          onClick={() => setProductQuantities((prev) => ({
                            ...prev, [product.name]: (prev[product.name] || 0) + 1,
                          }))}
                        />
                        <input
                          type="checkbox"
                          className="ml-4"
                          onChange={(e) => {
                            setCartState((prev) => {
                              const newCart = { ...prev };
                              if (e.target.checked) {
                                newCart[product.itemId] = { 
                                  itemId: product.itemId,
                                  quantity: productQuantities[product.name] || 1,
                                  price: product.price,
                                  sku: product.sku,
                                  category: product.category,
                                };
                                toast({ title: `${product.name} added to cart` });
                              } else {
                                delete newCart[product.itemId];
                                toast({ title: `${product.name} removed from cart` });
                              }
                              setValue("items", Object.values(newCart));
                              return newCart;
                            });
                          }}
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
