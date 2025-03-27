import { auth, db } from "@/app/config/firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";


// Function to fetch WhatsApp API secret using the authenticated user's email
// async function getWhatsAppSecretByEmail(): Promise<string | null> {
//   try {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     console.log(user)

//     if (!user) {
//       console.error("No authenticated user found.");
//       return null;
//     }

//     const email = user.email;
//     // console.log(email)
//     if (!email) {
//       console.error("User email not found.");
//       return null;
//     }

//     // Query Firestore to find user document by email
//     const usersRef = collection(db, "users");
//     const q = query(usersRef, where("email", "==", email));
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       const userDoc = querySnapshot.docs[0]; // Assume there's only one matching user
//       console.log(userDoc)
//       return userDoc.data().whatsappSecret || null;
//     } else {
//       console.error("User document not found in Firestore.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching WhatsApp secret:", error);
//     return null;
//   }
// }

// async function getWhatsAppSecretByEmail(): Promise<string | null> {
//   try {
//     console.log("Checking authentication state...");
//     console.log("Auth instance:", auth);

//     const user = auth.currentUser;
//     console.log("Current user:", user);

//     if (!user) {
//       console.error("No authenticated user found.");
//       return null;
//     }

//     const email = user.email;
//     console.log("Authenticated user's email:", email);

//     if (!email) {
//       console.error("User email not found.");
//       return null;
//     }

//     // Query Firestore for user document
//     const usersRef = collection(db, "users");
//     const q = query(usersRef, where("email", "==", email));
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       const userDoc = querySnapshot.docs[0];
//       console.log("Firestore user document:", userDoc.data());
//       return userDoc.data().whatsappSecret || null;
//     } else {
//       console.error("User document not found in Firestore.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching WhatsApp secret:", error);
//     return null;
//   }
// }


// Function to send a WhatsApp message using a template
export async function sendMessage(
  phoneNumber: string,
  messageBody: string[],
  templateName: string
) {
  const url = "https://graph.facebook.com/v21.0/506114192590854/messages";

  // Step 1: Fetch the WhatsApp API secret from Firestore
  // const whatsappSecret = await getWhatsAppSecretByEmail();
  // console.log(whatsappSecret)
  // if (!whatsappSecret) {
  //   return {
  //     success: false,
  //     message: "WhatsApp API secret not found.",
  //     status: 401,
  //   };
  // }

  // Construct the message payload
  const data = JSON.stringify({
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "template",
    template: {
      name: templateName,
      language: { code: "en_US" },
      components: [
        {
          type: "body",
          parameters: messageBody.map((param) => ({
            type: "text",
            text: param,
          })),
        },
      ],
    },
  });

  try {
    // Make the POST request to send the message
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_SECRET}`, // 🔥 Use the fetched secret
        "Content-Type": "application/json",
      },
      body: data,
    });

    // Parse the response
    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Message sent successfully",
      };
    } else {
      return {
        success: false,
        message: result.error?.message || "Failed to send message",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

// 🔥 Updated order-related message functions
export async function sendOrderArrivingMessage(
  phoneNumber: string,
  customerName: string,
  deliveryWindow: string
) {
  const messageBody = [customerName, deliveryWindow];

  return sendMessage(phoneNumber, messageBody, "order_arriving");
}

export async function sendOrderProcessingMessage(
  phoneNumber: string,
  customerName: string,
  orderId: string,
  orderDate: string
) {
  const messageBody = [customerName, orderId, orderDate];

  return sendMessage(phoneNumber, messageBody, "order_processing");
}
