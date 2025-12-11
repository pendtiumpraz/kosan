import { Header } from "@/components/layout/Sidebar";
import { StatCard } from "@/components/ui/FormElements";
import { Building2, Users, CreditCard, ShoppingBag } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="min-h-screen">
            <Header
                title="Dashboard"
                subtitle="Selamat datang kembali, Demo User!"
            />

            <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Properti"
                        value="12"
                        icon={<Building2 className="h-5 w-5" />}
                        change={{ value: 8, type: "increase" }}
                    />
                    <StatCard
                        title="Total Penghuni"
                        value="48"
                        icon={<Users className="h-5 w-5" />}
                        change={{ value: 12, type: "increase" }}
                    />
                    <StatCard
                        title="Pembayaran Bulan Ini"
                        value="Rp 24.5jt"
                        icon={<CreditCard className="h-5 w-5" />}
                        change={{ value: 5, type: "decrease" }}
                    />
                    <StatCard
                        title="Listing Aktif"
                        value="8"
                        icon={<ShoppingBag className="h-5 w-5" />}
                    />
                </div>

                {/* Quick Actions & Recent */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Payments */}
                    <div className="rounded-xl border border-slate-200 bg-white">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <h3 className="text-base font-semibold text-slate-900">Pembayaran Terbaru</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {[
                                { name: "Ahmad Rizky", room: "Kamar 101", amount: "Rp 1.500.000", status: "success" },
                                { name: "Siti Nurhaliza", room: "Kamar 205", amount: "Rp 1.200.000", status: "success" },
                                { name: "Budi Santoso", room: "Kamar 102", amount: "Rp 1.500.000", status: "pending" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                                        <p className="text-xs text-slate-500">{item.room}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-900">{item.amount}</p>
                                        <span className={`text-xs ${item.status === "success" ? "text-emerald-600" : "text-amber-600"
                                            }`}>
                                            {item.status === "success" ? "Lunas" : "Pending"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-200 px-5 py-3">
                            <a href="/dashboard/payments" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                Lihat semua →
                            </a>
                        </div>
                    </div>

                    {/* Recent Properties */}
                    <div className="rounded-xl border border-slate-200 bg-white">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <h3 className="text-base font-semibold text-slate-900">Properti Saya</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {[
                                { name: "Kos Putri Melati", type: "KOS", rooms: 12, occupied: 10 },
                                { name: "Kontrakan Jaya", type: "KONTRAKAN", rooms: 5, occupied: 4 },
                                { name: "Villa Puncak Indah", type: "VILLA", rooms: 3, occupied: 2 },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                                        <p className="text-xs text-slate-500">{item.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-900">{item.occupied}/{item.rooms}</p>
                                        <p className="text-xs text-slate-500">Terisi</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-200 px-5 py-3">
                            <a href="/dashboard/properties" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                Kelola properti →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
