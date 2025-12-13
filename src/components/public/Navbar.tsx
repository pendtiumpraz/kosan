"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Home, Search, User, LogIn, ChevronDown, Phone, Info, DollarSign, HelpCircle } from "lucide-react";

const navLinks = [
    {
        label: "Properti",
        children: [
            { href: "/listings?type=KOS", label: "Kos-kosan" },
            { href: "/listings?type=KONTRAKAN", label: "Kontrakan" },
            { href: "/listings?type=HOUSE", label: "Rumah" },
            { href: "/listings?type=APARTMENT", label: "Apartemen" },
            { href: "/listings?type=VILLA", label: "Villa" },
            { href: "/listings", label: "Semua Properti" },
        ]
    },
    { href: "/listings", label: "Cari", icon: Search },
    { href: "/pricing", label: "Harga" },
    { href: "/about", label: "Tentang" },
    { href: "/contact", label: "Kontak" },
    { href: "/faq", label: "FAQ" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            KosanHub
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            'children' in link && link.children ? (
                                <div
                                    key={link.label}
                                    className="relative"
                                    onMouseEnter={() => setOpenDropdown(link.label)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <button className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium transition-colors py-2">
                                        {link.label}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {openDropdown === link.label && (
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : 'href' in link ? (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
                                >
                                    {link.icon && <link.icon className="w-4 h-4" />}
                                    {link.label}
                                </Link>
                            ) : null
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2"
                        >
                            <LogIn className="w-4 h-4" />
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            Daftar
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-slate-600 hover:text-blue-600"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden py-4 border-t border-slate-200">
                        <div className="flex flex-col gap-1">
                            {/* Property Types */}
                            <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase">Properti</div>
                            <Link href="/listings?type=KOS" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setIsOpen(false)}>
                                Kos-kosan
                            </Link>
                            <Link href="/listings?type=KONTRAKAN" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setIsOpen(false)}>
                                Kontrakan
                            </Link>
                            <Link href="/listings?type=HOUSE" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setIsOpen(false)}>
                                Rumah
                            </Link>
                            <Link href="/listings" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                <Search className="w-4 h-4" /> Cari Properti
                            </Link>

                            <hr className="my-2 border-slate-200" />

                            {/* Other Links */}
                            <Link href="/pricing" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                <DollarSign className="w-4 h-4" /> Harga
                            </Link>
                            <Link href="/about" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                <Info className="w-4 h-4" /> Tentang Kami
                            </Link>
                            <Link href="/contact" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                <Phone className="w-4 h-4" /> Hubungi Kami
                            </Link>
                            <Link href="/faq" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                <HelpCircle className="w-4 h-4" /> FAQ
                            </Link>

                            <hr className="my-2 border-slate-200" />

                            {/* Auth */}
                            <Link href="/login" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setIsOpen(false)}>
                                Masuk
                            </Link>
                            <Link href="/register" className="mx-4 py-2 bg-blue-600 text-white rounded-lg text-center font-medium" onClick={() => setIsOpen(false)}>
                                Daftar Gratis
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
