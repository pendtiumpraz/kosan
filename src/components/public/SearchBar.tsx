"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, ChevronDown } from "lucide-react";

const propertyTypes = [
    { value: "", label: "Semua Tipe" },
    { value: "KOS", label: "Kos-kosan" },
    { value: "KONTRAKAN", label: "Kontrakan" },
    { value: "HOUSE", label: "Rumah" },
    { value: "APARTMENT", label: "Apartemen" },
    { value: "VILLA", label: "Villa" },
];

const popularCities = [
    "Jakarta",
    "Bandung",
    "Surabaya",
    "Yogyakarta",
    "Bali",
    "Malang",
    "Semarang",
    "Medan",
];

interface SearchBarProps {
    variant?: "hero" | "compact";
}

export function SearchBar({ variant = "hero" }: SearchBarProps) {
    const router = useRouter();
    const [location, setLocation] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.set("city", location);
        if (propertyType) params.set("type", propertyType);
        router.push(`/listings?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1.5 max-w-xl">
                <div className="flex items-center flex-1 px-3">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari lokasi..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-2 py-1.5 text-sm focus:outline-none"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                    Cari
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-blue-500/10 p-2 flex flex-col md:flex-row gap-2">
                {/* Location Input */}
                <div className="flex-1 relative">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-500 mb-0.5">Lokasi</label>
                            <input
                                type="text"
                                placeholder="Masukkan kota atau area"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-10">
                            <p className="px-4 py-1 text-xs font-medium text-slate-500">Kota Populer</p>
                            {popularCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => { setLocation(city); setShowSuggestions(false); }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-slate-200 my-2" />

                {/* Property Type */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <Home className="w-5 h-5 text-blue-500" />
                        <div className="flex-1 relative">
                            <label className="block text-xs font-medium text-slate-500 mb-0.5">Tipe Properti</label>
                            <select
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                className="w-full bg-transparent text-slate-800 focus:outline-none appearance-none cursor-pointer"
                            >
                                {propertyTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                    <Search className="w-5 h-5" />
                    <span>Cari</span>
                </button>
            </div>
        </div>
    );
}
