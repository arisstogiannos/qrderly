export async function uploadImageClientSide(file: File, folder = "uploaded-menus") {
    const sigRes = await fetch("/api/cloudinary-signature");
    const { signature, timestamp, apiKey, cloudName } = await sigRes.json();
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);
  
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    return data.public_id as string;
  }