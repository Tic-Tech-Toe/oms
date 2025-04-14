import { sendPaymentReminderMsg } from '@/app/services/whatsapp/sendMsg';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { phoneNumber, messageBody } = await req.json();

  // Validate the messageBody
  if (!messageBody || !Array.isArray(messageBody)) {
    return NextResponse.json(
      { success: false, message: 'messageBody is required and should be an array' },
      { status: 400 }
    );
  }

  try {
    const response = await sendPaymentReminderMsg(phoneNumber, ...(messageBody as [string, string, string, string, string, string]));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error handling payment-reminder request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
