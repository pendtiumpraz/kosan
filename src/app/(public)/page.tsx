import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
    Search,
    Home,
    Building2,
    MapPin,
    Shield,
    Zap,
    Users,
    MessageCircle,
    Star,
    ArrowRight,
    CheckCircle,
    TrendingUp,
    CreditCard,
    BarChart3,
    Sparkles,
    Heart
} from "lucide-react";

// =============================================================================
// DATA FETCHING
// =============================================================================

async function getFeaturedListings() {
    try {
        const listings = await prisma.listing.findMany({
            where: {
                deletedAt: null,
                status: "ACTIVE",
                featured: true,
            },
            orderBy: { createdAt: "desc" },
            take: 4,
            include: {
                images: { where: { isPrimary: true }, take: 1 },
            },
        });
        return listings;
    } catch (error) {
        console.error("Error fetching featured listings:", error);
        return [];
    }
}

async function getStats() {
    try {
        const [totalListings, totalUsers, totalCities] = await Promise.all([
            prisma.listing.count({ where: { deletedAt: null, status: "ACTIVE" } }),
            prisma.user.count({ where: { isActive: true } }),
            prisma.listing.groupBy({
                by: ["city"],
                where: { deletedAt: null, status: "ACTIVE" },
            }),
        ]);

        return {
            listings: totalListings,
            users: totalUsers,
            cities: totalCities.length,
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return { listings: 0, users: 0, cities: 0 };
    }
}

async function getPropertyTypeCounts() {
    try {
        const counts = await prisma.listing.groupBy({
            by: ["propertyType"],
            where: { deletedAt: null, status: "ACTIVE" },
            _count: true,
        });

        return counts.reduce((acc: Record<string, number>, curr) => {
            acc[curr.propertyType] = curr._count;
            return acc;
        }, {});
    } catch (error) {
        console.error("Error fetching property counts:", error);
        return {};
    }
}

// =============================================================================
// STATIC DATA
// =============================================================================

const propertyTypes = [
    { type: "KOS", label: "Kos-kosan", icon: "🏠", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600" },
    { type: "KONTRAKAN", label: "Kontrakan", icon: "🏡", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600" },
    { type: "HOUSE", label: "Rumah", icon: "🏘️", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600" },
    { type: "APARTMENT", label: "Apartemen", icon: "🏢", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600" },
    { type: "VILLA", label: "Villa", icon: "🏖️", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600" },
    { type: "LAND", label: "Tanah", icon: "🌳", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600" },
];

const ownerBenefits = [
    { icon: TrendingUp, title: "Jangkauan Luas", desc: "Properti Anda dilihat ribuan calon penyewa setiap hari", color: "from-blue-500 to-indigo-500" },
    { icon: CreditCard, title: "Pembayaran Mudah", desc: "Terima pembayaran online dengan berbagai metode", color: "from-emerald-500 to-teal-500" },
    { icon: BarChart3, title: "Analytics Lengkap", desc: "Pantau performa listing dan pendapatan real-time", color: "from-amber-500 to-orange-500" },
    { icon: Shield, title: "Aman & Terpercaya", desc: "Verifikasi penyewa dan jaminan pembayaran", color: "from-rose-500 to-pink-500" },
];

const testimonials = [
    {
        name: "Budi Santoso",
        role: "Pemilik Kos di Bandung",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
        content: "Sejak pakai KosanHub, pengelolaan kos jadi lebih mudah. Pembayaran tercatat rapi, penghuni bisa bayar online. Pendapatan naik 30%!",
        rating: 5,
    },
    {
        name: "Siti Nurhaliza",
        role: "Mahasiswi ITB",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
        content: "Cari kos dekat kampus jadi gampang banget. Filter lengkap, foto jelas, bisa chat langsung sama pemilik. Recommended banget!",
        rating: 5,
    },
    {
        name: "Ahmad Rizky",
        role: "Agen Properti Jakarta",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
        content: "Platform yang sangat membantu bisnis properti saya. Listing terverifikasi meningkatkan kepercayaan calon pembeli.",
        rating: 5,
    },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatPrice(price: number) {
    if (price >= 1000000000) return `Rp ${(price / 1000000000).toFixed(1)}M`;
    if (price >= 1000000) return `Rp ${(price / 1000000).toFixed(0)}jt`;
    return `Rp ${price.toLocaleString("id-ID")}`;
}

function formatCount(num: number) {
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
    return num.toString();
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function LandingPage() {
    const [featuredListings, stats, typeCounts] = await Promise.all([
        getFeaturedListings(),
        getStats(),
        getPropertyTypeCounts(),
    ]);

    return (
        <div>
            {/* ================================================================= */}
            {/* HERO SECTION */}
            {/* ================================================================= */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920"
                        alt="Beautiful home"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-slate-900/60 to-slate-900/90" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                    <div className="text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-indigo-200 text-sm mb-6 border border-white/20">
                            <Sparkles className="w-4 h-4" />
                            Platform #1 untuk Cari Kos & Properti di Indonesia
                        </span>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Temukan Hunian<br />
                            <span className="bg-gradient-to-r from-indigo-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                                Impian Anda
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                            Kos-kosan, kontrakan, rumah, apartemen, dan properti lainnya.
                            Ribuan pilihan di seluruh Indonesia menanti Anda.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
                                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <MapPin className="w-5 h-5 text-indigo-500" />
                                    <input
                                        type="text"
                                        placeholder="Masukkan kota atau area..."
                                        className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <Home className="w-5 h-5 text-indigo-500" />
                                    <select className="w-full bg-transparent focus:outline-none text-slate-800 cursor-pointer">
                                        <option value="">Semua Tipe</option>
                                        <option value="KOS">Kos-kosan</option>
                                        <option value="KONTRAKAN">Kontrakan</option>
                                        <option value="HOUSE">Rumah</option>
                                        <option value="APARTMENT">Apartemen</option>
                                        <option value="VILLA">Villa</option>
                                    </select>
                                </div>
                                <Link
                                    href="/listings"
                                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Search className="w-5 h-5" />
                                    Cari
                                </Link>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-16">
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-white">{formatCount(stats.listings)}</div>
                                <div className="text-sm text-indigo-200/70">Properti Aktif</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-white">{formatCount(stats.users)}</div>
                                <div className="text-sm text-indigo-200/70">Pengguna</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-white">{stats.cities}+</div>
                                <div className="text-sm text-indigo-200/70">Kota</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-white">4.9</div>
                                <div className="text-sm text-indigo-200/70">Rating</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                        <div className="w-1 h-2 bg-white/50 rounded-full" />
                    </div>
                </div>
            </section>

            {/* ================================================================= */}
            {/* PROPERTY TYPES */}
            {/* ================================================================= */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                            Kategori Properti
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                            Cari Berdasarkan Tipe
                        </h2>
                        <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                            Pilih jenis properti yang sesuai dengan kebutuhan dan budget Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {propertyTypes.map((item) => (
                            <Link
                                key={item.type}
                                href={`/listings?type=${item.type}`}
                                className="group relative overflow-hidden rounded-2xl aspect-[3/4] hover:-translate-y-1 transition-all duration-300"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.label}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    <span className="text-2xl mb-1 block">{item.icon}</span>
                                    <h3 className="font-bold text-lg">{item.label}</h3>
                                    <p className="text-sm text-white/70">{typeCounts[item.type] || 0} listing</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================================= */}
            {/* FEATURED LISTINGS */}
            {/* ================================================================= */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                        <div>
                            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                                Pilihan Terbaik
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                                Properti Unggulan
                            </h2>
                            <p className="text-slate-600 mt-2">Rekomendasi properti terbaik dari tim KosanHub</p>
                        </div>
                        <Link
                            href="/listings"
                            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all"
                        >
                            Lihat Semua <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {featuredListings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredListings.map((listing) => (
                                <Link key={listing.id} href={`/listings/${listing.id}`} className="group">
                                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <Image
                                                src={(listing as any).images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"}
                                                alt={listing.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${listing.listingType === "RENT"
                                                    ? "bg-indigo-500 text-white"
                                                    : "bg-emerald-500 text-white"
                                                    }`}>
                                                    {listing.listingType === "RENT" ? "Disewa" : "Dijual"}
                                                </span>
                                                {listing.isVerified && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-indigo-600 backdrop-blur-sm">
                                                        ✓ Verified
                                                    </span>
                                                )}
                                            </div>
                                            <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                                <Heart className="w-4 h-4 text-slate-600" />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-baseline gap-1 mb-2">
                                                <span className="text-xl font-bold text-slate-900">{formatPrice(Number(listing.price))}</span>
                                                <span className="text-sm text-slate-500">
                                                    {listing.listingType === "RENT" ? `/${listing.pricePeriod === "DAILY" ? "hari" : listing.pricePeriod === "YEARLY" ? "tahun" : "bulan"}` : ""}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                                {listing.title}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                                                <MapPin className="w-4 h-4" />
                                                <span className="line-clamp-1">{listing.district}, {listing.city}</span>
                                            </div>
                                            <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-sm text-slate-600">
                                                {listing.bedrooms && <span>🛏 {listing.bedrooms}</span>}
                                                {listing.bathrooms && <span>🚿 {listing.bathrooms}</span>}
                                                {listing.buildingArea && <span>📐 {listing.buildingArea}m²</span>}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-100 rounded-2xl p-12 text-center">
                            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">Belum ada properti unggulan</h3>
                            <p className="text-slate-500 mb-6">Jelajahi semua properti yang tersedia</p>
                            <Link
                                href="/listings"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
                            >
                                Lihat Semua Properti
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ================================================================= */}
            {/* FOR OWNERS */}
            {/* ================================================================= */}
            <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="text-white">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm mb-6">
                                <Building2 className="w-4 h-4" />
                                Untuk Pemilik Properti
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                Kelola Properti<br />
                                <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
                                    Lebih Mudah
                                </span>
                            </h2>
                            <p className="text-lg text-slate-300 mb-10">
                                Daftarkan properti Anda di KosanHub dan nikmati kemudahan dalam mengelola
                                kos-kosan, kontrakan, atau properti lainnya. Jangkau ribuan calon penyewa.
                            </p>

                            {/* Benefits */}
                            <div className="grid sm:grid-cols-2 gap-5 mb-10">
                                {ownerBenefits.map((benefit) => (
                                    <div key={benefit.title} className="flex items-start gap-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <benefit.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                                            <p className="text-sm text-slate-400">{benefit.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/register?role=owner"
                                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                                >
                                    Daftar sebagai Pemilik <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/pricing"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors inline-flex items-center justify-center"
                                >
                                    Lihat Harga
                                </Link>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative hidden lg:block">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800"
                                    alt="Property owner"
                                    width={600}
                                    height={450}
                                    className="w-full object-cover"
                                />
                            </div>
                            {/* Stats cards */}
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">+127%</p>
                                        <p className="text-sm text-slate-500">Booking</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">{formatCount(stats.users)}</p>
                                        <p className="text-sm text-slate-500">Pemilik</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================================= */}
            {/* WHY CHOOSE US */}
            {/* ================================================================= */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                            Keunggulan Kami
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                            Mengapa Pilih KosanHub?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, title: "Terverifikasi", desc: "Semua listing diverifikasi tim kami untuk keamanan Anda", color: "from-indigo-500 to-indigo-600" },
                            { icon: Zap, title: "Cepat & Mudah", desc: "Temukan properti impian dalam hitungan menit", color: "from-amber-500 to-orange-500" },
                            { icon: Users, title: "Komunitas", desc: "Ribuan pemilik dan penyewa properti terpercaya", color: "from-emerald-500 to-teal-500" },
                            { icon: MessageCircle, title: "Chat Langsung", desc: "Komunikasi langsung dengan pemilik tanpa perantara", color: "from-rose-500 to-pink-500" },
                        ].map((feature) => (
                            <div key={feature.title} className="text-center group">
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================================= */}
            {/* TESTIMONIALS */}
            {/* ================================================================= */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                            Testimoni
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                            Apa Kata Pengguna Kami?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 mb-6 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={t.image}
                                            alt={t.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">{t.name}</div>
                                        <div className="text-sm text-slate-500">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================================= */}
            {/* CTA - DOUBLE REGISTRATION */}
            {/* ================================================================= */}
            <section className="py-20 bg-slate-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Siap Bergabung dengan KosanHub?
                        </h2>
                        <p className="text-lg text-slate-400">
                            Pilih sesuai kebutuhan Anda
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* For Seekers */}
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                                    <Search className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Cari Properti</h3>
                                <p className="text-indigo-100 mb-6">
                                    Temukan kos, kontrakan, rumah, atau properti lainnya yang sesuai kebutuhan Anda.
                                </p>
                                <ul className="space-y-2 mb-8">
                                    {["Ribuan pilihan properti", "Filter lengkap", "Chat langsung pemilik", "100% Gratis"].map((item) => (
                                        <li key={item} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-emerald-300" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/register"
                                    className="block w-full py-3 bg-white text-indigo-600 font-semibold rounded-xl text-center hover:shadow-lg transition-all"
                                >
                                    Daftar sebagai Pencari
                                </Link>
                            </div>
                        </div>

                        {/* For Owners */}
                        <div className="bg-white rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                                    <Building2 className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Kelola Properti</h3>
                                <p className="text-slate-600 mb-6">
                                    Daftarkan properti Anda dan nikmati kemudahan pengelolaan secara online.
                                </p>
                                <ul className="space-y-2 mb-8">
                                    {["Jangkau ribuan penyewa", "Manajemen pembayaran", "Dashboard analitik", "Dukungan 24/7"].map((item) => (
                                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                                            <CheckCircle className="w-4 h-4 text-indigo-600" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/register?role=owner"
                                    className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl text-center hover:shadow-lg transition-all"
                                >
                                    Daftar sebagai Pemilik
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-slate-400">
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            100% Gratis Mendaftar
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            Tanpa Komisi Tersembunyi
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            Listing Terverifikasi
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
