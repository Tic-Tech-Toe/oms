import { create } from "zustand";

interface CartEntry {
  itemId: string;
  quantity: number;
  price: number;
  total: number;
  sku: string;
  category: string;
  itemName: string;
}

interface CartState {
  cart: Record<string, CartEntry>;
  addToCart: (item: CartEntry) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  subtotal: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: {},

  addToCart: (item) =>
    set((state) => ({
      cart: { ...state.cart, [item.itemId]: item },
    })),

  updateQuantity: (itemId, qty) =>
    set((state) => {
      const existing = state.cart[itemId];
      if (!existing) return state;

      if (qty <= 0) {
        const { [itemId]: _, ...rest } = state.cart;
        return { cart: rest };
      }

      return {
        cart: {
          ...state.cart,
          [itemId]: {
            ...existing,
            quantity: qty,
            total: existing.price * qty,
          },
        },
      };
    }),

  removeFromCart: (itemId) =>
    set((state) => {
      const { [itemId]: _, ...rest } = state.cart;
      return { cart: rest };
    }),

  clearCart: () => set({ cart: {} }),

  get subtotal() {
    return Object.values(get().cart).reduce((acc, entry) => acc + entry.total, 0);
  },
}));
