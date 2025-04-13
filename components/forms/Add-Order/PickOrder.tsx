// @ts-nocheck
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  AlertTriangle,
} from "lucide-react";
import { debounce } from "lodash";
import { useToast } from "@/hooks/use-toast";
import { useInventoryStore } from "@/hooks/zustand_stores/useInventoryStore";
import ShoppingBagDialog from "@/components/ShoppingBagDialog";
import { ItemType } from "@/types/orderType";

const PickOrderField = ({ userId }: { userId: string }) => {
  const { inventory, loadInventory } = useInventoryStore();
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<ItemType>([]);
  const [quantities, setQuantities] = useState({});
  const [cartState, setCartState] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  const { toast } = useToast();

  useEffect(() => {
    loadInventory(userId);
  }, [userId]);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredItems(inventory);
    }
  }, [inventory, query]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (!value.trim()) {
        setFilteredItems(inventory);
      } else {
        setFilteredItems(
          inventory.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
          )
        );
      }
    }, 300),
    [inventory]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateCart = (product, isChecked) => {
    setCartState((prev) => {
      const updated = { ...prev };
      if (isChecked) {
        const selectedQty = quantities[product.itemId] || 1;
        updated[product.itemId] = {
          itemId: product.itemId,
          quantity: selectedQty,
          price: product.price,
          total: (product.price || 0) * selectedQty,
          sku: product.sku,
          category: product.category,
          itemName: product.name,
        };
        toast({ title: `${product.name} added to cart.` });
      } else {
        delete updated[product.itemId];
        toast({ title: `${product.name} removed from cart.` });
      }
      setValue("items", Object.values(updated));
      return updated;
    });
  };

  return (
    <FormField
      name="items"
      render={() => (
        <FormItem className="flex w-full flex-col mt-5">
          <FormLabel className="text-slate-600">
            <div className="flex justify-between items-center">
              <span>Pick Order</span>
              <ShoppingBagDialog
                cartState={cartState}
                setCartState={setCartState}
              />
            </div>
          </FormLabel>

          {/* Global warnings above input */}
          {inventory.length > 0 &&
            Object.entries(quantities)
              .filter(([itemId, qty]) => {
                const item = inventory.find((i) => i.itemId === itemId);
                return item && qty > item.quantity;
              })
              .map(([itemId, qty]) => {
                const item = inventory.find((i) => i.itemId === itemId);
                return (
                  <div
                    key={`warn-${itemId}`}
                    className="flex items-center gap-2 text-yellow-800 bg-yellow-100 border border-yellow-300 px-3 py-1 rounded-md text-sm mb-1"
                  >
                    <AlertTriangle size={16} />
                    <span>
                      <strong>{item.name}</strong>: selected quantity ({qty})
                      exceeds available stock ({item.quantity})
                    </span>
                  </div>
                );
              })}

          <FormControl>
            <div className="relative" ref={inputRef}>
              <div className="text-base h-12 rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-zinc-500">
                <Search
                  size={20}
                  className="text-gray-500 dark:text-gray-400"
                />
                <Input
                  value={query}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuery(val);
                    debouncedSearch(val);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder="Start typing to search product"
                  className="text-base bg-transparent border-none outline-none flex-1 placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setFilteredItems(inventory);
                    }}
                  >
                    <X
                      size={18}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // ✅ prevent unintended form behavior
                    e.stopPropagation(); // ✅ stop event bubbling
                    setDropdownOpen((prev) => !prev);
                  }}
                >
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {dropdownOpen && (
                <div className="absolute w-full mt-2 z-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-80 overflow-y-auto transition-all animate-fade-in">
                  {(filteredItems?.length ?? 0) === 0 ? (
                    <div className="text-center text-sm text-gray-500 dark:text-zinc-400 py-3">
                      No products found.
                    </div>
                  ) : (
                    filteredItems.map((product) => {
                      const currentQty = quantities[product.itemId] || 1;
                      const exceedsStock = currentQty > product.quantity;

                      return (
                        <div
                          key={product.itemId}
                          className="p-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all"
                        >
                          <div className="flex items-center justify-between gap-2 px-2">
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 flex-1">
                              {product.name}
                            </span>

                            <div className="flex items-center gap-2">
                              <Minus
                                size={16}
                                className="bg-zinc-200 dark:bg-zinc-700 hover:border hover:border-red-400 rounded-full p-1 cursor-pointer"
                                onClick={() =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [product.itemId]: Math.max(
                                      (prev[product.itemId] || 1) - 1,
                                      0
                                    ),
                                  }))
                                }
                              />

                              <input
                                type="number"
                                value={currentQty}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [product.itemId]:
                                      isNaN(val) || val < 0 ? 0 : val,
                                  }));
                                }}
                                className={`w-12 text-xs text-center font-semibold border rounded-md bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 ${
                                  exceedsStock
                                    ? "border-red-500"
                                    : "border-zinc-300 dark:border-zinc-600"
                                }`}
                              />

                              <Plus
                                size={16}
                                className="bg-zinc-200 dark:bg-zinc-700 hover:bg-green-600 text-zinc-700 dark:text-zinc-300 rounded-full p-1 cursor-pointer"
                                onClick={() =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [product.itemId]:
                                      (prev[product.itemId] || 0) + 1,
                                  }))
                                }
                              />

                              <input
                                type="checkbox"
                                className="ml-2 w-4 h-4 accent-green-500"
                                onChange={(e) =>
                                  updateCart(product, e.target.checked)
                                }
                                checked={Boolean(cartState[product.itemId])}
                              />
                            </div>
                          </div>

                          {exceedsStock && (
                            <div className="mt-1 text-xs text-red-500 flex items-center gap-1 px-2">
                              <AlertTriangle size={14} />
                              Selected quantity exceeds stock (
                              {product.quantity})
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PickOrderField;
