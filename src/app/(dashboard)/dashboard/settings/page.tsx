"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Sidebar";
import { Button, Input, Textarea, Badge } from "@/components/ui/FormElements";
import { Save, User, Bell, Shield, CreditCard } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface TabItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    // Profile form
    const [profileForm, setProfileForm] = useState({
        name: "Demo User",
        email: "demo@example.com",
        phone: "08123456789",
        address: "Jakarta, Indonesia",
        bio: "",
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailPayment: true,
        emailBooking: true,
        emailMessage: true,
        pushPayment: true,
        pushBooking: false,
        pushMessage: true,
    });

    const tabs: TabItem[] = [
        { id: "profile", label: "Profil", icon: <User className="h-4 w-4" /> },
        { id: "notifications", label: "Notifikasi", icon: <Bell className="h-4 w-4" /> },
        { id: "security", label: "Keamanan", icon: <Shield className="h-4 w-4" /> },
        { id: "billing", label: "Tagihan", icon: <CreditCard className="h-4 w-4" /> },
    ];

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage("");

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSaveMessage("Pengaturan berhasil disimpan");
        } catch (error) {
            setSaveMessage("Gagal menyimpan pengaturan");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Header
                title="Pengaturan"
                subtitle="Kelola akun dan preferensi Anda"
                actions={
                    <Button
                        leftIcon={<Save className="h-4 w-4" />}
                        onClick={handleSave}
                        isLoading={isSaving}
                    >
                        Simpan
                    </Button>
                }
            />

            <div className="p-6">
                <div className="flex gap-6">
                    {/* Sidebar Tabs */}
                    <div className="w-56 flex-shrink-0">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${activeTab === tab.id
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 max-w-2xl">
                        {saveMessage && (
                            <div
                                className={`mb-4 rounded-lg p-3 text-sm ${saveMessage.includes("berhasil")
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-700"
                                    }`}
                            >
                                {saveMessage}
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                        Informasi Profil
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                                {profileForm.name.charAt(0)}
                                            </div>
                                            <div>
                                                <Button variant="outline" size="sm">
                                                    Ubah Foto
                                                </Button>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    JPG, PNG. Max 2MB
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Nama Lengkap"
                                                value={profileForm.name}
                                                onChange={(e) =>
                                                    setProfileForm({ ...profileForm, name: e.target.value })
                                                }
                                            />
                                            <Input
                                                label="Email"
                                                type="email"
                                                value={profileForm.email}
                                                onChange={(e) =>
                                                    setProfileForm({ ...profileForm, email: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="No. Telepon"
                                                value={profileForm.phone}
                                                onChange={(e) =>
                                                    setProfileForm({ ...profileForm, phone: e.target.value })
                                                }
                                            />
                                            <Input
                                                label="Alamat"
                                                value={profileForm.address}
                                                onChange={(e) =>
                                                    setProfileForm({ ...profileForm, address: e.target.value })
                                                }
                                            />
                                        </div>

                                        <Textarea
                                            label="Bio"
                                            placeholder="Ceritakan tentang diri Anda..."
                                            value={profileForm.bio}
                                            onChange={(e) =>
                                                setProfileForm({ ...profileForm, bio: e.target.value })
                                            }
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                        Status Akun
                                    </h3>

                                    <div className="flex items-center justify-between py-3 border-b">
                                        <div>
                                            <p className="font-medium text-slate-900">Role</p>
                                            <p className="text-sm text-slate-500">Tipe akun Anda</p>
                                        </div>
                                        <Badge variant="info">OWNER</Badge>
                                    </div>

                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="font-medium text-slate-900">Verifikasi</p>
                                            <p className="text-sm text-slate-500">Status verifikasi identitas</p>
                                        </div>
                                        <Badge variant="success">Terverifikasi</Badge>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === "notifications" && (
                            <div className="bg-white rounded-xl border p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                    Preferensi Notifikasi
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-medium text-slate-700 mb-3">Email</h4>
                                        <div className="space-y-3">
                                            {[
                                                { key: "emailPayment", label: "Pembayaran masuk" },
                                                { key: "emailBooking", label: "Booking baru" },
                                                { key: "emailMessage", label: "Pesan baru" },
                                            ].map((item) => (
                                                <label
                                                    key={item.key}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span className="text-slate-600">{item.label}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications[item.key as keyof typeof notifications]}
                                                        onChange={(e) =>
                                                            setNotifications({
                                                                ...notifications,
                                                                [item.key]: e.target.checked,
                                                            })
                                                        }
                                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="font-medium text-slate-700 mb-3">Push Notification</h4>
                                        <div className="space-y-3">
                                            {[
                                                { key: "pushPayment", label: "Pembayaran masuk" },
                                                { key: "pushBooking", label: "Booking baru" },
                                                { key: "pushMessage", label: "Pesan baru" },
                                            ].map((item) => (
                                                <label
                                                    key={item.key}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span className="text-slate-600">{item.label}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications[item.key as keyof typeof notifications]}
                                                        onChange={(e) =>
                                                            setNotifications({
                                                                ...notifications,
                                                                [item.key]: e.target.checked,
                                                            })
                                                        }
                                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                        Ubah Password
                                    </h3>

                                    <div className="space-y-4">
                                        <Input
                                            label="Password Lama"
                                            type="password"
                                            placeholder="••••••••"
                                        />
                                        <Input
                                            label="Password Baru"
                                            type="password"
                                            placeholder="••••••••"
                                        />
                                        <Input
                                            label="Konfirmasi Password"
                                            type="password"
                                            placeholder="••••••••"
                                        />
                                        <Button>Ubah Password</Button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                        Two-Factor Authentication
                                    </h3>

                                    <p className="text-slate-600 mb-4">
                                        Tambahkan lapisan keamanan ekstra dengan mengaktifkan 2FA.
                                    </p>

                                    <Button variant="outline">Aktifkan 2FA</Button>
                                </div>
                            </div>
                        )}

                        {/* Billing Tab */}
                        {activeTab === "billing" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                        Paket Langganan
                                    </h3>

                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-slate-900">Paket Pro</p>
                                            <p className="text-sm text-slate-600">
                                                Rp 150.000/bulan • Berlaku hingga 1 Jan 2026
                                            </p>
                                        </div>
                                        <Badge variant="success">Aktif</Badge>
                                    </div>

                                    <div className="mt-4 flex gap-3">
                                        <Button variant="outline">Upgrade Paket</Button>
                                        <Button variant="ghost">Lihat Riwayat</Button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                        Metode Pembayaran
                                    </h3>

                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-14 bg-slate-100 rounded flex items-center justify-center text-xs font-bold">
                                                VISA
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">•••• •••• •••• 4242</p>
                                                <p className="text-sm text-slate-500">Exp: 12/25</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            Ubah
                                        </Button>
                                    </div>

                                    <Button variant="outline" className="mt-4">
                                        + Tambah Metode
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
