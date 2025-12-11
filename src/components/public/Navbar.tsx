"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Home, Search, User, LogIn } from "lucide-react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/listings?type=KOS" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                            Kos-kosan
                        </Link>
                        <Link href="/listings?type=KONTRAKAN" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                            Kontrakan
                        </Link>
                        <Link href="/listings?type=HOUSE" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                            Rumah
                        </Link>
                        <Link href="/listings" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                            <Search className="w-4 h-4" />
                            Cari
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
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
                        className="md:hidden p-2 text-slate-600 hover:text-blue-600"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200">
                        <div className="flex flex-col gap-2">
                            <Link href="/listings?type=KOS" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                                Kos-kosan
                            </Link>
                            <Link href="/listings?type=KONTRAKAN" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                                Kontrakan
                            </Link>
                            <Link href="/listings?type=HOUSE" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                                Rumah
                            </Link>
                            <Link href="/listings" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                                Cari Properti
                            </Link>
                            <hr className="my-2 border-slate-200" />
                            <Link href="/login" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                                Masuk
                            </Link>
                            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center">
                                Daftar
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
