import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import InvitationWrapper from "@/components/themes/invitation-wrapper"; // <--- Wrapper Logic
import { THEME_COMPONENTS, DefaultTheme } from "@/components/themes/registry"; // <--- Visual Registry
import { InvitationData } from "@/lib/types"; // <--- Type Definition

// Fungsi Fetch Data (Sama dengan halaman public utama)
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

  return data as InvitationData;
}

export default async function PersonalInvitationPage({
  params,
}: {
  params: Promise<{ slug: string; guest: string }>;
}) {
  const { slug, guest } = await params;

  // 1. Decode Nama Tamu (Mengubah %20 menjadi Spasi)
  // Contoh: Budi%20Santoso -> Budi Santoso
  const guestName = decodeURIComponent(guest);

  // 2. Ambil Data Database
  const invitation = await getInvitation(slug);

  if (!invitation) return notFound();

  // 3. Pilih Tema secara Dinamis
  // Cek apakah tema di database ada di Registry. Jika tidak, pakai Default.
  const ThemeComponent = THEME_COMPONENTS[invitation.theme] || DefaultTheme;

  // 4. Render Wrapper (Logic) membungkus Tema (Visual)
  // Kita kirim guestName ke Wrapper (untuk Sampul Depan)
  // DAN ke Tema (untuk teks "Kepada Yth..." di dalam jika diperlukan)
  return (
    <InvitationWrapper data={invitation} guestName={guestName}>
      <ThemeComponent data={invitation} guestName={guestName} />
    </InvitationWrapper>
  );
}
