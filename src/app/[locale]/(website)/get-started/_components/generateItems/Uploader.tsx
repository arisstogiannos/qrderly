'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import Loader from '@/components/Loader';

export default function Uploader({
  fileType,
  placeholder,
  title,
  description,
  onUpload,
  uploadedFile,
  isUploading,
}: {
  fileType: string;
  placeholder: string;
  title: string;
  description: string;
  onUpload: (v: File[]) => Promise<void>;
  uploadedFile?: File;
  isUploading: boolean;
}) {
  const [previewImages, setPreviewImages] = useState<string[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to file input
  const hasFile = uploadedFile?.type.startsWith(fileType);
  const t = useTranslations('uploader');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles) {
      onUpload(selectedFiles);

      const images = selectedFiles.map((file) => URL.createObjectURL(file));

      if (selectedFiles[0].type.startsWith('image/')) {
        setPreviewImages(images);
      } else {
        setPreviewImages(null);
      }
    }
  };

  if (fileInputRef.current && !hasFile) {
    fileInputRef.current.value = '';
  }

  return (
    <div
      className={
        'flex flex-col gap-4 p-4 border-2 border-accent hover:border-primary/50  transition-all duration-300 rounded-lg shadow-md hover:shadow-xl'
      }
    >
      <div className="space-y-1 mb-2">
        <h3 className="text-xl font-medium capitalize">{title}</h3>
        <p className="max-w-md">{description}</p>
      </div>
      <label className="cursor-pointer relative overflow-hidden  mt-auto mx-auto flex flex-col items-center justify-center border-dashed border-2 border-primary/50 rounded-lg w-full xl:w-[400px] h-[250px] bg-accent/50 hover:bg-accent hover:border-primary transition-colors">
        {previewImages && hasFile ? (
          isUploading ? (
            <div className="size-full grid bg-accent animate-pulse flex-center">
              <Loader className="h-20" />
            </div>
          ) : (
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(previewImages.length))}, 1fr)`,
              }}
            >
              {previewImages.map((image, idx) => (
                <div key={idx} className="aspect-square w-full">
                  <Image
                    src={image}
                    alt={`Uploaded image ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    width={500}
                    height={500}
                  />
                </div>
              ))}
            </div>
          )
        ) : hasFile ? (
          isUploading ? (
            <div className="size-full grid bg-accent animate-pulse flex-center">
              <Loader className="h-20" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-gray-500 truncate max-w-xs">📄 {uploadedFile?.name}</span>
              <span className="text-xs text-gray-400">(PDF uploaded)</span>
            </div>
          )
        ) : (
          <div className=" flex flex-col items-center gap-4 ">
            <Image src={placeholder} quality={100} width={150} height={150} alt="placeholder" />
            <span className="text-gray-500">Click to upload {title}</span>
          </div>
        )}
        <input
          ref={fileInputRef} // Reference input field
          type="file"
          accept={fileType === 'image/' ? 'image/*' : 'application/pdf'}
          name={hasFile ? 'file' : ''}
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
