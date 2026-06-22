"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Post = {
  id: string;
  shortcode: string;
  url: string;
  image: string | null;
};

export function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-smoke border border-border/50 animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }

  if (posts.length === 0 || !posts.some((p) => p.image)) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <a
            key={i}
            href="https://instagram.com/nortesurve"
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square bg-smoke border border-border rounded-sm overflow-hidden relative group cursor-pointer"
          >
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-paper/20">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span className="text-[9px] text-paper/20 font-mono uppercase tracking-[1.5px]">Instagram</span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 md:gap-1">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="aspect-square overflow-hidden relative group cursor-pointer"
        >
          {post.image ? (
            <Image
              src={post.image}
              alt={`Publicación de @nortesurve en Instagram`}
              referrerPolicy="no-referrer"
              loading="lazy"
              fill
              unoptimized
              className="object-cover group-hover:brightness-75 transition-all duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-smoke flex flex-col items-center justify-center gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-paper/20">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
          )}
        </a>
      ))}
    </div>
  );
}
