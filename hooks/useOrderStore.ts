import { create } from "zustand";
import { orders } from "@/data/orders";
import { OrderType } from "@/types/orderType";

interface OrderAppState {
  allOrders: OrderType[];
  selectedOrder: OrderType | null;
  isLoading: boolean;
  openEditDialog: boolean;
  
  setSelectedOrder: (order: OrderType | null) => void;
  setOpenEditDialog: (open: boolean) => void;
  
  loadAllOrders: () => Promise<void>;
  addOrder: (newOrder: OrderType) => Promise<{ success: boolean }>;
  updateOrder: (orderId: string, updatedFields: Partial<OrderType>) => void;
}

export const useOrderStore = create<OrderAppState>((set, get) => ({
  allOrders: [],
  selectedOrder: null,
  isLoading: false,
  openEditDialog: false,

  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setOpenEditDialog: (open) => set({ openEditDialog: open }),

  loadAllOrders: async () => {
    if (get().isLoading || get().allOrders.length > 0) return; // Prevent redundant fetching
    
    set({ isLoading: true });
    console.log("Fetching orders...");

    try {
      const fetchedOrders = await new Promise<OrderType[]>((resolve) => 
        setTimeout(() => resolve(orders), 1200) // Simulating API fetch
      );

      console.log("Fetched orders:", fetchedOrders);
      set({ allOrders: fetchedOrders });
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addOrder: async (newOrder) => {
    try {
      console.log("Adding order:", newOrder);
      set((state) => ({ allOrders: [...state.allOrders, newOrder] }));
      return { success: true };
    } catch (error) {
      console.error("Error adding order:", error);
      return { success: false };
    }
  },

  updateOrder: (orderId, updatedFields) => {
    set((state) => ({
      allOrders: state.allOrders.map((order) =>
        order.id === orderId ? { ...order, ...updatedFields } : order
      ),
    }));
  },
}));
