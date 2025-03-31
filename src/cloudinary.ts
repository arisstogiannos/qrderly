"use server"
import { v2 as cloudinary } from "cloudinary";

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
          tags: ["nextjs-server-actions-upload-sneakers"],
          folder: folder,
        },
        function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
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
