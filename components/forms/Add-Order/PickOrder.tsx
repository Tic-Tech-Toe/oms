// @ts-nocheck
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Search,
  Plus,
  Minus,
  X,
  ChevronDown,
} from "lucide-react";
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

  const onSearchProduct = useCallback(
    debounce((query) => {
      if (query.trim() === "") {
        setProductSuggestions(mockItemsData);
      } else {
        const results = mockItemsData.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setProductSuggestions(results);
      }
    }, 300),
    []
  );

  const clearSearch = () => {
    setProductSearchQuery("");
    setProductSuggestions(mockItemsData);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

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
        <FormLabel className="text-slate-600 ">
          <div className="flex justify-between items-center">
            <span>Pick Order</span>
            <ShoppingBagDialog cartState={cartState} setCartState={setCartState} />
          </div>
        </FormLabel>

        <FormControl>
          <div className="relative" ref={inputRef}>
            <div className="text-base h-12 rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-zinc-500">
              <Search size={20} className="transform scale-x-[-1] text-gray-500 dark:text-gray-400" />
              <Input
                {...field}
                type="text"
                value={productSearchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setProductSearchQuery(value);
                  onSearchProduct(value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="text-base bg-transparent border-none outline-none flex-1 placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                placeholder="Start typing to search product"
              />
              {productSearchQuery && (
                <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                  <X size={18} />
                </button>
              )}
              <button onClick={toggleDropdown} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <ChevronDown
                  size={18}
                  className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {isDropdownOpen && (
              <div className="absolute w-full mt-2 z-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-80 overflow-y-auto transition-all animate-fade-in">
                {productSuggestions.length === 0 ? (
                  <div className="text-center text-sm text-gray-500 dark:text-zinc-400 py-3">
                    No products found.
                  </div>
                ) : (
                  productSuggestions.map((product) => (
                    <div
                      key={product.itemId}
                      className="p-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all"
                    >
                      <div className="flex items-center justify-between px-2 gap-2">
                        <Image
                          src={product.itemImage || "/fallback-image.png"}
                          alt={product.name}
                          width={32}
                          height={32}
                          className="rounded-md"
                        />
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 flex-1 ml-4">
                          {product.name}
                        </span>

                        <div className="flex items-center gap-2">
                          <Minus
                            size={16}
                            className="bg-zinc-200 dark:bg-zinc-700 hover:border hover:border-red-400 rounded-full p-1 cursor-pointer"
                            onClick={() =>
                              setProductQuantities((prev) => ({
                                ...prev,
                                [product.name]: Math.max((prev[product.name] || 1) - 1, 0),
                              }))
                            }
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
                            className="w-12 text-xs text-center font-semibold border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
                          />
                          <Plus
                            size={16}
                            className="bg-zinc-200 dark:bg-zinc-700 hover:bg-green-600 text-zinc-700 dark:text-zinc-300 rounded-full p-1 cursor-pointer"
                            onClick={() =>
                              setProductQuantities((prev) => ({
                                ...prev,
                                [product.name]: (prev[product.name] || 0) + 1,
                              }))
                            }
                          />
                          <input
                            type="checkbox"
                            className="ml-2 w-4 h-4 accent-green-500"
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
                  ))
                )}
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
