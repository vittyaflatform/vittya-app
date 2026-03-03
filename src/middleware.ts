import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // ✅ 1. INISIALISASI CLIENT SECARA EFISIEN
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const pathname = request.nextUrl.pathname;

  // ✅ 2. BYPASS OPTIMIZATION (Jalur Cepat Tamu Undangan)
  // Jika user cuma liat undangan publik (/invitation/slug), JANGAN panggil auth Supabase!
  const isPublicInvitation = pathname.startsWith("/invitation");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/scan");

  if (!isAuthPage && !isDashboard) {
    return supabaseResponse;
  }

  // ✅ 3. SECURITY CHECK (Hanya untuk Dashboard/Auth)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proteksi Dashboard
  if (!user && isDashboard) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Proteksi Halaman Login (Jika sudah login, jangan balik ke login lagi)
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  // ✅ MATCHER MAKSIMAL: Filter semua asset statis agar tidak memicu middleware
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
