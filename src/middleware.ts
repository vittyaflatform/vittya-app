import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // ✅ 1. INISIALISASI CLIENT
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

  // ✅ 2. ROUTE DEFINITIONS
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/scan");

  // Jika bukan halaman yang butuh proteksi (seperti homepage atau public invitation), langsung lewat.
  if (!isAuthPage && !isDashboard) {
    return supabaseResponse;
  }

  // ✅ 3. SECURITY CHECK
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // FIX LOGOUT LOOP:
  // Jika user tidak ada session tapi mencoba akses Dashboard, lempar ke Homepage (/).
  // Menggunakan "/" lebih aman daripada "/login" saat menggunakan Parallel Routes (@modal)
  // karena mencegah Next.js mencoba merender modal di atas halaman yang sedang di-redirect.
  if (!user && isDashboard) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Proteksi Halaman Login: Jika sudah login, paksa ke Dashboard.
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  // MATCHER: Filter semua asset statis agar tidak memicu middleware secara berlebihan.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
