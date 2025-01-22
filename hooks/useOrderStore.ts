import { create } from 'zustand';
import { orders } from '@/data/orders';
import { OrderType } from '@/types/orderType';

interface OrderAppState {
    allOrders: OrderType[];
    selectedOrder: OrderType | null;
    setSelectedOrder: (order: OrderType | null) => void;
    isLoading: boolean;
    openEditDialog: boolean;
    setOpenEditDialog: (open: boolean) => void;
    loadAllOrders: () => Promise<void>;
    addOrder: (newOrder: OrderType) => Promise<{ success: boolean }>;
    updateOrder: (orderId: string, updatedFields: Partial<OrderType>) => void;
}

export const useOrderStore = create<OrderAppState>((set) => ({
    allOrders: [],
    selectedOrder: null,
    setSelectedOrder: (order: OrderType | null) => { set({ selectedOrder: order }) },
    isLoading: false,
    openEditDialog: false,
    setOpenEditDialog: (open) => { set({ openEditDialog: open }) },
    loadAllOrders: async () => {
        console.log("Fetching orders..."); // Debugging line
        const fetchedOrders = await fetchAllOrders();
        console.log("Fetched orders:", fetchedOrders); // Debugging line
        set({ allOrders: fetchedOrders });
    },
    addOrder: async (newOrder: OrderType) => {
        try {
            console.log("Adding order:", newOrder); // Debugging line
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
            set((state) => ({ allOrders: [...state.allOrders, newOrder] }));
            return { success: true };
        } catch (error) {
            console.error("Error adding order:", error);
            return { success: false };
        }
    },
    updateOrder: (orderId: string, updatedFields: Partial<OrderType>) => {
        set((state) => {
            const updatedOrders = state.allOrders.map((order) =>
                order.id === orderId ? { ...order, ...updatedFields } : order
            );
            return { allOrders: updatedOrders };
        });
    },
}));

async function fetchAllOrders(): Promise<OrderType[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(orders); // Mock fetching from external source
        }, 1200);
    });
}
