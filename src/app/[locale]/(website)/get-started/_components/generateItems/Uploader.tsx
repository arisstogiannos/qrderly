"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function Uploader({
  fileType,
  placeholder,
  title,
  description,
  onUpload,
  uploadedFile,
}: {
  fileType: string;
  placeholder: string;
  title: string;
  description: string;
  onUpload: (v: File) => void;
  uploadedFile?: File;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to file input
  const hasFile = uploadedFile && uploadedFile.type.startsWith(fileType);
  const t = useTranslations("uploader");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onUpload(selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    }
  };

  if (fileInputRef.current && !hasFile) {
    fileInputRef.current.value = "";
  }

  return (
    <div
      className={`flex flex-col gap-4 p-4 border-2 border-accent hover:border-primary/50  transition-all duration-300 rounded-lg shadow-md hover:shadow-xl`}
    >
      <div className="space-y-1 mb-2">
        <h3 className="text-xl font-medium capitalize">{title}</h3>
        <p className="max-w-md">{description}</p>
      </div>
      <label className="cursor-pointer relative overflow-hidden  mt-auto mx-auto flex flex-col items-center justify-center border-dashed border-2 border-primary/50 rounded-lg w-full xl:w-[400px] h-[250px] bg-accent/50 hover:bg-accent hover:border-primary transition-colors">
        {preview && hasFile ? (

          <Image
            width={200}
            height={200}
            src={preview}
            alt="Uploaded image"
            className="w-full h-full object-cover rounded-lg   absolute inset-0"
            />
        ) : hasFile ? (
          <div className="flex flex-col items-center">
            <span className="text-gray-500 truncate max-w-xs">📄 {uploadedFile.name}</span>
            <span className="text-xs text-gray-400">(PDF uploaded)</span>
          </div>
        ) : (
          <div className=" flex flex-col items-center gap-4 ">
            <Image
              src={placeholder}
              quality={100}
              width={150}
              height={150}
              alt="placeholder"
            />
            <span className="text-gray-500">Click to upload {title}</span>
          </div>
        )}
        <input
          ref={fileInputRef} // Reference input field
          type="file"
          accept={fileType}
          name={hasFile ? "file" : ""}
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {hasFile && (
        <p className="text-sm text-gray-600 truncate max-w-64">
          Selected file: <strong>{uploadedFile.name}</strong>
        </p>
      )}
    </div>
  );
}
