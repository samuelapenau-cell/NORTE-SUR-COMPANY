"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type ImageUploaderProps = {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
};

export function ImageUploader({ images, onImagesChange, maxImages = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onImagesChange([...images, data.url]);
      }
    } catch {
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((url, i) => (
          <div key={i} className="relative w-20 h-20 rounded-sm overflow-hidden border border-border group">
            <Image src={url} alt="Vista previa de imagen" width={80} height={80} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono uppercase tracking-[1px]"
            >
              Eliminar
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="w-20 h-20 rounded-sm border-2 border-dashed border-border hover:border-gold/50 transition-colors flex items-center justify-center cursor-pointer">
            {uploading ? (
              <span className="text-[10px] font-mono text-offwhite/40 animate-pulse">Subiendo...</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-offwhite/30">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>
      <p className="text-[10px] font-mono text-offwhite/30">
        JPG, PNG, WebP o AVIF. Max 5MB por imagen.
      </p>
    </div>
  );
}
