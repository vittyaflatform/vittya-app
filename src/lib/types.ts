/*
  ==========================================
  VITTYA PLATFORM - TYPE DEFINITIONS (FINAL)
  ==========================================
  Fully merged & scalable
  Backward compatible
  Wedding SaaS ready
*/

//
// 1️⃣ INVITATION DATA (DATABASE MODEL)
//
export interface InvitationData {
  // ===== CORE =====
  id: string;
  slug: string;
  user_id: string;
  created_at: string; // ISO string
  theme: string;
  views: number;

  // ===== DATA MEMPELAI =====
  groom_name: string;
  groom_nickname?: string;
  groom_photo: string;
  groom_order?: string;
  groom_father?: string;
  groom_mother?: string;
  groom_ig?: string;
  groom_fb?: string;
  groom_x?: string;

  bride_name: string;
  bride_nickname?: string;
  bride_photo: string;
  bride_order?: string;
  bride_father?: string;
  bride_mother?: string;
  bride_ig?: string;
  bride_fb?: string;
  bride_x?: string;

  // ===== DATA ACARA - AKAD =====
  akad_date: string; // YYYY-MM-DD
  akad_start_time: string; // HH:mm
  akad_end_time?: string;
  akad_place: string;
  akad_address: string;
  akad_map_link: string;

  // ===== DATA ACARA - RESEPSI =====
  reception_date: string;
  reception_start_time: string;
  reception_end_time?: string;
  reception_place: string;
  reception_address: string;
  reception_map_link: string;

  // ===== AUDIO & MUSIK =====
  music_url?: string;
  music_start?: number;
  music_end?: number;

  // ===== GALERI (IMAGE + VIDEO SUPPORT) =====
  gallery_photos?: GalleryItem[];
  checkin_pin?: string; // Tambahkan ini
}

//
// 2️⃣ GALLERY ITEM (Reusable Type)
//
export interface GalleryItem {
  id: string;
  photo_url: string;
  media_type?: "image" | "video";
  position?: number;
}

//
// 3️⃣ THEME PROPS (Dipakai Semua Tema)
//
export interface ThemeProps {
  data: InvitationData;
  guestName?: string;
}

//
// 4️⃣ GUEST (Dashboard Tamu)
//
export interface Guest {
  id: string;
  invitation_id: string;
  name: string;
  category: "Reguler" | "VIP" | "Keluarga" | string;
  pax: number;
  status?: "pending" | "hadir" | "tidak_hadir";
  qr_token?: string;
  created_at: string;
}

//
// 5️⃣ COMMENT / GUEST BOOK
//
export interface Comment {
  id: string;
  invitation_id: string;
  name: string;
  message: string;
  attendance: "Hadir" | "Tidak Hadir" | "Masih Ragu" | string;
  created_at: string;
}
