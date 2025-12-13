"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Sidebar";
import { Badge, Select } from "@/components/ui/FormElements";
import {
    TrendingUp,
    Users,
    Home,
    DollarSign,
    Eye,
    Calendar,
    ArrowUp,
    ArrowDown,
} from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface StatCard {
    label: string;
    value: string;
    change: number;
    changeLabel: string;
    icon: React.ReactNode;
    color: string;
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function AnalyticsPage() {
    const [period, setPeriod] = useState("30d");
    const [isLoading, setIsLoading] = useState(false);

    // Mock stats data
    const stats: StatCard[] = [
        {
            label: "Total Pengguna",
            value: "12,847",
            change: 12.5,
            changeLabel: "dari bulan lalu",
            icon: <Users className="h-6 w-6" />,
            color: "blue",
        },
        {
            label: "Listing Aktif",
            value: "3,421",
            change: 8.2,
            changeLabel: "dari bulan lalu",
            icon: <Home className="h-6 w-6" />,
            color: "emerald",
        },
        {
            label: "Total Transaksi",
            value: "Rp 2.4M",
            change: 23.1,
            changeLabel: "dari bulan lalu",
            icon: <DollarSign className="h-6 w-6" />,
            color: "amber",
        },
        {
            label: "Kunjungan",
            value: "89,234",
            change: -5.3,
            changeLabel: "dari bulan lalu",
            icon: <Eye className="h-6 w-6" />,
            color: "purple",
        },
    ];

    // Mock chart data
    const userGrowthData = [
        { month: "Jan", users: 8500 },
        { month: "Feb", users: 9200 },
        { month: "Mar", users: 9800 },
        { month: "Apr", users: 10500 },
        { month: "Mei", users: 11200 },
        { month: "Jun", users: 12847 },
    ];

    const listingsByType = [
        { type: "Kos", count: 1845, percentage: 54 },
        { type: "Kontrakan", count: 823, percentage: 24 },
        { type: "Apartemen", count: 412, percentage: 12 },
        { type: "Rumah", count: 341, percentage: 10 },
    ];

    const topCities = [
        { city: "Jakarta", count: 1234, revenue: "Rp 890M" },
        { city: "Bandung", count: 856, revenue: "Rp 420M" },
        { city: "Surabaya", count: 645, revenue: "Rp 380M" },
        { city: "Yogyakarta", count: 423, revenue: "Rp 210M" },
        { city: "Malang", count: 312, revenue: "Rp 145M" },
    ];

    const recentActivities = [
        { action: "User baru mendaftar", user: "Ahmad Rizki", time: "5 menit lalu" },
        { action: "Listing baru dipublikasikan", user: "Sarah Dewi", time: "12 menit lalu" },
        { action: "Pembayaran berhasil", user: "Budi Santoso", time: "23 menit lalu" },
        { action: "Laporan ditinjau", user: "Admin", time: "1 jam lalu" },
        { action: "User terverifikasi", user: "Rina Wati", time: "2 jam lalu" },
    ];

    return (
        <div className="min-h-screen">
            <Header
                title="Analytics Dashboard"
                subtitle="Overview performa platform KosanHub"
                actions={
                    <Select
                        options={[
                            { value: "7d", label: "7 Hari Terakhir" },
                            { value: "30d", label: "30 Hari Terakhir" },
                            { value: "90d", label: "90 Hari Terakhir" },
                            { value: "365d", label: "1 Tahun" },
                        ]}
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-48"
                    />
                }
            />

            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-xl border p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span
                                    className={`flex items-center gap-1 text-sm font-medium ${stat.change >= 0 ? "text-emerald-600" : "text-red-600"
                                        }`}
                                >
                                    {stat.change >= 0 ? (
                                        <ArrowUp className="h-4 w-4" />
                                    ) : (
                                        <ArrowDown className="h-4 w-4" />
                                    )}
                                    {Math.abs(stat.change)}%
                                </span>
                                <span className="text-sm text-slate-500">{stat.changeLabel}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Growth Chart */}
                    <div className="bg-white rounded-xl border p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Pertumbuhan Pengguna
                        </h3>
                        <div className="h-64 flex items-end gap-4">
                            {userGrowthData.map((d, i) => {
                                const height = (d.users / 15000) * 100;
                                return (
                                    <div key={d.month} className="flex-1 flex flex-col items-center">
                                        <div
                                            className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                                            style={{ height: `${height}%` }}
                                        />
                                        <span className="text-xs text-slate-500 mt-2">{d.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Listings by Type */}
                    <div className="bg-white rounded-xl border p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Listing berdasarkan Tipe
                        </h3>
                        <div className="space-y-4">
                            {listingsByType.map((item) => (
                                <div key={item.type}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-700">
                                            {item.type}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            {item.count} ({item.percentage}%)
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Cities */}
                    <div className="bg-white rounded-xl border p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Top Kota
                        </h3>
                        <div className="space-y-3">
                            {topCities.map((city, i) => (
                                <div
                                    key={city.city}
                                    className="flex items-center justify-between py-2 border-b last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                                            {i + 1}
                                        </span>
                                        <span className="font-medium text-slate-900">{city.city}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-900">
                                            {city.count} listing
                                        </p>
                                        <p className="text-xs text-slate-500">{city.revenue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl border p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Aktivitas Terbaru
                        </h3>
                        <div className="space-y-4">
                            {recentActivities.map((activity, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-900">{activity.action}</p>
                                        <p className="text-xs text-slate-500">
                                            {activity.user} • {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
