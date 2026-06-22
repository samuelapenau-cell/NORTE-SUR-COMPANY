import { NextResponse } from "next/server";

const POSTS = [
  { url: "https://www.instagram.com/p/DZ257y5nb0f/", shortcode: "DZ257y5nb0f" },
  { url: "https://www.instagram.com/p/DZlagyEnW0_/", shortcode: "DZlagyEnW0_" },
  { url: "https://www.instagram.com/p/DYdPSHEHfMk/", shortcode: "DYdPSHEHfMk" },
  { url: "https://www.instagram.com/p/DXU3U7iDgC7/", shortcode: "DXU3U7iDgC7" },
  { url: "https://www.instagram.com/p/DUrUJqCgXgQ/", shortcode: "DUrUJqCgXgQ" },
  { url: "https://www.instagram.com/p/DR0ao3sgVHc/", shortcode: "DR0ao3sgVHc" },
  { url: "https://www.instagram.com/p/DRaWkUiAdZd/", shortcode: "DRaWkUiAdZd" },
  { url: "https://www.instagram.com/p/DQNT4RSgY_z/", shortcode: "DQNT4RSgY_z" },
];

const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 86_400_000;

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 86400 },
    });
    const html = await res.text();
    const m = html.match(
      /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/
    );
    const m2 = html.match(
      /<meta[^>]+content="([^"]+)"[^>]+property="og:image"/
    );
    const raw = (m && m[1]) || (m2 && m2[1]) || null;
    return raw ? raw.replace(/&amp;/g, "&") : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const now = Date.now();
  const cached = cache.get("instagram-posts");
  if (cached && now < cached.expiry) {
    return NextResponse.json(cached.data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800", "X-Cache": "HIT" },
    });
  }

  const posts = await Promise.all(
    POSTS.map(async (post) => {
      const image = await fetchOgImage(post.url);
      const proxied =
        image?.startsWith("http")
          ? `/api/instagram/image?url=${encodeURIComponent(image)}`
          : null;
      return {
        id: post.shortcode,
        shortcode: post.shortcode,
        url: `https://instagram.com/p/${post.shortcode}/`,
        image: proxied,
      };
    })
  );

  const data = { posts };
  cache.set("instagram-posts", { data, expiry: now + CACHE_TTL });

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800" },
  });
}
