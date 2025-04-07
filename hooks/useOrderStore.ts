import { create } from "zustand";
import { OrderType } from "@/types/orderType";
import { getOrders , addOrder as addOrderToFirestore } from "@/utils/getFireStoreOrders";
// import { getOrders, addOrder as addOrderToFirestore } from 


interface OrderAppState {
  allOrders: OrderType[];
  selectedOrder: OrderType | null;
  isLoading: boolean;
  openEditDialog: boolean;

  setSelectedOrder: (order: OrderType | null) => void;
  setOpenEditDialog: (open: boolean) => void;

  loadAllOrders: (userId: string) => Promise<void>;
  addOrder: (userId: string, newOrder: OrderType) => Promise<{ success: boolean }>;
  updateOrder: (orderId: string, updatedFields: Partial<OrderType>) => void;
}

export const useOrderStore = create<OrderAppState>((set, get) => ({
  allOrders: [],
  selectedOrder: null,
  isLoading: false,
  openEditDialog: false,

  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setOpenEditDialog: (open) => set({ openEditDialog: open }),

  loadAllOrders: async (userId) => {
    set({ isLoading: true });
    try {
      const orders = await getOrders(userId);
      set({ allOrders: orders });
    } catch (error) {
      console.error("Error loading orders from Firestore:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addOrder: async (userId, newOrder) => {
    try {
      await addOrderToFirestore(userId, newOrder);
      set((state) => ({
        allOrders: [...state.allOrders, newOrder],
      }));
      return { success: true };
    } catch (error) {
      console.error("Error adding order to Firestore:", error);
      return { success: false };
    }
  },

  updateOrder: (orderId, updatedFields) => {
    set((state) => {
      const updatedOrders = state.allOrders.map((order) =>
        order.id === orderId ? { ...order, ...updatedFields } : order
      );
      return { allOrders: updatedOrders };
    });
    // Optional: Also sync changes to Firestore if needed
  },
}));
