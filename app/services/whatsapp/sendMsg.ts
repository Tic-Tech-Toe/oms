// app/services/whatsapp/sendMsg.ts
export async function sendMessage(
  phoneNumber: string,
  messageBody: string[],
  templateName: string
) {
  const wtPhoneID = process.env.WHATSAPP_PHONE_ID;
  const url = `https://graph.facebook.com/v21.0/${wtPhoneID}/messages`;

  console.log("Template",templateName, "Phone : ", phoneNumber)
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


export async function sendPaymentReminderMsg(
  phoneNumber: string,
  customerName: string,
  amountDue: string,
  invoiceId: string,
  dueDate: string,
  paidAmount: string,
  totalAmount: string
) {
  const messageBody = [customerName, amountDue, invoiceId, dueDate, paidAmount, totalAmount];
  return sendMessage(phoneNumber, messageBody, "payment_reminder_3");
}

export async function sendPaymentReceived(
  phoneNumber: string,
  customerName: string,
  amount: string,
  orderId: string,
  earnedRewardPoint: string,
  newRewardPoint: string,
){
  const messageBody = [customerName, amount, orderId, earnedRewardPoint, newRewardPoint]
  return sendMessage(phoneNumber,messageBody,"payment_confirmation_2")
}


