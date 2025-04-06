import { db } from "@/app/config/firebase";
import { CustomerType } from "@/types/orderType";
import { addDoc, collection,  getDocs, serverTimestamp } from "firebase/firestore";

export const getCustomers = async (userId: string):Promise<CustomerType[]> => {
  try { 
    const customersRef = collection(db, "users",userId,"customers");
    const snapshot = await getDocs(customersRef);

    const customers: CustomerType[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
    })) as CustomerType[];
    
    return customers
  } catch (error) {
        console.error("Error fetching customers:", error);
    return [];
  }
}



export const addCustomer = async (
  userId: string,
  customerData?: CustomerType // make parameter optional for testing
): Promise<void> => {
  try {
    const customerRef = collection(db, "users", userId, "customers");

    // Use mock if no data provided
    const inputData = customerData;

    // Remove any undefined fields
    // const cleanedData = Object.fromEntries(
    //   Object.entries(inputData).filter(([_, v]) => v !== undefined)
    // );

    await addDoc(customerRef, {
      ...inputData
      // createdAt: serverTimestamp(),
    });

    console.log("Customer added successfully!");
  } catch (error: any) {
    console.error("Error adding customer:", error.message, error.code, error);
    throw error;
  }
};

