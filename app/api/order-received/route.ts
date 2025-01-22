// app/api/order-placed/route.ts
import { sendMessage } from '@/app/services/whatsapp/sendMsg';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Extract phoneNumber, order details, and messageBody from the request body
  const { phoneNumber, messageBody } = await req.json();

  // Validate the messageBody
  if (!messageBody || !Array.isArray(messageBody)) {
    return NextResponse.json(
      { success: false, message: 'messageBody is required and should be an array' },
      { status: 400 }
    );
  }

  // Define the template name for "order placed"
  const templateName = 'order_management_2'; // This template is for order placed notifications

  try {
    // Call the sendMessage function to send the WhatsApp message with the "order_management_2" template
    const response = await sendMessage(phoneNumber, messageBody, templateName);

    // Return the response based on success or failure
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error handling order-placed request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
