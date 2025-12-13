"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Home, Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle, Loader2, CheckCircle } from "lucide-react";

const roles = [
    { value: "USER", label: "Pencari Kos / Pembeli", desc: "Cari kos, kontrakan, atau beli properti", icon: "🔍" },
    { value: "OWNER", label: "Pemilik Properti", desc: "Kelola dan sewakan properti Anda", icon: "🏠" },
];

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "USER",
        // Owner fields
        businessName: "",
        businessAddress: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        setError("");
    };

    const validateStep1 = () => {
        if (!formData.name.trim()) {
            setError("Nama lengkap wajib diisi");
            return false;
        }
        if (!formData.email.trim()) {
            setError("Email wajib diisi");
            return false;
        }
        if (!formData.phone.trim()) {
            setError("Nomor HP wajib diisi");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (formData.password.length < 8) {
            setError("Password minimal 8 karakter");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Password tidak cocok");
            return false;
        }
        // Validate owner fields
        if (formData.role === "OWNER") {
            if (!formData.businessName.trim()) {
                setError("Nama usaha/properti wajib diisi");
                return false;
            }
            if (!formData.businessAddress.trim() || formData.businessAddress.length < 10) {
                setError("Alamat properti minimal 10 karakter");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            if (validateStep1()) setStep(2);
            return;
        }

        if (!validateStep2()) return;

        setIsLoading(true);
        setError("");

        try {
            const payload: Record<string, string> = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: formData.role,
            };

            // Add owner fields
            if (formData.role === "OWNER") {
                payload.businessName = formData.businessName;
                payload.businessAddress = formData.businessAddress;
            }

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || "Gagal mendaftar");
            }

            // Redirect to login
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"
                    alt="Beautiful home"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 to-blue-700/80" />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">Bergabung dengan KosanHub</h2>
                        <p className="text-lg text-white/80 max-w-md">
                            Platform terpercaya untuk cari dan kelola properti. Gratis, mudah, dan aman.
                        </p>

                        {/* Features */}
                        <div className="mt-10 space-y-4 text-left max-w-sm mx-auto">
                            {[
                                "Listing terverifikasi",
                                "Chat langsung dengan pemilik",
                                "Pembayaran aman & tercatat",
                            ].map((feature) => (
                                <div key={feature} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Home className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            KosanHub
                        </span>
                    </Link>

                    {/* Progress */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className={`flex-1 h-1 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-slate-200"}`} />
                        <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-slate-200"}`} />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        {step === 1 ? "Buat Akun Baru" : "Lengkapi Pendaftaran"}
                    </h1>
                    <p className="text-slate-600 mb-8">
                        {step === 1 ? "Isi data diri Anda" : "Pilih role dan buat password"}
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            placeholder="nama@email.com"
                                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nomor HP</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleChange("phone", e.target.value)}
                                            placeholder="08123456789"
                                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Role Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Daftar Sebagai</label>
                                    <div className="space-y-2">
                                        {roles.map((role) => (
                                            <label
                                                key={role.value}
                                                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${formData.role === role.value
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-slate-200 hover:border-blue-300"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={role.value}
                                                    checked={formData.role === role.value}
                                                    onChange={(e) => handleChange("role", e.target.value)}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <div>
                                                    <div className="font-medium text-slate-900">{role.label}</div>
                                                    <div className="text-sm text-slate-500">{role.desc}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => handleChange("password", e.target.value)}
                                            placeholder="Minimal 8 karakter"
                                            className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                            placeholder="Ulangi password"
                                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Owner Additional Fields */}
                                {formData.role === "OWNER" && (
                                    <>
                                        <div className="pt-4 border-t border-slate-200">
                                            <p className="text-sm font-medium text-slate-700 mb-4">Informasi Properti</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Usaha / Properti</label>
                                            <input
                                                type="text"
                                                value={formData.businessName}
                                                onChange={(e) => handleChange("businessName", e.target.value)}
                                                placeholder="Contoh: Kos Melati Indah"
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Alamat Properti</label>
                                            <textarea
                                                value={formData.businessAddress}
                                                onChange={(e) => handleChange("businessAddress", e.target.value)}
                                                placeholder="Alamat lengkap properti Anda"
                                                rows={2}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                            />
                                        </div>
                                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                            <p className="text-sm text-amber-800">
                                                ⚠️ Akun pemilik properti akan direview oleh admin dalam 1-3 hari kerja sebelum dapat digunakan.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        <div className="flex gap-3">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200"
                                >
                                    Kembali
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Memproses...
                                    </>
                                ) : step === 1 ? (
                                    "Lanjutkan"
                                ) : (
                                    "Daftar"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-sm text-slate-600">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-blue-600 font-medium hover:underline">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
