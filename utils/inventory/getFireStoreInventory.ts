import { db } from "@/app/config/firebase";
import { ItemType } from "@/types/orderType";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// Fetch all inventory items for a specific user
export const getItems = async (userId: string): Promise<ItemType[]> => {
  try {
    const inventoryRef = collection(db, "users", userId, "inventory");
    const snapshot = await getDocs(inventoryRef);

    const items: ItemType[] = snapshot.docs.map((doc) => ({
      ...(doc.data() as ItemType),
    }));

    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

// Add a new item to a user's inventory
export const addItem = async (
  userId: string,
  itemData: Omit<ItemType, "itemId">
): Promise<string> => {
  try {
    const inventoryRef = collection(db, "users", userId, "inventory");
    const newDocRef = doc(inventoryRef); // Auto-generates ID
    const itemId = newDocRef.id;

    await setDoc(newDocRef, {
      ...itemData,
      itemId,
      createdAt: serverTimestamp(),
    });

    return itemId;
  } catch (error: any) {
    console.error("Error adding item:", error.message, error.code);
    throw error;
  }
};

// Update an existing item in inventory
export const updateItem = async (
  userId: string,
  itemId: string,
  updatedFields: Partial<ItemType>
): Promise<void> => {
  try {
    const itemRef = doc(db, "users", userId, "inventory", itemId);
    await updateDoc(itemRef, updatedFields);
  } catch (error: any) {
    console.error("Error updating item:", error.message, error.code);
    throw error;
  }
};

// Delete an item from inventory
export const deleteItem = async (
  userId: string,
  itemId: string
): Promise<void> => {
  try {
    const itemRef = doc(db, "users", userId, "inventory", itemId);
    await deleteDoc(itemRef);
  } catch (error: any) {
    console.error("Error deleting item:", error.message, error.code);
    throw error;
  }
};
