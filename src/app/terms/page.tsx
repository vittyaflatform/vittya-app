import Link from "next/link";

const sections = [
  {
    title: "1. Penerimaan Ketentuan",
    body: "Dengan mengakses, mendaftar, membeli, atau menggunakan layanan Vittya, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan ini. Jika Anda tidak menyetujui salah satu bagian dari ketentuan ini, Anda tidak diperkenankan menggunakan layanan Vittya.",
  },
  {
    title: "2. Grant of License",
    body: "Vittya memberikan kepada Pengguna lisensi terbatas, non-eksklusif, tidak dapat dipindahtangankan, dan dapat dicabut untuk mengakses serta menggunakan platform undangan pernikahan digital Vittya hanya untuk kebutuhan pribadi atau kegiatan usaha yang sah sesuai paket layanan yang dibeli. Lisensi ini tidak memberikan hak kepada Pengguna untuk menjual kembali, mendistribusikan ulang, menggandakan, memodifikasi, melakukan reverse engineering, atau mengeksploitasi sebagian maupun seluruh layanan tanpa persetujuan tertulis dari Vittya.",
  },
  {
    title: "3. Digital Goods & Service Scope",
    body: "Produk yang disediakan Vittya merupakan produk digital, termasuk namun tidak terbatas pada website undangan pernikahan, dashboard pengelolaan tamu, RSVP, media galeri, dan fitur digital terkait lainnya. Karena sifatnya sebagai digital goods, akses layanan dapat diberikan segera setelah pembayaran terverifikasi dan/atau akun diaktifkan sesuai kebijakan operasional Vittya.",
  },
  {
    title: "4. Fees and Payment",
    body: "Pengguna wajib membayar biaya layanan sesuai harga yang tercantum pada platform, invoice, atau halaman checkout resmi Vittya. Seluruh harga dapat berubah sewaktu-waktu sebelum pembayaran dikonfirmasi. Pembayaran yang telah berhasil diproses untuk produk digital pada prinsipnya bersifat final sesuai ketentuan hukum yang berlaku dan kebijakan merchant untuk produk digital, kecuali secara tegas dinyatakan lain oleh Vittya atau diwajibkan oleh peraturan perundang-undangan yang berlaku.",
  },
  {
    title: "5. User Obligations",
    body: "Pengguna wajib memberikan data yang benar, lengkap, dan mutakhir; menjaga kerahasiaan akun dan kredensial; memastikan bahwa seluruh konten yang diunggah tidak melanggar hukum, hak kekayaan intelektual, privasi, maupun hak pihak ketiga; serta menggunakan layanan Vittya secara bertanggung jawab dan tidak untuk kegiatan yang bersifat menipu, melanggar hukum, atau merugikan pihak lain.",
  },
  {
    title: "6. Account, Access, and Suspension",
    body: "Vittya berhak menolak, membatasi, menangguhkan, atau menghentikan akses akun apabila ditemukan indikasi pelanggaran Syarat & Ketentuan, penyalahgunaan sistem, aktivitas mencurigakan, chargeback yang tidak sah, atau tindakan lain yang berpotensi menimbulkan kerugian operasional, keamanan, atau kepatuhan hukum.",
  },
  {
    title: "7. Intellectual Property",
    body: "Seluruh perangkat lunak, desain sistem, antarmuka, elemen merek, konten milik Vittya, dan materi pendukung lainnya merupakan hak milik Vittya dan/atau pemberi lisensinya, yang dilindungi oleh hukum kekayaan intelektual yang berlaku. Pengguna hanya memperoleh hak penggunaan terbatas sebagaimana diatur dalam ketentuan ini.",
  },
  {
    title: "8. Limitation of Liability",
    body: "Sejauh diizinkan oleh hukum, Vittya tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, konsekuensial, kehilangan keuntungan, kehilangan data, atau gangguan usaha yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan. Tanggung jawab maksimum Vittya, jika ada, terbatas pada jumlah pembayaran yang secara sah telah diterima Vittya dari Pengguna untuk layanan yang menjadi pokok sengketa.",
  },
  {
    title: "9. Refunds, Cancellations, and Chargebacks",
    body: "Untuk produk digital, permintaan pembatalan, refund, atau chargeback akan ditinjau berdasarkan status aktivasi layanan, penggunaan aktual, bukti transaksi, serta ketentuan pembayaran yang berlaku. Pengguna setuju untuk terlebih dahulu menghubungi Vittya guna penyelesaian secara itikad baik sebelum mengajukan sengketa pembayaran kepada penyedia layanan pembayaran.",
  },
  {
    title: "10. Applicable Laws",
    body: "Syarat & Ketentuan ini diatur, ditafsirkan, dan dilaksanakan berdasarkan hukum Republik Indonesia. Setiap sengketa yang timbul sehubungan dengan penggunaan layanan Vittya akan diselesaikan terlebih dahulu secara musyawarah. Apabila tidak tercapai penyelesaian, sengketa akan tunduk pada yurisdiksi yang berlaku di Indonesia sesuai ketentuan peraturan perundang-undangan.",
  },
  {
    title: "11. Perubahan Ketentuan",
    body: "Vittya berhak memperbarui Syarat & Ketentuan ini dari waktu ke waktu untuk menyesuaikan perubahan layanan, kebijakan operasional, maupun ketentuan hukum dan kepatuhan pembayaran. Versi terbaru akan dipublikasikan pada halaman ini dan berlaku sejak tanggal pembaruan dicantumkan.",
  },
];

export default function TermsPage() {
  const lastUpdated = "2 April 2026";

  return (
    <main className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[2rem] border border-emerald-100/70 bg-white shadow-[0_35px_90px_-30px_rgba(15,23,42,0.22)]">
          <div className="border-b border-slate-100 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-8 text-white sm:px-10 sm:py-10">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-emerald-400">
              Midtrans Compliance Ready
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Terms & Conditions
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Ketentuan ini mengatur penggunaan platform digital wedding Vittya,
              termasuk lisensi penggunaan layanan, produk digital, pembayaran,
              kewajiban pengguna, dan kepatuhan hukum yang berlaku di Indonesia.
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
                Contact & Verification
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Untuk pertanyaan hukum, verifikasi merchant, bantuan transaksi,
                atau permintaan klarifikasi atas layanan digital Vittya, silakan
                hubungi kontak resmi berikut.
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
