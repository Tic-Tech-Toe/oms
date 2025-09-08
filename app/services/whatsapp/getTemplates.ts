// app/services/whatsapp/templates.ts

export async function getTemplates() {
  const url = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/?fields=whatsapp_business_account`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_SECRET}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        templates: result.data, // Array of templates
      };
    } else {
      return {
        success: false,
        message: result.error?.message || "Failed to fetch templates",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Error fetching WhatsApp templates:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}
