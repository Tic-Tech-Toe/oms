import { db } from "@/app/config/firebase";
import { OrderType } from "@/types/orderType";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

// 🔁 Get all orders for a user
export const getOrders = async (userId: string): Promise<OrderType[]> => {
  try {
    const ordersRef = collection(db, "users", userId, "orders");
    const snapshot = await getDocs(ordersRef);

    const orders: OrderType[] = snapshot.docs.map((docSnap) => ({
      ...(docSnap.data() as OrderType),
      id: docSnap.id, // ✅ Use Firestore doc ID
    }));

    return orders;
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return [];
  }
};

// 🔍 Get a single order by ID for a user
export const getOrderFromFirestore = async (
  userId: string,
  orderId: string
): Promise<OrderType | null> => {
  try {
    const orderRef = doc(db, "users", userId, "orders", orderId);
    const docSnap = await getDoc(orderRef);

    if (docSnap.exists()) {
      return {
        ...(docSnap.data() as OrderType),
        id: docSnap.id,
      };
    } else {
      console.log("❌ No such order found!");
      return null;
    }
  } catch (error) {
    console.error("🔥 Error fetching single order:", error);
    return null;
  }
};

// ➕ Add a new order for a user
export const addOrder = async (
  userId: string,
  orderData: Omit<OrderType, "id">
): Promise<string> => {
  try {
    const ordersRef = collection(db, "users", userId, "orders");

    const newDocRef = await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(), // 🕒 Firestore managed
      updatedAt: serverTimestamp(),
    });

    // console.log("✅ Order added with ID:", newDocRef.id);
    return newDocRef.id;
  } catch (error: any) {
    // console.error("🔥 Error adding order:", error.message, error.code, error);
    throw error;
  }
};

// 🔧 Update an existing order
export const updateOrderInFirestore = async (
  userId: string,
  orderId: string,
  updatedFields: Partial<OrderType>
): Promise<void> => {
  const orderRef = doc(db, "users", userId, "orders", orderId);

  try {
    await updateDoc(orderRef, {
      ...updatedFields,
      updatedAt: serverTimestamp(), // 🕒 Always update modified time
    });

    console.log("✅ Order updated in Firestore:", orderId);
  } catch (error) {
    console.error("🔥 Error updating order in Firestore:", error);
    throw error;
  }
};
