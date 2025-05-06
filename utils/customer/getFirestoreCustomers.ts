import { db } from "@/app/config/firebase";
import { CustomerType } from "@/types/orderType";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

// ✅ include document ID
export const getCustomers = async (
  userId: string
): Promise<CustomerType[]> => {
  try {
    const customersRef = collection(db, "users", userId, "customers");
    const snapshot = await getDocs(customersRef);

    const customers: CustomerType[] = snapshot.docs.map((docSnap) => ({
      ...(docSnap.data() as CustomerType),
      id: docSnap.id,
    }));

    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

export const addCustomer = async (
  userId: string,
  customerData: CustomerType
): Promise<string> => {
  try {
    const customerRef = collection(db, "users", userId, "customers");

    // 1. Add customer without id
    const docRef = await addDoc(customerRef, customerData);

    // 2. Immediately update it with the generated ID
    await updateDoc(docRef, { id: docRef.id });

    return docRef.id;
  } catch (error: any) {
    console.error("Error adding customer:", error.message, error.code, error);
    throw error;
  }
};


export const updateCustomer = async (
  userId: string,
  customerId: string,
  updatedFields: Partial<CustomerType>
): Promise<void> => {
  try {
    const customerDoc = doc(db, "users", userId, "customers", customerId);
    await updateDoc(customerDoc, updatedFields);
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const deleteCustomer = async (
  userId: string,
  customerId: string
): Promise<void> => {
  try {
    const customerDoc = doc(db, "users", userId, "customers", customerId);
    await deleteDoc(customerDoc);
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

export const getCustomerById = async (
  userId: string,
  customerId: string
): Promise<CustomerType | null> => {
  try {
    const customerDoc = doc(db, "users", userId, "customers", customerId);
    const snapshot = await getDoc(customerDoc);
    if (snapshot.exists()) {
      return { ...(snapshot.data() as CustomerType), id: snapshot.id };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    return null;
  }
};
