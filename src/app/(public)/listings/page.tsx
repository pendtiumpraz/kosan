import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/public/PropertyCard";
import { SearchBar } from "@/components/public/SearchBar";
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";

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

    return { listings, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export default async function ListingsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const data = await getListings(params);

    const getTypeLabel = (type: string | undefined) => {
        const types: Record<string, string> = {
            KOS: "Kos-kosan",
            KONTRAKAN: "Kontrakan",
            VILLA: "Villa",
            HOUSE: "Rumah",
            APARTMENT: "Apartemen",
            LAND: "Tanah",
        };
        return type ? types[type] || "Semua Properti" : "Semua Properti";
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {getTypeLabel(params.type)}
                                {params.city && ` di ${params.city}`}
                            </h1>
                            <p className="text-sm text-slate-500">{data.total} properti ditemukan</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Sort */}
                            <div className="relative">
                                <select
                                    defaultValue={params.sort || "newest"}
                                    className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="newest">Terbaru</option>
                                    <option value="price_asc">Harga: Rendah ke Tinggi</option>
                                    <option value="price_desc">Harga: Tinggi ke Rendah</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>

                            {/* View Toggle */}
                            <div className="hidden sm:flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                <button className="p-2 bg-blue-50 text-blue-600">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-40">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-900">Filter</h3>
                                <button className="text-sm text-blue-600 hover:underline">Reset</button>
                            </div>

                            {/* Property Type */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tipe Properti</label>
                                <div className="space-y-2">
                                    {["KOS", "KONTRAKAN", "HOUSE", "APARTMENT", "VILLA"].map((type) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                defaultChecked={params.type === type}
                                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-slate-600">{getTypeLabel(type)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Rentang Harga</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Bedrooms */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Kamar Tidur</label>
                                <div className="flex gap-2">
                                    {["1", "2", "3", "4", "5+"].map((num) => (
                                        <button
                                            key={num}
                                            className="flex-1 py-2 text-sm border border-slate-200 rounded-lg hover:border-blue-500 hover:text-blue-600"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Apply Button */}
                            <button className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                                Terapkan Filter
                            </button>
                        </div>
                    </aside>

                    {/* Listings Grid */}
                    <main className="flex-1">
                        {data.listings.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                                <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada properti ditemukan</h3>
                                <p className="text-slate-500 mb-6">Coba ubah filter pencarian atau cari di lokasi lain</p>
                                <a href="/listings" className="text-blue-600 font-medium hover:underline">
                                    Lihat Semua Properti
                                </a>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {data.listings.map((listing) => (
                                        <PropertyCard
                                            key={listing.id}
                                            id={listing.id}
                                            title={listing.title}
                                            propertyType={listing.propertyType}
                                            listingType={listing.listingType}
                                            price={Number(listing.price)}
                                            pricePeriod={listing.pricePeriod || undefined}
                                            city={listing.city}
                                            district={listing.district || undefined}
                                            bedrooms={listing.bedrooms || undefined}
                                            bathrooms={listing.bathrooms || undefined}
                                            buildingArea={listing.buildingArea || undefined}
                                            imageUrl={listing.images[0]?.imageUrl || undefined}
                                            isVerified={listing.isVerified}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {data.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-10">
                                        {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                                            .slice(0, 5)
                                            .map((pageNum) => (
                                                <a
                                                    key={pageNum}
                                                    href={`/listings?page=${pageNum}${params.type ? `&type=${params.type}` : ""}${params.city ? `&city=${params.city}` : ""}`}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${data.page === pageNum
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-white border border-slate-200 text-slate-600 hover:border-blue-500"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </a>
                                            ))}
                                        {data.totalPages > 5 && (
                                            <>
                                                <span className="text-slate-400">...</span>
                                                <a
                                                    href={`/listings?page=${data.totalPages}`}
                                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:border-blue-500"
                                                >
                                                    {data.totalPages}
                                                </a>
                                            </>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
