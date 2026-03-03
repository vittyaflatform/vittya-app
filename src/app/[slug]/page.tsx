import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import InvitationWrapper from "@/components/themes/invitation-wrapper"; // <--- Wrapper Logic (Musik/Modal)
import { THEME_COMPONENTS, DefaultTheme } from "@/components/themes/registry"; // <--- Visual Registry
import { InvitationData } from "@/lib/types"; // <--- Type Definition

// Fungsi Fetch Data dari Supabase
async function getInvitation(slug: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );

  // FETCH DATA LENGKAP
  // Kita ambil semua kolom (*) plus relasi ke gallery_photos
  const { data } = await supabase
    .from("invitations")
    .select(
      `
      *, 
      gallery_photos(photo_url)
    `,
    )
    .eq("slug", slug)
    .single();

  return data as InvitationData; // Casting ke tipe data kita biar aman
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Ambil Data
  const invitation = await getInvitation(slug);

  // 2. Kalau slug salah/tidak ketemu, return 404
  if (!invitation) return notFound();

  // 3. Pilih Tema secara Dinamis
  // Cek apakah nama tema di database (misal: 'rustic') ada di Registry.
  // Kalau tidak ada, pakai DefaultTheme (Luxury).
  const ThemeComponent = THEME_COMPONENTS[invitation.theme] || DefaultTheme;

  // 4. Render
  // Bungkus Visual (ThemeComponent) dengan Logic (InvitationWrapper)
  // Karena ini halaman publik umum, guestName kita biarkan undefined.
  return (
    <InvitationWrapper data={invitation}>
      <ThemeComponent data={invitation} />
    </InvitationWrapper>
  );
}
