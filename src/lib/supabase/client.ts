import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Pake env variable, kalau kosong baru pake fallback (buat safety)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}