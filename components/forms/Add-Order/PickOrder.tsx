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
} from "lucide-react";
import { debounce } from "lodash";
import { useToast } from "@/hooks/use-toast";
import { useInventoryStore } from "@/hooks/zustand_stores/useInventoryStore";
import ShoppingBagDialog from "@/components/ShoppingBagDialog";
import { ItemType } from "@/types/orderType";

interface CartEntry {
  itemId: string;
  quantity: number;
  price: number;
  total: number;
  sku: string ;
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
  const updateCart = (product: ItemType, isChecked: boolean) => {
    setCartState((prev) => {
      const updated = { ...prev };
      if (isChecked) {
        const qty = quantities[product.itemId] || 1;
        updated[product.itemId] = {
          itemId: product.itemId,
          quantity: qty,
          price: product.price,
          total: product.price * qty,
          sku: product.sku || "",
          category: product.category || "",
          itemName: product.name,
        };
        toast({ title: `${product.name} added to cart.` });
      } else {
        delete updated[product.itemId];
        toast({ title: `${product.name} removed from cart.` });
      }
      setValue("items", Object.values(updated), { shouldDirty: true });
      return updated;
    });
  };

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
                    className={`text-gray-400 transition-transform \${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {dropdownOpen && (
                <div className="absolute w-full mt-2 z-20 bg-background border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {filteredItems.length === 0 ? (
                    <div className="text-center text-sm text-gray-500 py-3">
                      No products found.
                    </div>
                  ) : (
                    filteredItems.map((product) => {
                      const currentQty = quantities[product.itemId] || 1;
                      const exceedsStock = () => product.quantity;
                      return (
                        <div
                          key={product.itemId}
                          className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex-1 text-sm font-medium">
                              {product.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <Minus
                                size={16}
                                className="p-1 rounded-full cursor-pointer"
                                onClick={() =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [product.itemId]: Math.max(
                                      (prev[product.itemId] || 1) - 1,
                                      1
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
                                      isNaN(val) || val < 1 ? 1 : val,
                                  }));
                                }}
                                className="w-12 text-center border rounded"
                              />
                              <Plus
                                size={16}
                                className="p-1 rounded-full cursor-pointer "
                                onClick={() =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [product.itemId]:
                                      (prev[product.itemId] || 1) + 1,
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
                          {/* {exceedsStock() && (
                            <div className="mt-1 text-xs text-red-500 flex items-center gap-1">
                              <AlertTriangle size={14} />
                              Selected quantity exceeds stock (
                              {product.quantity})
                            </div>
                          )} */}
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
}

export default PickOrderField