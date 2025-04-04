"use client";

import Image from "next/image";
import { useRef, useState } from "react";

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
      <div className="space-y-1">
        <h3 className="text-xl font-medium capitalize">{title}</h3>
        <p className="max-w-md">{description}</p>
      </div>
      <label className="cursor-pointer mx-auto flex flex-col items-center justify-center border-dashed border-2 border-primary/50 rounded-lg w-full xl:w-[400] h-[250] bg-accent/50 hover:bg-accent hover:border-primary transition-colors">
        {preview && hasFile ? (
          <img
            src={preview}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : hasFile ? (
          <div className="flex flex-col items-center">
            <span className="text-gray-500">📄 {uploadedFile.name}</span>
            <span className="text-xs text-gray-400">(PDF uploaded)</span>
          </div>
        ) : (
          <div className=" flex flex-col items-center gap-4">
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
        <p className="text-sm text-gray-600">
          Selected file: <strong>{uploadedFile.name}</strong>
        </p>
      )}
    </div>
  );
}
