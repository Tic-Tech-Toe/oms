import { create } from "zustand";
import { ItemType } from "@/types/orderType";
import {
  addItem as fbAddItem,
  getItems as fbGetItems,
  updateItem as fbUpdateItem,
  deleteItem as fbDeleteItem,
} from "@/utils/inventory/getFireStoreInventory";

interface InventoryAppState {
  inventory: ItemType[];
  isLoading: boolean;
  loadInventory: (userId: string) => Promise<void>;
  addItem: (userId: string, newItem: Omit<ItemType, "itemId">) => Promise<void>;
  updateItem: (userId: string, itemId: string, updatedFields: Partial<ItemType>) => Promise<void>;
  deleteItem: (userId: string, itemId: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryAppState>((set, get) => ({
  inventory: [],
  isLoading: false,

  loadInventory: async (userId) => {
    set({ isLoading: true });
    try {
      const items = await fbGetItems(userId);
      set({ inventory: items });
    } catch (err) {
      console.error("Failed to load inventory", err);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (userId, newItem) => {
    const itemId = await fbAddItem(userId, newItem);
    set((state) => ({
      inventory: [...state.inventory, { ...newItem, itemId }],
    }));
  },

  updateItem: async (userId, itemId, updatedFields) => {
    await fbUpdateItem(userId, itemId, updatedFields);
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.itemId === itemId ? { ...item, ...updatedFields } : item
      ),
    }));
  },

  deleteItem: async (userId, itemId) => {
    await fbDeleteItem(userId, itemId);
    set((state) => ({
      inventory: state.inventory.filter((item) => item.itemId !== itemId),
    }));
  },
}));
