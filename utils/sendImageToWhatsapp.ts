export async function sendImageToWhatsapp(file: File){
    const formData = new FormData();
    formData.append("file",file, file.name);
    formData.append("type","image");
    formData.append("messaging_product","whatsapp");

    try{
        const response = await fetch("https://graph.facebook.com/v21.0/506114192590854/media",{
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_API_SECRET}`,},
                body: formData,
        });
        const result = await response.json();
        if (!response.ok) {
            console.error("WhatsApp media upload error:", result);
            return {
              success: false,
              message: result?.error?.message || "Failed to upload image",
              status: response.status,
            };
          }
      
          return {
            success: true,
            message: "Image uploaded successfully",
            mediaId: result.id, 
          };
    }catch(err){
        console.error("Error uploading image to WhatsApp:", err);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
    }
}