"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Search, Users, Shield, Building2, Sparkles } from "lucide-react";

const faqCategories = [
    {
        title: "Untuk Pencari Properti",
        icon: Search,
        color: "from-blue-500 to-indigo-500",
        faqs: [
            {
                q: "Bagaimana cara mencari properti di KosanHub?",
                a: "Anda dapat menggunakan fitur pencarian di halaman utama. Masukkan lokasi yang diinginkan, pilih tipe properti (Kos, Kontrakan, Rumah, dll), dan filter sesuai kebutuhan seperti harga, fasilitas, atau rating."
            },
            {
                q: "Apakah gratis untuk mencari dan menghubungi pemilik?",
                a: "Ya, 100% gratis! Anda dapat mencari properti, melihat detail, dan menghubungi pemilik tanpa biaya apapun. Kami percaya akses informasi properti adalah hak semua orang."
            },
            {
                q: "Bagaimana cara memastikan properti itu asli dan tidak penipuan?",
                a: "Setiap listing yang bertanda 'Verified' sudah diverifikasi oleh tim kami. Kami melakukan pengecekan dokumen kepemilikan dan foto properti. Namun, kami tetap menyarankan untuk survei langsung sebelum membayar."
            },
            {
                q: "Apakah saya perlu membuat akun untuk menghubungi pemilik?",
                a: "Ya, Anda perlu mendaftar (gratis) untuk menggunakan fitur chat dan booking. Ini untuk keamanan kedua belah pihak dan memastikan komunikasi yang jelas."
            },
        ]
    },
    {
        title: "Untuk Pemilik Properti",
        icon: Building2,
        color: "from-emerald-500 to-teal-500",
        faqs: [
            {
                q: "Bagaimana cara mendaftarkan properti saya di KosanHub?",
                a: "Daftar sebagai Pemilik, lalu masuk ke Dashboard. Klik 'Tambah Properti', isi informasi lengkap seperti alamat, fasilitas, harga, dan upload foto properti Anda. Tim kami akan review dalam 1-2 hari kerja."
            },
            {
                q: "Berapa biaya untuk listing properti?",
                a: "KosanHub menawarkan paket gratis dengan fitur dasar (1 properti, 2 listing). Untuk fitur premium seperti prioritas tampilan, analytics, dan unlimited listing, tersedia paket berbayar mulai dari Rp 99.000/bulan."
            },
            {
                q: "Bagaimana sistem pembayaran dari penyewa bekerja?",
                a: "Penyewa dapat membayar langsung ke Anda atau menggunakan sistem pembayaran terintegrasi KosanHub. Dengan sistem kami, pembayaran tercatat otomatis, ada reminder untuk penghuni, dan laporan keuangan yang rapi."
            },
            {
                q: "Apakah ada verifikasi untuk penyewa?",
                a: "Ya, setiap penyewa yang mendaftar wajib verifikasi email dan nomor telepon. Untuk keamanan ekstra, Anda bisa meminta dokumen tambahan seperti KTP atau surat keterangan kerja/kuliah."
            },
        ]
    },
    {
        title: "Keamanan & Privasi",
        icon: Shield,
        color: "from-rose-500 to-pink-500",
        faqs: [
            {
                q: "Bagaimana KosanHub menjaga keamanan pengguna?",
                a: "Kami memverifikasi setiap pemilik properti, menyediakan sistem rating dan review dari pengguna lain, serta memiliki tim moderasi yang aktif menangani laporan 24/7."
            },
            {
                q: "Apa yang harus dilakukan jika menemukan listing palsu atau mencurigakan?",
                a: "Gunakan tombol 'Laporkan' pada halaman listing atau hubungi kami melalui halaman Contact. Tim kami akan meninjau dalam 24 jam dan mengambil tindakan yang diperlukan."
            },
            {
                q: "Apakah data pribadi saya aman?",
                a: "Ya, kami menggunakan enkripsi standar industri (SSL/TLS) untuk melindungi data Anda. Kami tidak pernah menjual data pengguna ke pihak ketiga. Baca Kebijakan Privasi kami untuk detail lengkap."
            },
        ]
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleFAQ = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <div>
            {/* =================================================================
                HERO
            ================================================================= */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920"
                        alt="Team discussion"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-indigo-900/70 to-slate-900/90" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-indigo-200 text-sm mb-6">
                        <HelpCircle className="w-4 h-4" />
                        Pusat Bantuan
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Pertanyaan yang Sering Diajukan
                    </h1>
                    <p className="text-xl text-indigo-100 mb-8">
                        Temukan jawaban untuk pertanyaan Anda tentang KosanHub
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari pertanyaan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-xl"
                        />
                    </div>
                </div>
            </section>

            {/* =================================================================
                FAQ CONTENT
            ================================================================= */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    {faqCategories.map((category, catIndex) => {
                        const filteredFaqs = category.faqs.filter(faq =>
                            searchQuery === "" ||
                            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                        if (filteredFaqs.length === 0) return null;

                        return (
                            <div key={category.title} className="mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                                        <category.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">{category.title}</h2>
                                </div>

                                <div className="space-y-3">
                                    {filteredFaqs.map((faq, faqIndex) => {
                                        const id = `${catIndex}-${faqIndex}`;
                                        const isOpen = openIndex === id;

                                        return (
                                            <div
                                                key={id}
                                                className={`bg-white border rounded-xl overflow-hidden transition-all ${isOpen ? 'border-indigo-300 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <button
                                                    onClick={() => toggleFAQ(id)}
                                                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                                                >
                                                    <span className="font-medium text-slate-900">{faq.q}</span>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-indigo-100' : 'bg-slate-100'
                                                        }`}>
                                                        {isOpen ? (
                                                            <ChevronUp className="w-5 h-5 text-indigo-600" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-slate-500" />
                                                        )}
                                                    </div>
                                                </button>
                                                {isOpen && (
                                                    <div className="px-6 pb-4">
                                                        <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* =================================================================
                CTA
            ================================================================= */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920"
                        alt="Support team"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 to-slate-900/90" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Masih Ada Pertanyaan?</h2>
                    <p className="text-lg text-indigo-200 mb-8">
                        Tim support kami siap membantu Anda 24/7
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        Hubungi Kami
                    </a>
                </div>
            </section>
        </div>
    );
}
