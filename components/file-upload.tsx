import React, { Dispatch, SetStateAction, Suspense, useState } from "react";

import { X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  //specifying endpoints as we accept files only 2 types of Images/files :
  // 1. Image for the Server Itself and
  // 2. PDF file for the  message
  // as described in the uploadthing config
  endpoint: "serverImage" | "messageFile";

  // prop drilling the state and setState because idk why but the onChange function
  // was causing multiple re-renders for this component if any component state was changed
  isImageLoading: boolean;
  setIsImageLoading: Dispatch<SetStateAction<boolean>>;
}

export default function FileUpload({
  endpoint,
  onChange,
  value,
  isImageLoading,
  setIsImageLoading,
}: FileUploadProps) {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    setIsImageLoading(true);
    return (
      <div className="relative h-20 w-20">
        {isImageLoading && <Skeleton className="w-full h-full rounded-full" />}
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full"
          onLoadingComplete={() => setIsImageLoading(false)}
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
    </div>
  );
}
