import { db } from "@/app/config/firebase";
import { ItemType } from "@/types/orderType";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export const getItems = async (userId: string): Promise<ItemType[]> => {
  try {
    const inventoryRef = collection(db, "users", userId, "inventory");
    const snapshot = await getDocs(inventoryRef);

    const items: ItemType[] = snapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as ItemType[];

    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

export const addItem = async (
  userId: string,
  itemData: ItemType
): Promise<void> => {
  try {
    const inventoryRef = collection(db, "users", userId, "inventory");

    await addDoc(inventoryRef, {
      ...itemData,
      createdAt: serverTimestamp(),
    });

    //console.log("Item added successfully!");
  } catch (error: any) {
    console.error("Error adding item:", error.message, error.code, error);
    throw error;
  }
};
