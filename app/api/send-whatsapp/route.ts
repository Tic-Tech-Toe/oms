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

  const url = 'https://graph.facebook.com/v21.0/506114192590854/messages';

  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    to: phoneNumber,
    type: 'template',
    template: {
      name: 'order_management_2',
      language: {
        code: 'en_US',
      },
      components: [
        {
          type: 'body',
          parameters: messageBody.map((param: string) => ({
            type: 'text',
            text: param,
          })),
        },
      ],
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: data,
    });

    const result = await response.json();

    // Check the response from the WhatsApp API
    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error?.message || 'Failed to send message' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
