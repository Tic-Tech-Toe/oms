import { create } from "zustand";
import { OrderType } from "@/types/orderType";
import {
  getOrders,
  addOrder as addOrderToFirestore,
  updateOrderInFirestore,
} from "@/utils/order/getFireStoreOrders";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/config/firebase";

// ==============================
// OrderAppState Interface
// ==============================
interface OrderAppState {
  allOrders: OrderType[];                        // All orders loaded from Firestore
  selectedOrder: OrderType | null;              // Currently selected order for viewing/editing
  tempOrderData: OrderType | null;              // 🆕 Temporary order data before confirmation
  isLoading: boolean;                           // Loading state for async operations
  openEditDialog: boolean;                      // Controls edit modal/dialog visibility

  setSelectedOrder: (order: OrderType | null) => void;
  setTempOrderData: (order: OrderType | null) => void; // 🆕 Setter for temp order
  setOpenEditDialog: (open: boolean) => void;

  loadAllOrders: (userId: string) => Promise<void>;
  addOrder: (
    userId: string,
    newOrder: Omit<OrderType, "id">
  ) => Promise<{ success: boolean; orderId?: string }>;
  updateOrder: (
    userId: string,
    orderId: string,
    updatedFields: Partial<OrderType>
  ) => Promise<void>;
  getOrdersByCustomerId: (customerId: string) => OrderType[];

  storeStatusChange: (orderId: string, newStatus: string) => void;
}

// ==============================
// useOrderStore Implementation
// ==============================
export const useOrderStore = create<OrderAppState>((set, get) => ({
  allOrders: [],
  selectedOrder: null,
  tempOrderData: null,               // 🆕 Initialize tempOrderData
  isLoading: false,
  openEditDialog: false,

  // Sets selected order (used in order editing / preview)
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  // 🆕 Sets temporary order (used during creation flow before final confirmation)
  setTempOrderData: (order) => set({ tempOrderData: order }),

  // Controls dialog/modal visibility for editing
  setOpenEditDialog: (open) => set({ openEditDialog: open }),

  // Loads all orders from Firestore for a specific user
  loadAllOrders: async (userId) => {
    set({ isLoading: true });
    try {
      const orders = await getOrders(userId);
      set({ allOrders: orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({ allOrders: [], isLoading: false });
    }
    set({ isLoading: false });
  },

  // Adds a new order to Firestore
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

  // Updates existing order (in store + Firestore)
  updateOrder: async (userId, orderId, updatedFields) => {
    const { allOrders } = get();

    // Locally update the order in state
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

    set({ allOrders: updatedOrders });

    // Sync changes to Firestore
    try {
      await updateOrderInFirestore(userId, orderId, updatedFields);
      console.log("✅ Firestore order update complete");
    } catch (error) {
      console.error("🔥 Failed to update order in Firestore:", error);
    }
  },

  // Filter orders by a customer ID
  getOrdersByCustomerId: (customerId: string) => {
    return get().allOrders.filter((order) => order.customerId === customerId);
  },

  // Change order status (locally only, optionally sync externally if needed)
  storeStatusChange: (orderId, newStatus) => {
    const { allOrders } = get();
    const updatedOrders = allOrders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    set({ allOrders: updatedOrders });
  },
}));

// ==============================
// 🔻 Inventory Stock Decrease Helper
// ==============================
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
