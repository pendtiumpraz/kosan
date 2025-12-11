import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/public/SearchBar";
import { PropertyCard } from "@/components/public/PropertyCard";
import {
    Shield,
    Zap,
    Users,
    MessageCircle,
    Star,
    ArrowRight,
    Building2,
    Home,
    MapPin,
    CheckCircle
} from "lucide-react";

// Featured listings data (will be fetched from API later)
const featuredListings = [
    {
        id: "1",
        title: "Kos Putri Melati - Dekat ITB",
        propertyType: "KOS",
        listingType: "RENT" as const,
        price: 1800000,
        pricePeriod: "MONTHLY",
        city: "Bandung",
        district: "Coblong",
        bedrooms: 1,
        bathrooms: 1,
        buildingArea: 16,
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        isVerified: true,
        isFeatured: true,
    },
    {
        id: "2",
        title: "Villa Puncak Indah - View Pegunungan",
        propertyType: "VILLA",
        listingType: "RENT" as const,
        price: 3500000,
        pricePeriod: "DAILY",
        city: "Bogor",
        district: "Cisarua",
        bedrooms: 5,
        bathrooms: 4,
        buildingArea: 350,
        imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        isVerified: true,
    },
    {
        id: "3",
        title: "Rumah Klasik Menteng - Premium Location",
        propertyType: "HOUSE",
        listingType: "SALE" as const,
        price: 25000000000,
        city: "Jakarta Pusat",
        district: "Menteng",
        bedrooms: 6,
        bathrooms: 4,
        buildingArea: 300,
        imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        isVerified: true,
    },
    {
        id: "4",
        title: "Kontrakan Nyaman untuk Keluarga",
        propertyType: "KONTRAKAN",
        listingType: "RENT" as const,
        price: 2500000,
        pricePeriod: "MONTHLY",
        city: "Bandung",
        district: "Sukajadi",
        bedrooms: 3,
        bathrooms: 2,
        buildingArea: 90,
        imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        isVerified: true,
    },
];

const features = [
    {
        icon: Shield,
        title: "Terverifikasi & Aman",
        description: "Semua listing diverifikasi tim kami. Data pribadi terjaga keamanannya.",
    },
    {
        icon: Zap,
        title: "Cepat & Mudah",
        description: "Temukan properti impian dalam hitungan menit dengan filter lengkap.",
    },
    {
        icon: Users,
        title: "Komunitas Terpercaya",
        description: "Bergabung dengan ribuan pemilik dan penyewa properti terpercaya.",
    },
    {
        icon: MessageCircle,
        title: "Chat Langsung",
        description: "Komunikasi langsung dengan pemilik properti tanpa perantara.",
    },
];

const stats = [
    { value: "10K+", label: "Properti Aktif" },
    { value: "50K+", label: "Pengguna" },
    { value: "100+", label: "Kota" },
    { value: "99%", label: "Kepuasan" },
];

const testimonials = [
    {
        name: "Budi Santoso",
        role: "Pemilik Kos di Bandung",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        content: "Sejak pakai KosanHub, pengelolaan kos jadi lebih mudah. Pembayaran tercatat rapi, penghuni bisa bayar online. Sangat membantu!",
        rating: 5,
    },
    {
        name: "Siti Nurhaliza",
        role: "Mahasiswi ITB",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        content: "Cari kos dekat kampus jadi gampang banget. Filter lengkap, foto jelas, bisa chat langsung sama pemilik. Recommended!",
        rating: 5,
    },
    {
        name: "Ahmad Rizky",
        role: "Agen Properti Jakarta",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        content: "Platform yang sangat membantu bisnis properti saya. Listing terverifikasi meningkatkan kepercayaan calon pembeli.",
        rating: 5,
    },
];

export default function LandingPage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920"
                        alt="Beautiful property"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Platform #1 untuk Cari Kos & Properti di Indonesia
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Temukan Hunian Impian<br />
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Mudah & Terpercaya
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                        Cari kos-kosan, kontrakan, rumah, dan properti lainnya dengan mudah.
                        Ribuan pilihan di seluruh Indonesia menanti Anda.
                    </p>

                    {/* Search Bar */}
                    <SearchBar />

                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mt-12">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                                <div className="text-sm text-white/60">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Property Types */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Cari Berdasarkan Tipe</h2>
                        <p className="text-slate-600">Pilih jenis properti yang sesuai kebutuhan Anda</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { type: "KOS", label: "Kos-kosan", icon: Building2, count: 5420, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400" },
                            { type: "KONTRAKAN", label: "Kontrakan", icon: Home, count: 2130, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400" },
                            { type: "HOUSE", label: "Rumah", icon: Home, count: 1890, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" },
                            { type: "APARTMENT", label: "Apartemen", icon: Building2, count: 980, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400" },
                            { type: "VILLA", label: "Villa", icon: Home, count: 450, image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400" },
                            { type: "LAND", label: "Tanah", icon: MapPin, count: 320, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400" },
                        ].map((item) => (
                            <Link
                                key={item.type}
                                href={`/listings?type=${item.type}`}
                                className="group relative overflow-hidden rounded-2xl aspect-square"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.label}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    <h3 className="font-semibold mb-1">{item.label}</h3>
                                    <p className="text-sm text-white/70">{item.count.toLocaleString()} listing</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Listings */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-3">Properti Unggulan</h2>
                            <p className="text-slate-600">Pilihan terbaik dari tim KosanHub</p>
                        </div>
                        <Link
                            href="/listings"
                            className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
                        >
                            Lihat Semua <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredListings.map((listing) => (
                            <PropertyCard key={listing.id} {...listing} />
                        ))}
                    </div>

                    <div className="mt-8 text-center sm:hidden">
                        <Link
                            href="/listings"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
                        >
                            Lihat Semua Properti <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-3">Mengapa Pilih KosanHub?</h2>
                        <p className="text-blue-100">Platform terpercaya untuk kebutuhan properti Anda</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="text-center">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-sm text-blue-100">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Apa Kata Mereka?</h2>
                        <p className="text-slate-600">Testimoni dari pengguna KosanHub</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 mb-6">&ldquo;{t.content}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={t.avatar}
                                        alt={t.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover"
                                    />
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

            {/* CTA Section */}
            <section className="py-20 bg-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Siap Menemukan Hunian Impian?
                    </h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        Bergabunglah dengan ribuan pengguna yang telah menemukan properti impian mereka melalui KosanHub.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/listings"
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            Mulai Cari Properti <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                        >
                            Daftar Gratis
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center items-center gap-6 mt-10 text-slate-500">
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            100% Gratis
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            Tanpa Komisi
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
