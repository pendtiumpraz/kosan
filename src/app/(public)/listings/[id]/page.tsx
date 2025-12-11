import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
    MapPin,
    Bed,
    Bath,
    Maximize,
    Calendar,
    Shield,
    Heart,
    Share2,
    MessageCircle,
    Phone,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Home,
    Ruler,
    Building2
} from "lucide-react";

async function getListing(id: string) {
    const listing = await prisma.listing.findUnique({
        where: { id, deletedAt: null },
        include: {
            owner: {
                select: { id: true, name: true, avatar: true, phone: true, verificationStatus: true },
            },
            images: { orderBy: { sortOrder: "asc" } },
            facilities: true,
        },
    });

    if (!listing) return null;

    // Increment views
    await prisma.listing.update({
        where: { id },
        data: { views: { increment: 1 } },
    });

    return listing;
}

export default async function ListingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const listing = await getListing(id);

    if (!listing) notFound();

    const formatPrice = (price: number) => {
        if (price >= 1000000000) {
            return `Rp ${(price / 1000000000).toFixed(1)} Miliar`;
        } else if (price >= 1000000) {
            return `Rp ${(price / 1000000).toLocaleString("id-ID")} juta`;
        } else {
            return `Rp ${price.toLocaleString("id-ID")}`;
        }
    };

    const getPricePeriod = () => {
        if (listing.listingType === "SALE") return "";
        switch (listing.pricePeriod) {
            case "DAILY": return " / hari";
            case "MONTHLY": return " / bulan";
            case "YEARLY": return " / tahun";
            default: return " / bulan";
        }
    };

    const images = listing.images.length > 0
        ? listing.images.map(i => i.imageUrl)
        : [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
            "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200",
        ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Image Gallery */}
            <div className="relative h-[50vh] md:h-[60vh] bg-slate-900">
                <Image
                    src={images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Back Button */}
                <Link
                    href="/listings"
                    className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-slate-700 hover:bg-white"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Kembali
                </Link>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white">
                        <Heart className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white">
                        <Share2 className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.slice(0, 5).map((img, i) => (
                            <button
                                key={i}
                                className={`w-16 h-12 rounded-lg overflow-hidden border-2 ${i === 0 ? "border-white" : "border-transparent"
                                    }`}
                            >
                                <Image src={img} alt="" width={64} height={48} className="object-cover w-full h-full" />
                            </button>
                        ))}
                        {images.length > 5 && (
                            <button className="w-16 h-12 rounded-lg bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                                +{images.length - 5}
                            </button>
                        )}
                    </div>
                )}

                {/* Badges */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${listing.listingType === "RENT" ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"
                        }`}>
                        {listing.listingType === "RENT" ? "Disewakan" : "Dijual"}
                    </span>
                    {listing.isVerified && (
                        <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white text-blue-600 flex items-center gap-1">
                            <Shield className="w-4 h-4" /> Terverifikasi
                        </span>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 mb-2">{listing.title}</h1>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <MapPin className="w-4 h-4" />
                                            <span>{listing.district ? `${listing.district}, ` : ""}{listing.city}, {listing.province}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {formatPrice(Number(listing.price))}
                                            <span className="text-base font-normal text-slate-500">{getPricePeriod()}</span>
                                        </div>
                                        {listing.isNegotiable && (
                                            <span className="text-sm text-emerald-600">Harga bisa nego</span>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-100">
                                    {listing.bedrooms && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <Bed className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-500">Kamar Tidur</div>
                                                <div className="font-semibold text-slate-900">{listing.bedrooms}</div>
                                            </div>
                                        </div>
                                    )}
                                    {listing.bathrooms && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <Bath className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-500">Kamar Mandi</div>
                                                <div className="font-semibold text-slate-900">{listing.bathrooms}</div>
                                            </div>
                                        </div>
                                    )}
                                    {listing.buildingArea && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <Maximize className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-500">Luas Bangunan</div>
                                                <div className="font-semibold text-slate-900">{listing.buildingArea} m²</div>
                                            </div>
                                        </div>
                                    )}
                                    {listing.landArea && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <Ruler className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-500">Luas Tanah</div>
                                                <div className="font-semibold text-slate-900">{listing.landArea} m²</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Deskripsi</h2>
                                <p className="text-slate-600 whitespace-pre-line">{listing.description || "Tidak ada deskripsi"}</p>
                            </div>

                            {/* Specifications */}
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Spesifikasi</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <Home className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <div className="text-xs text-slate-500">Tipe</div>
                                            <div className="font-medium text-slate-900">{listing.propertyType}</div>
                                        </div>
                                    </div>
                                    {listing.floors && (
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <Building2 className="w-5 h-5 text-slate-400" />
                                            <div>
                                                <div className="text-xs text-slate-500">Lantai</div>
                                                <div className="font-medium text-slate-900">{listing.floors}</div>
                                            </div>
                                        </div>
                                    )}
                                    {listing.condition && (
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-slate-400" />
                                            <div>
                                                <div className="text-xs text-slate-500">Kondisi</div>
                                                <div className="font-medium text-slate-900">{listing.condition}</div>
                                            </div>
                                        </div>
                                    )}
                                    {listing.furnished && (
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-slate-400" />
                                            <div>
                                                <div className="text-xs text-slate-500">Furnitur</div>
                                                <div className="font-medium text-slate-900">{listing.furnished}</div>
                                            </div>
                                        </div>
                                    )}
                                    {listing.certificate && (
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <Shield className="w-5 h-5 text-slate-400" />
                                            <div>
                                                <div className="text-xs text-slate-500">Sertifikat</div>
                                                <div className="font-medium text-slate-900">{listing.certificate}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Facilities */}
                            {listing.facilities.length > 0 && (
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Fasilitas</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {listing.facilities.map((f) => (
                                            <span key={f.id} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                                                {f.facilityName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Sidebar - Owner Card */}
                    <aside className="w-full lg:w-80">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
                            <div className="flex items-center gap-4 mb-6">
                                <Image
                                    src={listing.owner.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
                                    alt={listing.owner.name}
                                    width={56}
                                    height={56}
                                    className="rounded-full object-cover"
                                />
                                <div>
                                    <div className="font-semibold text-slate-900">{listing.owner.name}</div>
                                    {listing.owner.verificationStatus === "VERIFIED" && (
                                        <div className="flex items-center gap-1 text-sm text-emerald-600">
                                            <CheckCircle className="w-3.5 h-3.5" /> Terverifikasi
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href={`/chat?to=${listing.owner.id}`}
                                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Chat Sekarang
                                </Link>
                                {listing.owner.phone && (
                                    <a
                                        href={`tel:${listing.owner.phone}`}
                                        className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 flex items-center justify-center gap-2"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Hubungi
                                    </a>
                                )}
                            </div>

                            {listing.depositAmount && (
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Deposit</span>
                                        <span className="font-semibold text-slate-900">
                                            {formatPrice(Number(listing.depositAmount))}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <p className="text-xs text-slate-400 mt-6 text-center">
                                Dilihat {listing.views} kali
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
