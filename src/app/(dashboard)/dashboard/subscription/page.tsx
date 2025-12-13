"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Sidebar";
import { Button, Badge } from "@/components/ui/FormElements";
import { Check, Crown, Zap, Shield, Star } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface Plan {
    id: string;
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    popular?: boolean;
    current?: boolean;
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function SubscriptionPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const plans: Plan[] = [
        {
            id: "free",
            name: "Gratis",
            price: 0,
            period: "selamanya",
            description: "Untuk pemilik kos kecil yang baru mulai",
            features: [
                "Maksimal 1 properti",
                "Maksimal 5 kamar",
                "Listing marketplace",
                "Chat dengan penyewa",
            ],
        },
        {
            id: "basic",
            name: "Basic",
            price: billingCycle === "monthly" ? 99000 : 990000,
            period: billingCycle === "monthly" ? "/bulan" : "/tahun",
            description: "Untuk pemilik kos dengan beberapa properti",
            features: [
                "Maksimal 3 properti",
                "Maksimal 30 kamar",
                "Semua fitur Gratis",
                "Kelola penghuni & pembayaran",
                "Laporan keuangan",
                "Support email",
            ],
        },
        {
            id: "pro",
            name: "Pro",
            price: billingCycle === "monthly" ? 199000 : 1990000,
            period: billingCycle === "monthly" ? "/bulan" : "/tahun",
            description: "Untuk pemilik kos professional",
            features: [
                "Maksimal 10 properti",
                "Unlimited kamar",
                "Semua fitur Basic",
                "Badge Verified ✓",
                "Prioritas di marketplace",
                "Analytics dashboard",
                "Support prioritas",
            ],
            popular: true,
            current: true,
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price: billingCycle === "monthly" ? 499000 : 4990000,
            period: billingCycle === "monthly" ? "/bulan" : "/tahun",
            description: "Untuk bisnis properti skala besar",
            features: [
                "Unlimited properti",
                "Unlimited kamar",
                "Semua fitur Pro",
                "Multi-user access",
                "API access",
                "Custom branding",
                "Account manager",
                "SLA guarantee",
            ],
        },
    ];

    const formatCurrency = (value: number) => {
        if (value === 0) return "Rp 0";
        return `Rp ${value.toLocaleString("id-ID")}`;
    };

    return (
        <div className="min-h-screen">
            <Header
                title="Langganan"
                subtitle="Pilih paket yang sesuai dengan kebutuhan Anda"
            />

            <div className="p-6">
                {/* Current Plan Banner */}
                <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Crown className="h-5 w-5" />
                                <span className="text-sm font-medium opacity-80">Paket Saat Ini</span>
                            </div>
                            <h3 className="text-2xl font-bold">Pro Plan</h3>
                            <p className="text-blue-100 mt-1">
                                Berlaku hingga 1 Januari 2026 • Rp 199.000/bulan
                            </p>
                        </div>
                        <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                            Manage Subscription
                        </Button>
                    </div>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className={billingCycle === "monthly" ? "font-semibold" : "text-slate-500"}>
                        Bulanan
                    </span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                        className={`relative w-14 h-7 rounded-full transition-colors ${billingCycle === "yearly" ? "bg-blue-600" : "bg-slate-300"
                            }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${billingCycle === "yearly" ? "translate-x-7" : ""
                                }`}
                        />
                    </button>
                    <span className={billingCycle === "yearly" ? "font-semibold" : "text-slate-500"}>
                        Tahunan
                        <Badge variant="success" className="ml-2">Hemat 17%</Badge>
                    </span>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-xl border-2 bg-white p-6 ${plan.popular
                                    ? "border-blue-500 shadow-lg shadow-blue-100"
                                    : "border-slate-200"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge variant="info" className="flex items-center gap-1">
                                        <Star className="h-3 w-3" /> Populer
                                    </Badge>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                            </div>

                            <div className="text-center mb-6">
                                <span className="text-3xl font-bold text-slate-900">
                                    {formatCurrency(plan.price)}
                                </span>
                                <span className="text-slate-500">{plan.period}</span>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm text-slate-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.current ? "outline" : plan.popular ? "primary" : "outline"}
                                className="w-full"
                                disabled={plan.current}
                            >
                                {plan.current ? "Paket Saat Ini" : plan.price === 0 ? "Mulai Gratis" : "Upgrade"}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-12">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
                        Pertanyaan Umum
                    </h3>

                    <div className="max-w-2xl mx-auto space-y-4">
                        {[
                            {
                                q: "Bagaimana cara upgrade paket?",
                                a: "Klik tombol 'Upgrade' pada paket yang diinginkan dan ikuti proses pembayaran.",
                            },
                            {
                                q: "Apakah bisa downgrade paket?",
                                a: "Ya, Anda bisa downgrade di akhir periode berlangganan. Hubungi support untuk bantuan.",
                            },
                            {
                                q: "Metode pembayaran apa saja yang diterima?",
                                a: "Kami menerima Transfer Bank, E-Wallet (GoPay, OVO, DANA), dan Kartu Kredit/Debit.",
                            },
                            {
                                q: "Apakah ada garansi uang kembali?",
                                a: "Ya, kami menawarkan garansi 14 hari uang kembali untuk semua paket berbayar.",
                            },
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-lg border p-4">
                                <h4 className="font-medium text-slate-900">{faq.q}</h4>
                                <p className="text-sm text-slate-600 mt-2">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
