import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Building2, Users, Sparkles } from "lucide-react";

const contactMethods = [
    {
        icon: Phone,
        title: "Telepon / WhatsApp",
        value: "081319504441",
        link: "https://wa.me/6281319504441?text=Halo%20KosanHub",
        desc: "Tersedia Senin - Jumat, 09:00 - 17:00 WIB",
        color: "from-emerald-500 to-teal-500",
    },
    {
        icon: Mail,
        title: "Email",
        value: "pendtiumpraz@gmail.com",
        link: "mailto:pendtiumpraz@gmail.com",
        desc: "Respon dalam 1x24 jam",
        color: "from-blue-500 to-indigo-500",
    },
    {
        icon: MapPin,
        title: "Alamat Kantor",
        value: "Jakarta Selatan",
        link: null,
        desc: "Jl. Tech Park No. 88, 12345",
        color: "from-rose-500 to-pink-500",
    },
];

export default function ContactPage() {
    return (
        <div>
            {/* =================================================================
                HERO
            ================================================================= */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920"
                        alt="Office space"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-indigo-900/70 to-slate-900/90" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-indigo-200 text-sm mb-6">
                        <MessageCircle className="w-4 h-4" />
                        Hubungi Kami
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Ada Pertanyaan?<br />
                        <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
                            Kami Siap Membantu
                        </span>
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                        Tim support kami siap menjawab pertanyaan Anda dan membantu kebutuhan properti Anda
                    </p>
                </div>
            </section>

            {/* =================================================================
                CONTACT METHODS
            ================================================================= */}
            <section className="py-16 -mt-20 relative z-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6">
                        {contactMethods.map((method) => (
                            <div
                                key={method.title}
                                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <method.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{method.title}</h3>
                                {method.link ? (
                                    <a
                                        href={method.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 font-medium text-lg hover:underline"
                                    >
                                        {method.value}
                                    </a>
                                ) : (
                                    <p className="text-slate-700 font-medium text-lg">{method.value}</p>
                                )}
                                <p className="text-sm text-slate-500 mt-1">{method.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =================================================================
                PARTNERSHIP + FORM
            ================================================================= */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Partnership Box */}
                        <div>
                            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                                Untuk Pemilik Properti
                            </span>
                            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-6">
                                Kerjasama Pemilik Kos
                            </h2>

                            <div className="relative rounded-2xl overflow-hidden mb-8">
                                <Image
                                    src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800"
                                    alt="Property owner"
                                    width={600}
                                    height={340}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="text-white/90">
                                        Punya kos-kosan atau properti yang ingin dipasarkan?
                                        Kami menawarkan kerjasama yang menguntungkan!
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-2xl p-6 border border-indigo-100">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                                        <Image
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                                            alt="Galih"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Galih Pratama</h3>
                                        <p className="text-sm text-slate-600">Partnership Manager</p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Hubungi langsung untuk diskusi kerjasama
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a
                                        href="https://wa.me/6281319504441?text=Halo%20Galih,%20saya%20tertarik%20kerjasama%20pemilik%20kos%20di%20KosanHub"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp
                                    </a>
                                    <a
                                        href="mailto:pendtiumpraz@gmail.com?subject=Kerjasama%20Pemilik%20Kos%20-%20KosanHub"
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Email
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                                Kirim Pesan
                            </span>
                            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-6">
                                Form Kontak
                            </h2>

                            <form className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            No. Telepon
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="08123456789"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Subjek
                                    </label>
                                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                                        <option value="">Pilih subjek...</option>
                                        <option value="kerjasama">Kerjasama Pemilik Kos</option>
                                        <option value="pertanyaan">Pertanyaan Umum</option>
                                        <option value="masalah">Laporan Masalah</option>
                                        <option value="saran">Saran & Feedback</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Pesan
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder="Tulis pesan Anda..."
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Kirim Pesan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================================
                MAP + CTA
            ================================================================= */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920"
                        alt="City aerial view"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/80" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Butuh Bantuan Lain?
                    </h2>
                    <p className="text-lg text-slate-300 mb-8">
                        Kunjungi FAQ kami untuk jawaban cepat atau langsung hubungi tim support
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/faq"
                            className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            Lihat FAQ
                        </Link>
                        <a
                            href="https://wa.me/6281319504441"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Chat WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
