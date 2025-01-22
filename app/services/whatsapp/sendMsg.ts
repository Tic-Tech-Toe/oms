// app/services/whatsapp/sendMessage.ts

// Function to send a WhatsApp message using a template
export async function sendMessage(
    phoneNumber: string,
    messageBody: string[],
    templateName: string
  ) {
    const url = 'https://graph.facebook.com/v21.0/506114192590854/messages';
  
    // Construct the message payload
    const data = JSON.stringify({
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'template',
      template: {
        name: templateName, // Dynamically set the template name
        language: {
          code: 'en_US', // Use English for the template
        },
        components: [
          {
            type: 'body', // Body component of the message
            parameters: messageBody.map((param: string) => ({
              type: 'text',
              text: param, // Convert each parameter to text format
            })),
          },
        ],
      },
    });
  
    try {
      // Make the POST request to send the message
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_SECRET}`, // Use API secret from environment variables
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: data, // Send the message body
      });
  
      // Parse the response
      const result = await response.json();
  
      // Check if the response is successful
      if (response.ok) {
        return {
          success: true,
          message: 'Message sent successfully',
        };
      } else {
        // Handle errors if the message sending fails
        return {
          success: false,
          message: result.error?.message || 'Failed to send message',
          status: response.status,
        };
      }
    } catch (error) {
      // Catch any unexpected errors during the request
      console.error('Error sending WhatsApp message:', error);
      return {
        success: false,
        message: 'Internal Server Error',
        status: 500,
      };
    }
  }

  export async function sendOrderArrivingMessage(phoneNumber: string, customerName: string, deliveryWindow: string) {
    const messageBody = [
        customerName,  // Customer's name
        deliveryWindow, // Delivery window (e.g., "1-5 PM")
    ];

    // Use the sendMessage function to send the message with the 'order_arriving' template
    return sendMessage(phoneNumber, messageBody, 'order_arriving');
}

export async function sendOrderProcessingMessage(
    phoneNumber: string,
    customerName: string,
    orderId: string,
    orderDate: string
  ) {
    const messageBody = [
      customerName, // Customer's name
      orderId,      // Order ID
      orderDate,    // Order date (e.g., "20th Jan 2025")
    ];
  
    // Use the sendMessage function to send the message with the 'order_processing' template
    return sendMessage(phoneNumber, messageBody, 'order_processing');
  }