import { create } from "zustand";
import { OrderType } from "@/types/orderType";
import {
  getOrders,
  addOrder as addOrderToFirestore,
  updateOrderInFirestore,
} from "@/utils/order/getFireStoreOrders";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/config/firebase";

interface OrderAppState {
  allOrders: OrderType[];
  selectedOrder: OrderType | null;
  isLoading: boolean;
  openEditDialog: boolean;

  setSelectedOrder: (order: OrderType | null) => void;
  setOpenEditDialog: (open: boolean) => void;

  loadAllOrders: (userId: string) => Promise<void>;
  addOrder: (userId: string, newOrder: Omit<OrderType, "id">) => Promise<{ success: boolean; orderId?: string }>;
  updateOrder: (userId: string, orderId: string, updatedFields: Partial<OrderType>) => Promise<void>;
  getOrdersByCustomerId: (customerId: string) => OrderType[];
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
      const orderId = await addOrderToFirestore(userId, newOrder);
      set((state) => ({
        allOrders: [...state.allOrders, { ...newOrder, id: orderId }],
      }));
      return { success: true, orderId };
    } catch (error) {
      console.error("Error adding order to Firestore:", error);
      return { success: false };
    }
  },

  updateOrder: async (orderId, updatedFields) => {
    const { allOrders } = get();
  
    const updatedOrders = allOrders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            ...updatedFields,
            payment: {
              ...(order.payment || {}),
              ...(updatedFields.payment || {}),
            },
            customer: {
              ...(order.customer || {}),
              ...(updatedFields.customer || {}),
            },
          }
        : order
    );
  
    set({ allOrders: updatedOrders }); // ✅ CORRECT TYPE now
  
    // Persist to Firestore
    const userId = updatedFields?.customer?.id || "default-user-id"; // Ideally pass real userId as param
    await updateOrderInFirestore(userId, orderId, updatedFields);
  },
  

  getOrdersByCustomerId: (customerId: string) => {
    return get().allOrders.filter((order) => order.customerId === customerId);
  },
}));

export const decreaseInventoryStock = async (
  userId: string,
  items: { itemId: string; quantity: number }[]
) => {
  const failedUpdates: string[] = [];

  for (const item of items) {
    const itemRef = doc(db, "users", userId, "inventory", item.itemId);
    const snapshot = await getDoc(itemRef);

    if (snapshot.exists()) {
      const currentQty = snapshot.data().quantity || 0;
      const newQty = Math.max(currentQty - item.quantity, 0);

      try {
        await updateDoc(itemRef, { quantity: newQty });
      } catch (err) {
        console.error(`Failed to update item ${item.itemId}:`, err);
        failedUpdates.push(item.itemId);
      }
    } else {
      console.warn(`Item ${item.itemId} not found in Firestore`);
      failedUpdates.push(item.itemId);
    }
  }

  return {
    success: failedUpdates.length === 0,
    failedItems: failedUpdates,
  };
};