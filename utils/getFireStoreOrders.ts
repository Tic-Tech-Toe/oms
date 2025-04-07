import { db } from "@/app/config/firebase";
import { OrderType } from "@/types/orderType";
import { collection, addDoc, getDocs } from "firebase/firestore";

// 🔁 Get all orders for a user
export const getOrders = async (userId: string): Promise<OrderType[]> => {
  try {
    const ordersRef = collection(db, "users", userId, "orders");
    const snapshot = await getDocs(ordersRef);

    const orders: OrderType[] = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id, // optional: helpful to store the Firestore doc ID
    })) as OrderType[];

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// ➕ Add a new order for a user
export const addOrder = async (
  userId: string,
  orderData: OrderType
): Promise<void> => {
  try {
    const ordersRef = collection(db, "users", userId, "orders");

    await addDoc(ordersRef, {
      ...orderData,
      // createdAt: serverTimestamp(), // optional
    });

    console.log("Order added successfully!");
  } catch (error: any) {
    console.error("Error adding order:", error.message, error.code, error);
    throw error;
  }
};
