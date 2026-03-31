import { z } from "zod";

export const isoDateStringSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid ISO date");

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal harus berformat YYYY-MM-DD");

export const whatsappSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[^\d+]/g, ""))
  .transform((value) => {
    if (value.startsWith("+")) return value;
    if (value.startsWith("0")) return `+62${value.slice(1)}`;
    if (value.startsWith("62")) return `+${value}`;
    return `+${value}`;
  })
  .refine((value) => /^\+[1-9]\d{8,14}$/.test(value), {
    message: "Nomor WhatsApp harus valid dalam format internasional",
  });

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    phone: whatsappSchema,
    email: z.email(),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak cocok",
  });

export const createProjectSchema = z.object({
  groom: z.string().trim().min(1).max(100),
  bride: z.string().trim().min(1).max(100),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
});

export const deleteProjectSchema = z.object({
  projectId: z.string().trim().min(1),
});

export const cloudinaryUploadSchema = z.object({
  invitationId: z.string().trim().min(1),
  assetType: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/i, "Kategori asset tidak valid"),
});

export const cloudinaryDeleteSchema = z.object({
  publicId: z.string().trim().min(1),
  resourceType: z.enum(["image", "video", "raw"]).default("image"),
});

export const aiDraftSchema = z.object({
  draft: z.string().trim().min(5).max(5000),
});

export const aiPromptSchema = z.object({
  prompt: z.string().trim().min(5).max(5000),
});

export interface InvitationData {
  id: string;
  slug: string;
  user_id: string;
  created_at: string;
  theme: string;
  views: number;
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
  akad_date: string;
  akad_start_time: string;
  akad_end_time?: string;
  akad_place: string;
  akad_address: string;
  akad_map_link: string;
  reception_date: string;
  reception_start_time: string;
  reception_end_time?: string;
  reception_place: string;
  reception_address: string;
  reception_map_link: string;
  music_url?: string;
  music_start?: number;
  music_end?: number;
  gallery_photos?: GalleryItem[];
  checkin_pin?: string;
}

export interface GalleryItem {
  id: string;
  photo_url: string;
  media_type?: "image" | "video";
  position?: number;
}

export interface ThemeProps {
  data: InvitationData;
  guestName?: string;
}

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

export interface Comment {
  id: string;
  invitation_id: string;
  name: string;
  message: string;
  attendance: "Hadir" | "Tidak Hadir" | "Masih Ragu" | string;
  created_at: string;
}

export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
