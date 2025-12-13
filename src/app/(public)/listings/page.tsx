import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SlidersHorizontal, Grid3X3, List, ChevronDown, MapPin, Heart, Search, Sparkles } from "lucide-react";

interface SearchParams {
    type?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    page?: string;
    sort?: string;
}

async function getListings(searchParams: SearchParams) {
    try {
        const page = parseInt(searchParams.page || "1");
        const limit = 12;
        const skip = (page - 1) * limit;

        const where: any = {
            deletedAt: null,
            status: "ACTIVE",
        };

        if (searchParams.type) {
            where.propertyType = searchParams.type;
        }

        if (searchParams.city) {
            where.city = { contains: searchParams.city, mode: "insensitive" };
        }

        if (searchParams.minPrice || searchParams.maxPrice) {
            where.price = {};
            if (searchParams.minPrice) where.price.gte = parseInt(searchParams.minPrice);
            if (searchParams.maxPrice) where.price.lte = parseInt(searchParams.maxPrice);
        }

        if (searchParams.bedrooms) {
            where.bedrooms = { gte: parseInt(searchParams.bedrooms) };
        }

        const orderBy: any = {};
        switch (searchParams.sort) {
            case "price_asc": orderBy.price = "asc"; break;
            case "price_desc": orderBy.price = "desc"; break;
            case "newest": orderBy.createdAt = "desc"; break;
            default: orderBy.createdAt = "desc";
        }

        const [listings, total] = await Promise.all([
            prisma.listing.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    images: { where: { isPrimary: true }, take: 1 },
                },
            }),
            prisma.listing.count({ where }),
        ]);

        return { listings, total, page, limit, totalPages: Math.ceil(total / limit), error: null };
    } catch (error) {
        console.error("Error fetching listings:", error);
        return { listings: [], total: 0, page: 1, limit: 12, totalPages: 0, error: "Failed to fetch listings" };
    }
}

function formatPrice(price: number) {
    if (price >= 1000000000) return `Rp ${(price / 1000000000).toFixed(1)}M`;
    if (price >= 1000000) return `Rp ${(price / 1000000).toFixed(0)}jt`;
    return `Rp ${price.toLocaleString("id-ID")}`;
}

function getPricePeriodLabel(listingType: string, period: string | null) {
    if (listingType === "SALE") return "";
    switch (period) {
        case "DAILY": return "/hari";
        case "MONTHLY": return "/bulan";
        case "YEARLY": return "/tahun";
        default: return "/bulan";
    }
}

function getTypeLabel(type: string | undefined) {
    const types: Record<string, string> = {
        KOS: "Kos-kosan",
        KONTRAKAN: "Kontrakan",
        VILLA: "Villa",
        HOUSE: "Rumah",
        APARTMENT: "Apartemen",
        LAND: "Tanah",
    };
    return type ? types[type] || "Semua Properti" : "Semua Properti";
}

export default async function ListingsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const data = await getListings(params);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 pt-8 pb-20">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920"
                        alt="Properties"
                        fill
                        className="object-cover opacity-20"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-indigo-200 text-sm mb-4">
                            <Sparkles className="w-4 h-4" />
                            {data.total} properti tersedia
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            {getTypeLabel(params.type)}
                            {params.city && ` di ${params.city}`}
                        </h1>
                        <p className="text-indigo-200">
                            Temukan hunian impian Anda dengan mudah
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto mt-8">
                        <div className="bg-white rounded-xl shadow-xl p-2 flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50">
                                <MapPin className="w-5 h-5 text-indigo-500" />
                                <input
                                    type="text"
                                    placeholder="Cari lokasi..."
                                    defaultValue={params.city}
                                    className="w-full bg-transparent focus:outline-none text-slate-800"
                                />
                            </div>
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50">
                                <select
                                    defaultValue={params.type || ""}
                                    className="w-full bg-transparent focus:outline-none text-slate-800"
                                >
                                    <option value="">Semua Tipe</option>
                                    <option value="KOS">Kos-kosan</option>
                                    <option value="KONTRAKAN">Kontrakan</option>
                                    <option value="HOUSE">Rumah</option>
                                    <option value="APARTMENT">Apartemen</option>
                                    <option value="VILLA">Villa</option>
                                </select>
                            </div>
                            <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                <Search className="w-5 h-5" />
                                Cari
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-40 -mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
                            {["KOS", "KONTRAKAN", "HOUSE", "APARTMENT", "VILLA"].map((type) => (
                                <Link
                                    key={type}
                                    href={`/listings?type=${type}`}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${params.type === type
                                            ? "bg-indigo-600 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {getTypeLabel(type)}
                                </Link>
                            ))}
                            <Link
                                href="/listings"
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!params.type
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                Semua
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <select
                                    defaultValue={params.sort || "newest"}
                                    className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="newest">Terbaru</option>
                                    <option value="price_asc">Harga: Rendah</option>
                                    <option value="price_desc">Harga: Tinggi</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>

                            <div className="hidden sm:flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                <button className="p-2 bg-indigo-50 text-indigo-600">
                                    <Grid3X3 className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600">
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {data.error ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Gagal memuat data</h3>
                        <p className="text-slate-500 mb-6">Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>
                        <Link href="/listings" className="text-indigo-600 font-medium hover:underline">
                            Refresh
                        </Link>
                    </div>
                ) : data.listings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada properti ditemukan</h3>
                        <p className="text-slate-500 mb-6">Coba ubah filter pencarian atau cari di lokasi lain</p>
                        <Link href="/listings" className="text-indigo-600 font-medium hover:underline">
                            Lihat Semua Properti
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.listings.map((listing) => (
                                <Link key={listing.id} href={`/listings/${listing.id}`} className="group">
                                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <Image
                                                src={listing.images[0]?.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"}
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
                                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                                                {getTypeLabel(listing.propertyType)}
                                            </span>
                                            <button className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors">
                                                <Heart className="w-4 h-4 text-slate-600 hover:text-rose-500" />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-baseline gap-1 mb-2">
                                                <span className="text-xl font-bold text-slate-900">{formatPrice(Number(listing.price))}</span>
                                                <span className="text-sm text-slate-500">
                                                    {getPricePeriodLabel(listing.listingType, listing.pricePeriod)}
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

                        {/* Pagination */}
                        {data.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => i + 1).map((pageNum) => (
                                    <Link
                                        key={pageNum}
                                        href={`/listings?page=${pageNum}${params.type ? `&type=${params.type}` : ""}${params.city ? `&city=${params.city}` : ""}`}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${data.page === pageNum
                                                ? "bg-indigo-600 text-white"
                                                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-500"
                                            }`}
                                    >
                                        {pageNum}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
