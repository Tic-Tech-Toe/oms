// app/api/order-delivered/route.ts
import { sendMessage } from '@/app/services/whatsapp/sendMsg';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Extract phoneNumber, order details, and delivery info from the request body
  const { phoneNumber, orderId, customerName, totalAmount } = await req.json();

  // Validate the request data
  if (!phoneNumber || !orderId || !customerName || !totalAmount) {
    return NextResponse.json(
      { success: false, message: 'phoneNumber, orderId, customerName, and totalAmount are required' },
      { status: 400 }
    );
  }

  // Prepare the message body for the delivery confirmation template
  const messageBody = [
    customerName,     // Customer's name
    orderId,          // Order ID
    `$${totalAmount}`,// Total amount
  ];

  // Define the template name
  const templateName = 'delivery_confirmation_2'; // This template is for order delivered

  try {
    // Call the sendMessage function to send the WhatsApp message with the "delivery_confirmation_2" template
    const response = await sendMessage(phoneNumber, messageBody, templateName);

    // Return the response based on whether the message was sent successfully
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error handling order-delivered request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
