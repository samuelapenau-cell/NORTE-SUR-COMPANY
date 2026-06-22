import { NextResponse } from "next/server";

const SHORTCODES = [
  "DZ257y5nb0f", "DZlagyEnW0_", "DYdPSHEHfMk", "DXU3U7iDgC7",
  "DUrUJqCgXgQ", "DR0ao3sgVHc", "DRaWkUiAdZd", "DQNT4RSgY_z",
];

const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 86_400_000;

async function fetchMediaUrl(shortcode: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.instagram.com/p/${shortcode}/media/?size=l`,
      {
        method: "GET",
        redirect: "manual",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (res.status === 302) {
      const location = res.headers.get("location");
      return location || null;
    }
    return null;
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

  const results = await Promise.allSettled(
    SHORTCODES.map(async (shortcode) => {
      const mediaUrl = await fetchMediaUrl(shortcode);
      const proxied = mediaUrl
        ? `/api/instagram/image?url=${encodeURIComponent(`https://www.instagram.com/p/${shortcode}/media/?size=l`)}`
        : null;
      return {
        id: shortcode,
        shortcode,
        url: `https://instagram.com/p/${shortcode}/`,
        image: proxied,
      };
    })
  );

  const posts = results
    .filter((r) => r.status === "fulfilled")
    .map((r: any) => r.value);

  const data = { posts };
  cache.set("instagram-posts", { data, expiry: now + CACHE_TTL });

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800" },
  });
}
