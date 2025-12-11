import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Heart } from "lucide-react";

interface PropertyCardProps {
    id: string;
    title: string;
    propertyType: string;
    listingType: "RENT" | "SALE";
    price: number;
    pricePeriod?: string;
    city: string;
    district?: string;
    bedrooms?: number;
    bathrooms?: number;
    buildingArea?: number;
    imageUrl?: string;
    isVerified?: boolean;
    isFeatured?: boolean;
}

export function PropertyCard({
    id,
    title,
    propertyType,
    listingType,
    price,
    pricePeriod,
    city,
    district,
    bedrooms,
    bathrooms,
    buildingArea,
    imageUrl,
    isVerified,
    isFeatured,
}: PropertyCardProps) {
    const formatPrice = (price: number) => {
        if (price >= 1000000000) {
            return `Rp ${(price / 1000000000).toFixed(1)} M`;
        } else if (price >= 1000000) {
            return `Rp ${(price / 1000000).toFixed(0)} jt`;
        } else {
            return `Rp ${price.toLocaleString("id-ID")}`;
        }
    };

    const getPricePeriodLabel = () => {
        if (listingType === "SALE") return "";
        switch (pricePeriod) {
            case "DAILY": return "/hari";
            case "MONTHLY": return "/bulan";
            case "YEARLY": return "/tahun";
            default: return "/bulan";
        }
    };

    const getTypeLabel = () => {
        const types: Record<string, string> = {
            KOS: "Kos",
            KONTRAKAN: "Kontrakan",
            VILLA: "Villa",
            HOUSE: "Rumah",
            APARTMENT: "Apartemen",
            LAND: "Tanah",
        };
        return types[propertyType] || propertyType;
    };

    return (
        <Link href={`/listings/${id}`} className="group block">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={imageUrl || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${listingType === "RENT"
                                ? "bg-blue-500 text-white"
                                : "bg-emerald-500 text-white"
                            }`}>
                            {listingType === "RENT" ? "Disewa" : "Dijual"}
                        </span>
                        {isVerified && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-blue-600">
                                ✓ Verified
                            </span>
                        )}
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                            {getTypeLabel()}
                        </span>
                    </div>

                    {/* Favorite Button */}
                    <button className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors">
                        <Heart className="w-4 h-4 text-slate-600 hover:text-red-500" />
                    </button>

                    {/* Featured Ribbon */}
                    {isFeatured && (
                        <div className="absolute -left-8 top-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-10 py-1 rotate-[-45deg] shadow-lg">
                            Featured
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-xl font-bold text-slate-900">{formatPrice(price)}</span>
                        <span className="text-sm text-slate-500">{getPricePeriodLabel()}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{district ? `${district}, ${city}` : city}</span>
                    </div>

                    {/* Specs */}
                    <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-sm text-slate-600">
                        {bedrooms && (
                            <div className="flex items-center gap-1.5">
                                <Bed className="w-4 h-4 text-slate-400" />
                                <span>{bedrooms}</span>
                            </div>
                        )}
                        {bathrooms && (
                            <div className="flex items-center gap-1.5">
                                <Bath className="w-4 h-4 text-slate-400" />
                                <span>{bathrooms}</span>
                            </div>
                        )}
                        {buildingArea && (
                            <div className="flex items-center gap-1.5">
                                <Maximize className="w-4 h-4 text-slate-400" />
                                <span>{buildingArea} m²</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
