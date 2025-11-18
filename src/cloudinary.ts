'use server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(image: File, folder: string) {
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const w = (await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          tags: [folder],
          folder: folder,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        },
      )
      .end(buffer);
  })) as any;
  return w;
}

export async function deleteImage(imagePath: string) {
  await new Promise((resolve, reject) => {
    cloudinary.uploader
      .destroy(imagePath, { invalidate: true })
      .then(resolve)
      .catch((reject) => console.error(reject));
  });
}
export async function getImage(imagePath: string) {
  const image = await cloudinary.api.resources_by_asset_ids('7d24a5f063d5c30b4e6fed5263a3dc4e');

  return image;
}
export async function getImageBlob(publicId: string) {
  try {
    // Step 1: Retrieve the image URL from Cloudinary
    const imageUrl = cloudinary.url(publicId, { secure: true });

    // Step 2: Download the image data
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    // Step 3: Convert the ArrayBuffer to a Blob
    const blob = new Blob([arrayBuffer], {
      type: response.headers.get('content-type') ?? undefined,
    });

    return blob;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}
