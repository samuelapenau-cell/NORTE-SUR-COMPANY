import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/perfil";

  if (code) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) =>
                request.cookies.set(name, value)
              );
            },
          },
        }
      );

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const response = NextResponse.redirect(`${origin}${next}`);
        request.cookies.getAll().forEach(({ name, value }) => {
          response.cookies.set(name, value);
        });
        return response;
      }

      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        `${origin}/ingresar?error=auth&msg=${encodeURIComponent(error.message)}`
      );
    } catch (err) {
      console.error("Auth callback exception:", err);
    }

    return NextResponse.redirect(`${origin}/ingresar?error=exception`);
  }

  return NextResponse.redirect(`${origin}/ingresar?error=no-code`);
}
