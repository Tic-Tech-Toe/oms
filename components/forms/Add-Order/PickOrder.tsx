import { useEffect, useState, useCallback, useRef, ChangeEvent } from "react";
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
  Trash2,
} from "lucide-react";
import { debounce } from "lodash";
import { useToast } from "@/hooks/use-toast";
import { useInventoryStore } from "@/hooks/zustand_stores/useInventoryStore";
import ShoppingBagDialog from "@/components/ShoppingBagDialog";
import { ItemType } from "@/types/orderType";
import { motion, AnimatePresence } from "motion/react";
import { useCartStore } from "@/hooks/zustand_stores/useCartStateStore";
import { useCurrency } from "@/hooks/useCurrency";

interface CartEntry {
  itemId: string;
  quantity: number;
  price: number;
  total: number;
  sku: string;
  category: string;
  itemName: string;
}

interface PickOrderFieldProps {
  userId: string;
}

function PickOrderField({ userId }: PickOrderFieldProps) {
  const { inventory, loadInventory } = useInventoryStore();
  const {
    setValue,
    formState: { errors },
  } = useFormContext<{ items: CartEntry[] }>();

  const [query, setQuery] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<ItemType[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cartState, setCartState] = useState<Record<string, CartEntry>>({});
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  // Load inventory on mount or when userId changes
  useEffect(() => {
    void loadInventory(userId);
  }, [userId, loadInventory]);

  // Synchronize filteredItems when inventory or query changes
  useEffect(() => {
    setFilteredItems(
      query.trim()
        ? inventory.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        : inventory
    );
  }, [inventory, query]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilteredItems(
        value.trim()
          ? inventory.filter((item) =>
              item.name.toLowerCase().includes(value.toLowerCase())
            )
          : inventory
      );
    }, 300),
    [inventory]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add or remove item from cart
  const updateCart = useCallback(
    (product: ItemType, qty: number) => {
      setCartState((prev) => {
        const updated = { ...prev };

        if (qty > 0) {
          updated[product.itemId] = {
            itemId: product.itemId,
            quantity: qty,
            price: product.price,
            total: product.price * qty,
            sku: product.sku || "",
            category: product.category || "",
            itemName: product.name,
          };
        } else {
          delete updated[product.itemId];
        }

        setValue("items", Object.values(updated), { shouldDirty: true });
        return updated;
      });
    },
    [setValue]
  );

  const handleQtyChange = (product: ItemType, newQty: number) => {
    setQuantities((prev) => {
      const qty = Math.max(newQty, 0);
      const next = { ...prev, [product.itemId]: qty };
      updateCart(product, qty);
      return next;
    });
  };

  const clearCart = () => {
    setQuantities({});
    setCartState({});
    setValue("items", []);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  // Subtotal calculation
  const subtotal = Object.values(cartState).reduce(
    (acc, entry) => acc + entry.total,
    0
  );

  return (
    <FormField
      name="items"
      render={() => (
        <FormItem className="flex w-full flex-col mt-5">
          <FormLabel>
            <div className="flex justify-between items-center">
              <span>Pick Order</span>
              <ShoppingBagDialog
                cartState={cartState}
                setCartState={setCartState}
              />
            </div>
          </FormLabel>

          {/* Warnings if quantity exceeds stock */}
          {Object.entries(quantities).map(([itemId, qty]) => {
            const item = inventory.find((i) => i.itemId === itemId);
            if (!item || qty <= item.quantity) return null;
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
              <div className="text-base h-12 rounded-xl border px-4 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-zinc-500">
                <Search size={20} className="text-gray-500" />
                <Input
                  value={query}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setQuery(val);
                    debouncedSearch(val);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder="Start typing to search product"
                  className="bg-transparent border-none outline-none flex-1"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setFilteredItems(inventory);
                    }}
                  >
                    <X
                      size={18}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen((prev) => !prev);
                  }}
                >
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {dropdownOpen && (
                <div className="absolute w-full mt-2 z-20 bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {filteredItems.length === 0 ? (
                    <div className="text-center text-sm text-gray-500 py-3">
                      No products found.
                    </div>
                  ) : (
                    filteredItems.map((product) => {
                      const currentQty = quantities[product.itemId] || 0;

                      return (
                        <div
                          key={product.itemId}
                          className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition"
                        >
                          <div className="flex items-center justify-between gap-3">
                            {/* Product Info */}
                            <div className="flex flex-col flex-1">
                              <span className="text-sm font-medium">
                                {product.name}
                              </span>
                              <div className="text-xs text-gray-500">
                                {useCurrency(product.price)} · Stock: {product.quantity}
                              </div>
                              {currentQty > 0 && (
                                <div className="text-xs text-green-600 font-medium">
                                  Total: {useCurrency(product.price * currentQty)}
                                </div>
                              )}
                            </div>

                            <AnimatePresence mode="wait" initial={false}>
                              {currentQty === 0 ? (
                                <motion.button
                                  key="add-btn"
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.8, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  type="button"
                                  onClick={() => handleQtyChange(product, 1)}
                                  className="px-4 py-2 border-2 border-light-primary text-light-primary rounded-full text-sm font-semibold shadow-md hover:scale-105 transition-transform"
                                >
                                  Add +
                                </motion.button>
                              ) : (
                                <motion.div
                                  key="qty-controls"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.25 }}
                                  className="flex items-center gap-2"
                                >
                                  {/* Minus button */}
                                  <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() =>
                                      handleQtyChange(product, currentQty - 1)
                                    }
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition"
                                  >
                                    <Minus size={16} />
                                  </motion.button>

                                  {/* Quantity */}
                                  <motion.span
                                    key={`qty-${currentQty}`}
                                    initial={{ scale: 0.6, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.6, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-6 text-center text-sm font-semibold"
                                  >
                                    {currentQty}
                                  </motion.span>

                                  {/* Plus button */}
                                  <motion.button
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() =>
                                      handleQtyChange(product, currentQty + 1)
                                    }
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition"
                                  >
                                    <Plus size={16} />
                                  </motion.button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </FormControl>

          {/* Sticky mini-cart summary */}
          {Object.keys(cartState).length > 0 && (
            <div className="mt-4 border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">
                  {Object.keys(cartState).length} items
                </span>{" "}
                · Subtotal:{" "}
                <span className="font-semibold text-light-primary">
                  ₹{subtotal}
                </span>
              </div>
              <button
                type="button"
                onClick={clearCart}
                className="flex items-center gap-1 text-xs px-2 py-1 border border-red-400 text-red-600 rounded-md hover:bg-red-50"
              >
                <Trash2 size={14} /> Clear All
              </button>
            </div>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default PickOrderField;
