import Image from "next/image";
import Link from "next/link";
import { Users, Target, Award, Heart, ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const stats = [
    { value: "10K+", label: "Properti" },
    { value: "50K+", label: "Pengguna" },
    { value: "100+", label: "Kota" },
    { value: "4.9", label: "Rating" },
];

const values = [
    {
        icon: Heart,
        color: "from-rose-500 to-pink-500",
        title: "Kepedulian",
        desc: "Kami peduli dengan setiap pengguna dan kebutuhan unik mereka dalam mencari hunian"
    },
    {
        icon: Target,
        color: "from-blue-500 to-indigo-500",
        title: "Transparansi",
        desc: "Informasi yang jujur dan akurat untuk membantu Anda membuat keputusan tepat"
    },
    {
        icon: Award,
        color: "from-amber-500 to-orange-500",
        title: "Kualitas",
        desc: "Standar tinggi dalam verifikasi properti dan pelayanan pelanggan"
    },
    {
        icon: Users,
        color: "from-emerald-500 to-teal-500",
        title: "Komunitas",
        desc: "Membangun ekosistem properti yang saling menguntungkan untuk semua"
    },
];

const team = [
    {
        name: "Galih Pratama",
        role: "Founder & CEO",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        bio: "Passionate entrepreneur dengan visi memudahkan akses properti di Indonesia",
    },
    {
        name: "Sarah Dewi",
        role: "Head of Operations",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        bio: "10+ tahun pengalaman di industri properti dan hospitality",
    },
    {
        name: "Ahmad Rizky",
        role: "Chief Technology Officer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        bio: "Tech leader dengan fokus pada user experience dan scalability",
    },
];

const milestones = [
    { year: "2023", title: "Ide Lahir", desc: "Kesulitan mencari kos saat kuliah memicu ide KosanHub" },
    { year: "2024 Q1", title: "Development", desc: "Tim kecil mulai membangun platform" },
    { year: "2024 Q2", title: "Beta Launch", desc: "Soft launch di Bandung dengan 100 properti" },
    { year: "2024 Q4", title: "Expansion", desc: "Ekspansi ke 10 kota besar di Indonesia" },
];

export default function AboutPage() {
    return (
        <div>
            {/* =================================================================
                HERO SECTION - Full height with parallax image
            ================================================================= */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920"
                        alt="Modern building"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-indigo-900/70 to-slate-900/90" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-indigo-200 text-sm mb-6">
                        <Sparkles className="w-4 h-4" />
                        Tentang Kami
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Membangun Masa Depan<br />
                        <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
                            Properti Indonesia
                        </span>
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                        KosanHub adalah platform properti terpercaya yang menghubungkan
                        pemilik dan pencari hunian di seluruh Indonesia
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
                    <div className="max-w-5xl mx-auto px-4 py-6">
                        <div className="grid grid-cols-4 gap-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-indigo-200">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================================
                OUR STORY
            ================================================================= */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                                Cerita Kami
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-6">
                                Dari Masalah Menjadi Solusi
                            </h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    KosanHub lahir dari pengalaman pribadi pendiri kami saat mencari kos-kosan
                                    untuk kuliah. Proses yang melelahkan, informasi tidak transparan, dan
                                    banyaknya properti abal-abal memicu kami untuk menciptakan solusi.
                                </p>
                                <p>
                                    Kami percaya setiap orang berhak mendapatkan informasi properti yang
                                    jujur dan transparan. Dengan teknologi modern dan tim yang passionate,
                                    KosanHub hadir untuk mengubah cara Indonesia mencari dan mengelola properti.
                                </p>
                                <p>
                                    Kini, KosanHub telah membantu puluhan ribu pengguna menemukan hunian
                                    impian mereka, sekaligus memberdayakan ribuan pemilik properti untuk
                                    mengelola usaha mereka dengan lebih efisien.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href="/listings"
                                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                                >
                                    Cari Properti <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
                                >
                                    Hubungi Kami
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                                    alt="Modern home interior"
                                    width={600}
                                    height={450}
                                    className="w-full object-cover"
                                />
                            </div>
                            {/* Floating accent */}
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-2xl -z-10" />
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================================
                TIMELINE / MILESTONES
            ================================================================= */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                            Perjalanan Kami
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                            Milestone KosanHub
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-indigo-200 -translate-x-1/2" />

                        <div className="space-y-12">
                            {milestones.map((item, index) => (
                                <div key={item.year} className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}>
                                    {/* Dot */}
                                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-indigo-600 rounded-full -translate-x-1/2 ring-4 ring-white" />

                                    {/* Content */}
                                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                                        }`}>
                                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                            <span className="text-indigo-600 font-bold">{item.year}</span>
                                            <h3 className="text-xl font-bold text-slate-900 mt-1">{item.title}</h3>
                                            <p className="text-slate-600 mt-2">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================================
                VALUES
            ================================================================= */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                            Nilai-Nilai Kami
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                            Prinsip yang Memandu Langkah Kami
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={value.title}
                                className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                    <value.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =================================================================
                TEAM
            ================================================================= */}
            <section className="py-20 bg-gradient-to-br from-indigo-900 to-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">
                            Tim Kami
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
                            Orang-Orang di Balik KosanHub
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
                            >
                                <div className="relative w-32 h-32 mx-auto mb-6">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="rounded-full object-cover ring-4 ring-indigo-500/30 group-hover:ring-indigo-500/60 transition-all"
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                    <p className="text-indigo-400 font-medium mb-3">{member.role}</p>
                                    <p className="text-slate-400 text-sm">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =================================================================
                CTA
            ================================================================= */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920"
                        alt="Beautiful property"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 to-slate-900/90" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Siap Bergabung dengan Kami?
                    </h2>
                    <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
                        Temukan hunian impian atau kelola properti Anda dengan lebih mudah bersama KosanHub
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/listings"
                            className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Cari Properti
                        </Link>
                        <Link
                            href="/register?role=owner"
                            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            Daftar sebagai Pemilik
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
