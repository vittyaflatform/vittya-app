import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-[0_30px_80px_-24px_rgba(15,23,42,0.18)] sm:p-10">
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600">
          Privacy
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Kebijakan Privasi Vittya
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
          <p>
            Vittya menggunakan data seperti nama, email, dan nomor telepon hanya
            untuk kebutuhan akun, keamanan, dan pengalaman penggunaan layanan.
          </p>
          <p>
            Kami tidak menjual data pribadi Anda dan hanya memproses informasi
            sesuai kebutuhan operasional platform.
          </p>
          <p>
            Anda dapat menghubungi tim Vittya jika membutuhkan pembaruan atau
            penghapusan data sesuai kebijakan yang berlaku.
          </p>
        </div>
        <Link
          href="/register"
          className="mt-8 inline-flex font-bold text-emerald-600 underline underline-offset-4"
        >
          Kembali ke register
        </Link>
      </div>
    </main>
  );
}
