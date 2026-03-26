import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-[0_30px_80px_-24px_rgba(15,23,42,0.18)] sm:p-10">
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600">
          Terms
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Syarat & Ketentuan Vittya
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
          <p>
            Dengan membuat akun, Anda setuju menggunakan platform Vittya secara
            sah, menjaga keamanan akun, dan memberikan data yang benar.
          </p>
          <p>
            Anda bertanggung jawab atas aktivitas pada akun Anda dan wajib
            menjaga kerahasiaan kredensial login.
          </p>
          <p>
            Vittya dapat memperbarui fitur, kebijakan, atau akses layanan untuk
            menjaga kualitas dan keamanan sistem.
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
