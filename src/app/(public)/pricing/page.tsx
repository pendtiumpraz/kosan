import Image from "next/image";
import Link from "next/link";
import { Check, X, ArrowRight, Zap, Star, Building2, Shield, Users, Sparkles } from "lucide-react";

const plans = [
    {
        name: "Gratis",
        price: "Rp 0",
        period: "/selamanya",
        description: "Untuk pemilik yang baru memulai",
        color: "from-slate-500 to-slate-600",
        features: [
            { included: true, text: "1 properti" },
            { included: true, text: "2 listing aktif" },
            { included: true, text: "10 penghuni maksimal" },
            { included: true, text: "Chat dengan penyewa" },
            { included: false, text: "Prioritas tampilan" },
            { included: false, text: "Analytics dashboard" },
            { included: false, text: "Dukungan prioritas" },
        ],
        cta: "Mulai Gratis",
        href: "/register?role=owner&plan=free",
        popular: false,
    },
    {
        name: "Starter",
        price: "Rp 99K",
        period: "/bulan",
        description: "Untuk pemilik dengan beberapa properti",
        color: "from-indigo-500 to-indigo-600",
        features: [
            { included: true, text: "3 properti" },
            { included: true, text: "10 listing aktif" },
            { included: true, text: "50 penghuni maksimal" },
            { included: true, text: "Chat dengan penyewa" },
            { included: true, text: "Prioritas tampilan" },
            { included: true, text: "Analytics dasar" },
            { included: false, text: "Dukungan prioritas" },
        ],
        cta: "Pilih Starter",
        href: "/register?role=owner&plan=starter",
        popular: true,
    },
    {
        name: "Professional",
        price: "Rp 249K",
        period: "/bulan",
        description: "Untuk bisnis properti yang berkembang",
        color: "from-emerald-500 to-teal-500",
        features: [
            { included: true, text: "10 properti" },
            { included: true, text: "50 listing aktif" },
            { included: true, text: "200 penghuni maksimal" },
            { included: true, text: "Chat dengan penyewa" },
            { included: true, text: "Prioritas tampilan" },
            { included: true, text: "Analytics lengkap" },
            { included: true, text: "Dukungan prioritas" },
        ],
        cta: "Pilih Professional",
        href: "/register?role=owner&plan=pro",
        popular: false,
    },
];

const includes = [
    { icon: Zap, title: "Setup Instan", desc: "Langsung aktif dalam 5 menit tanpa ribet" },
    { icon: Building2, title: "Dashboard Lengkap", desc: "Kelola properti, penghuni, dan pembayaran" },
    { icon: Shield, title: "Listing Terverifikasi", desc: "Badge verified untuk kredibilitas tinggi" },
    { icon: Users, title: "Community Support", desc: "Akses ke komunitas pemilik properti" },
];

export default function PricingPage() {
    return (
        <div>
            {/* =================================================================
                HERO
            ================================================================= */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920"
                        alt="Business meeting"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-indigo-900/70 to-slate-900/90" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-indigo-200 text-sm mb-6">
                        <Sparkles className="w-4 h-4" />
                        Harga Transparan
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Paket yang Sesuai<br />
                        <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
                            Kebutuhan Anda
                        </span>
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                        Mulai gratis, upgrade kapan saja. Tanpa biaya tersembunyi.
                    </p>
                </div>
            </section>

            {/* =================================================================
                PRICING CARDS
            ================================================================= */}
            <section className="py-16 -mt-16 relative z-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all ${plan.popular ? 'ring-2 ring-indigo-500 scale-105' : ''
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-center">
                                        <span className="text-white text-sm font-semibold flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4" />
                                            Paling Populer
                                        </span>
                                    </div>
                                )}

                                <div className={`p-6 ${plan.popular ? 'pt-12' : ''}`}>
                                    <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{plan.description}</p>

                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                        <span className="text-slate-500">{plan.period}</span>
                                    </div>

                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                {feature.included ? (
                                                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center">
                                                        <X className="w-3 h-3 text-slate-400" />
                                                    </div>
                                                )}
                                                <span className={feature.included ? "text-slate-700" : "text-slate-400"}>
                                                    {feature.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        href={plan.href}
                                        className={`block w-full py-3 text-center font-semibold rounded-xl transition-all ${plan.popular
                                                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-lg hover:-translate-y-0.5"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Enterprise */}
                    <div className="mt-8 bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                            <p className="text-slate-300">
                                Solusi khusus untuk bisnis besar dengan kebutuhan custom. Unlimited properti,
                                API access, dan dedicated account manager.
                            </p>
                        </div>
                        <Link
                            href="/contact"
                            className="flex-shrink-0 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                        >
                            Hubungi Sales <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* =================================================================
                ALL PLANS INCLUDE
            ================================================================= */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Semua Paket Termasuk</h2>
                        <p className="text-slate-600">Fitur dasar yang tersedia di semua paket</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {includes.map((item) => (
                            <div key={item.title} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                    <item.icon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =================================================================
                CTA
            ================================================================= */}
            <section className="relative py-20 overflow-hidden">
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
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Masih ragu? Coba dulu gratis!
                    </h2>
                    <p className="text-lg text-indigo-200 mb-8">
                        Daftar gratis sekarang dan rasakan kemudahan mengelola properti dengan KosanHub
                    </p>
                    <Link
                        href="/register?role=owner"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        Daftar Gratis Sekarang <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
