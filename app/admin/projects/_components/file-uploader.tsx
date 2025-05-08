"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
}

export function FileUploader({
  onFilesChange,
  multiple = false,
  maxFiles = 5,
  accept,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files];
      
      // Add only as many files as allowed by maxFiles
      for (let i = 0; i < acceptedFiles.length; i++) {
        if (newFiles.length < maxFiles) {
          newFiles.push(acceptedFiles[i]);
        } else {
          break;
        }
      }
      
      setFiles(newFiles);
      onFilesChange(newFiles);
    },
    [files, maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple,
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files here, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground">
            {multiple
              ? `Upload up to ${maxFiles} images`
              : "Upload a single image"}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files ({files.length}/{maxFiles})</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-md bg-muted"
              >
                <div className="h-10 w-10 rounded bg-background flex items-center justify-center">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-full w-full object-cover rounded"
                    />
                  ) : (
                    <FileImage className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}