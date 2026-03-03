import dynamic from "next/dynamic";
import { ThemeProps } from "@/lib/types";

// Import Dynamic (Lazy Load)
const LuxuryGold = dynamic(() => import("./luxury-gold"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      Loading Theme...
    </div>
  ),
});
const MinimalistWhite = dynamic(() => import("./minimalist-white"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      Loading Theme...
    </div>
  ),
});

// Mapping Nama Tema (Database) -> Komponen (Frontend)
// Pastikan kuncinya huruf kecil semua (lowercase)
export const THEME_COMPONENTS: Record<
  string,
  React.ComponentType<ThemeProps>
> = {
  luxury: LuxuryGold,
  minimalist: MinimalistWhite,
  // Tambah tema lain di sini nanti
};

// Tema Default jika nama tema di database ngaco/kosong
export const DefaultTheme = LuxuryGold;
