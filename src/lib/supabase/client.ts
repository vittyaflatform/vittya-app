import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // KITA HARDCODE SEMENTARA BUAT TES
  const url = "https://hvxmxcvoozefolmnwned.supabase.co";
  const key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2eG14Y3Zvb3plZm9sbW53bmVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0OTQwMzcsImV4cCI6MjA4NDA3MDAzN30.rscV7zZ_eMsqSds7W9n5-8FbcPBWDhqxmh-kQ5FCQBk";

  return createBrowserClient(url, key);
}
