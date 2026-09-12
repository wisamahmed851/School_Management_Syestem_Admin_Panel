"use client";

import { useRef, useState } from "react";
import { cn } from "cn";

interface ImageUploadProps {
  /** Current value — a File chosen locally, or an existing URL string from the server, or null */
  value?: File | string | null;
  onChange: (file: File | null) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Preview */}
      {preview && (
        <div className="relative w-20 h-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-20 h-20 rounded-full object-cover border border-border"
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove image"
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* File input */}
      <label className="cursor-pointer">
        <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          {preview ? "Change image" : "Upload image"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}

export default ImageUpload;
