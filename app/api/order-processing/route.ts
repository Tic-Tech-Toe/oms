import { sendMessage } from '@/app/services/whatsapp/sendMsg';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phoneNumber, customerName, orderId, orderDate } = await request.json();

    if (!phoneNumber || !customerName || !orderId || !orderDate) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Define the template name and message body for the order_processing template
    const templateName = 'order_processing';
    const messageBody = [customerName, orderId, orderDate]; // Pass dynamic data to the template

    // Send the WhatsApp message
    const result = await sendMessage(phoneNumber, messageBody , templateName) ;

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } else {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to send message' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending order processing message:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
