import Link from "next/link";

const sections = [
  {
    title: "1. Data yang Kami Kumpulkan",
    body: "Vittya dapat mengumpulkan data identitas dan kontak seperti nama, alamat email, nomor WhatsApp, informasi akun, data transaksi, serta konten yang Anda unggah ke dalam layanan, termasuk data undangan, foto, tamu, RSVP, dan metadata penggunaan sistem.",
  },
  {
    title: "2. Tujuan Pemrosesan Data",
    body: "Data pribadi diproses untuk keperluan pembuatan dan pengelolaan akun, penyediaan layanan digital wedding, verifikasi transaksi, dukungan pelanggan, peningkatan performa sistem, keamanan layanan, pencegahan penyalahgunaan, serta pemenuhan kewajiban hukum dan kepatuhan pembayaran.",
  },
  {
    title: "3. Dasar Penggunaan Data",
    body: "Kami menggunakan data Anda berdasarkan persetujuan yang Anda berikan, pelaksanaan kontrak layanan digital yang Anda beli atau gunakan, kepentingan sah untuk menjaga keamanan dan kualitas platform, serta kewajiban hukum yang berlaku di Republik Indonesia.",
  },
  {
    title: "4. Pembayaran dan Mitra Pemrosesan",
    body: "Untuk pemrosesan pembayaran, Vittya dapat bekerja sama dengan penyedia pembayaran resmi seperti Midtrans atau mitra lain yang relevan. Data yang diperlukan untuk verifikasi transaksi hanya akan dibagikan sejauh dibutuhkan untuk memproses pembayaran, mencegah fraud, menyelesaikan sengketa, dan memenuhi kewajiban kepatuhan.",
  },
  {
    title: "5. Penyimpanan dan Retensi Data",
    body: "Data disimpan selama akun Anda aktif, selama layanan masih digunakan, atau selama dibutuhkan untuk tujuan operasional, pembuktian transaksi, penyelesaian sengketa, audit, dan kewajiban hukum. Setelah tidak lagi diperlukan, data akan dihapus, dianonimkan, atau disimpan secara terbatas sesuai kebutuhan hukum dan keamanan.",
  },
  {
    title: "6. Keamanan Informasi",
    body: "Vittya menerapkan langkah teknis dan administratif yang wajar untuk melindungi data dari akses tidak sah, perubahan, pengungkapan, atau penghancuran yang tidak sah. Meskipun demikian, tidak ada sistem elektronik yang sepenuhnya bebas risiko, sehingga Pengguna juga wajib menjaga kerahasiaan akses akun masing-masing.",
  },
  {
    title: "7. Hak Pengguna",
    body: "Sejauh diizinkan oleh hukum, Anda dapat mengajukan permintaan untuk mengakses, memperbarui, memperbaiki, atau menghapus data pribadi tertentu, serta menarik persetujuan atas pemrosesan tertentu. Permintaan akan diproses sesuai kewajiban hukum, batasan teknis, dan kebutuhan pembuktian transaksi yang sah.",
  },
  {
    title: "8. Cookies dan Data Teknis",
    body: "Vittya dapat menggunakan cookies, local storage, log server, dan teknologi serupa untuk menjaga sesi login, menganalisis performa, mengingat preferensi tampilan, serta membantu deteksi aktivitas mencurigakan dan debugging operasional.",
  },
  {
    title: "9. Pengungkapan kepada Pihak Ketiga",
    body: "Kami tidak menjual data pribadi Anda. Pengungkapan hanya dilakukan apabila diperlukan untuk penyediaan layanan, pemrosesan pembayaran, integrasi teknis, dukungan infrastruktur, pemenuhan hukum, proses penegakan hak, atau ketika diwajibkan oleh otoritas yang berwenang.",
  },
  {
    title: "10. Transfer dan Penyimpanan Lintas Sistem",
    body: "Dalam penyediaan layanan digital, data dapat diproses melalui infrastruktur cloud atau penyedia layanan pihak ketiga yang memiliki standar operasional keamanan yang wajar. Dengan menggunakan layanan Vittya, Anda memahami bahwa pemrosesan tersebut dapat diperlukan untuk menjalankan fitur platform secara efektif.",
  },
  {
    title: "11. Perubahan Kebijakan Privasi",
    body: "Vittya dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk mencerminkan perubahan layanan, teknologi, mitra pemrosesan, maupun kewajiban hukum. Versi terbaru akan selalu dipublikasikan pada halaman ini dan berlaku sejak tanggal pembaruan dicantumkan.",
  },
];

export default function PrivacyPage() {
  const lastUpdated = "2 April 2026";

  return (
    <main className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[2rem] border border-emerald-100/70 bg-white shadow-[0_35px_90px_-30px_rgba(15,23,42,0.22)]">
          <div className="border-b border-slate-100 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-8 text-white sm:px-10 sm:py-10">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-emerald-400">
              Privacy & Data Protection
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Kebijakan ini menjelaskan bagaimana Vittya mengumpulkan,
              menggunakan, menyimpan, melindungi, dan mengungkapkan data pribadi
              sehubungan dengan penggunaan layanan digital wedding platform kami.
            </p>
            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="grid gap-5">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-5 sm:p-6"
                >
                  <h2 className="text-base font-black tracking-tight text-slate-900 sm:text-lg">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
              <h2 className="text-base font-black tracking-tight text-slate-900 sm:text-lg">
                Contact & Data Requests
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Untuk pertanyaan tentang privasi, permintaan pembaruan data,
                penghapusan data, atau klarifikasi terkait pemrosesan informasi
                pribadi, silakan hubungi kanal resmi Vittya berikut.
              </p>
              <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <a
                  href="mailto:vittya.official@gmail.com"
                  className="rounded-2xl border border-white/80 bg-white px-4 py-3 font-semibold transition-colors hover:border-emerald-200 hover:text-emerald-600"
                >
                  Email: vittya.official@gmail.com
                </a>
                <a
                  href="https://wa.me/6285119522207"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-white/80 bg-white px-4 py-3 font-semibold transition-colors hover:border-emerald-200 hover:text-emerald-600"
                >
                  WhatsApp: +6285119522207
                </a>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/register"
                className="text-sm font-bold text-emerald-600 underline underline-offset-4 transition-colors hover:text-emerald-700"
              >
                Back to registration
              </Link>
              <p className="text-xs text-slate-400">
                © 2026 Vittya. Digital Wedding Platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
