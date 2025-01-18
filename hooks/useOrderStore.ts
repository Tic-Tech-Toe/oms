import { orders } from '@/data/orders';
import { OrderType } from '@/types/orderType';
import { create } from 'zustand';

interface OrderAppState{
    allOrders: OrderType[];
    loadAllOrders: () => Promise<void>;
    addOrder: (newOrder: OrderType) => Promise<{success: boolean}>;
}

export const useOrderStore = create<OrderAppState>((set) => ({
    allOrders: [],
    loadAllOrders: async () => {
        const fetchedOrders = await fetchAllOrders();
        set({allOrders: fetchedOrders})
    },
    addOrder: async (newOrder: OrderType) => {
        try{
            await new Promise((resolve) => setTimeout(resolve, 1000));
            set((state) => ({allOrders: [...state.allOrders, newOrder]}));
            return { success: true}
        } finally{}
    },
}));

async function fetchAllOrders(): Promise<OrderType[]>{
    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve(orders)
        },1200)
    })
}