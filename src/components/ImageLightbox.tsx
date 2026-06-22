"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ImageLightboxProps = {
  images: string[];
  initialIndex: number;
  productName: string;
  onClose: () => void;
};

export function ImageLightbox({ images, initialIndex, productName, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1));
      if (e.key === "ArrowRight") setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0));
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, images.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center text-offwhite/50 hover:text-offwhite transition-colors"
        aria-label="Cerrar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Counter */}
      <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-offwhite/30 tracking-[2px] uppercase z-10">
        {currentIndex + 1} / {images.length}
      </span>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1)); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-offwhite/30 hover:text-offwhite transition-colors"
          aria-label="Anterior"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0)); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-offwhite/30 hover:text-offwhite transition-colors"
          aria-label="Siguiente"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        ref={imgRef}
        className="relative w-full h-full max-w-[90vw] max-h-[85vh] cursor-crosshair select-none"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={() => setZoomed(!zoomed)}
        onMouseMove={handleMouseMove}
      >
        <div className={`relative w-full h-full transition-all duration-300 ${zoomed ? "scale-150" : "scale-100"}`}
          style={zoomed ? { transformOrigin: `${position.x}% ${position.y}%` } : undefined}
        >
          <Image
            src={images[currentIndex]}
            alt={`${productName} — ampliada`}
            fill
            className="object-contain"
            sizes="90vw"
            priority
            quality={90}
          />
        </div>
      </div>

      {/* Zoom hint */}
      <span className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[9px] font-mono text-offwhite/20 tracking-[2px] uppercase">
        {zoomed ? "Mové el mouse para explorar" : "Doble click para zoom"}
      </span>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-4 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
              className={`w-12 h-12 flex-shrink-0 overflow-hidden border-2 transition-all duration-200 ${
                i === currentIndex ? "border-gold opacity-100" : "border-transparent opacity-40 hover:opacity-70"
              }`}
            >
              <div className="relative w-full h-full">
                <Image src={img} alt="" fill className="object-cover" sizes="48px" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
