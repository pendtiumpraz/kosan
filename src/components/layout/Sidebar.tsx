"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    Home,
    Building2,
    DoorOpen,
    Users,
    CreditCard,
    ShoppingBag,
    MessageSquare,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Bell,
    Flag,
    BarChart3,
    UserCog,
    Heart,
    FileText,
    Crown,
    Shield,
    CalendarCheck
} from "lucide-react";

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: string[];
    badge?: string;
}

// Menu berdasarkan role sesuai requirement
const navItems: NavItem[] = [
    // === SEMUA ROLE ===
    { href: "/dashboard", label: "Dashboard", icon: Home, roles: ["SUPER_ADMIN", "ADMIN", "OWNER", "AGENT", "TENANT", "USER"] },
    
    // === SUPER_ADMIN & ADMIN ===
    { href: "/dashboard/users", label: "Kelola Users", icon: UserCog, roles: ["SUPER_ADMIN", "ADMIN"] },
    { href: "/dashboard/reports", label: "Laporan & Report", icon: Flag, roles: ["SUPER_ADMIN", "ADMIN"] },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, roles: ["SUPER_ADMIN", "ADMIN"] },
    { href: "/dashboard/subscription", label: "Kelola Paket", icon: Crown, roles: ["SUPER_ADMIN"] },
    
    // === OWNER & AGENT ===
    { href: "/dashboard/properties", label: "Properti Saya", icon: Building2, roles: ["OWNER", "AGENT"] },
    { href: "/dashboard/rooms", label: "Kamar", icon: DoorOpen, roles: ["OWNER", "AGENT"] },
    { href: "/dashboard/residents", label: "Penghuni", icon: Users, roles: ["OWNER", "AGENT"] },
    { href: "/dashboard/payments", label: "Pembayaran", icon: CreditCard, roles: ["OWNER", "AGENT"] },
    { href: "/dashboard/listings", label: "Listing Saya", icon: ShoppingBag, roles: ["OWNER", "AGENT"] },
    
    // === TENANT ===
    { href: "/dashboard/my-rental", label: "Sewa Saya", icon: Home, roles: ["TENANT"] },
    { href: "/dashboard/my-payments", label: "Tagihan Saya", icon: FileText, roles: ["TENANT"] },
    { href: "/dashboard/bookings", label: "Booking Saya", icon: CalendarCheck, roles: ["TENANT", "USER"] },
    
    // === USER (Pembeli/Pencari) ===
    { href: "/dashboard/favorites", label: "Favorit", icon: Heart, roles: ["USER", "TENANT"] },
    
    // === CHAT - Semua kecuali USER ===
    { href: "/dashboard/chats", label: "Chat", icon: MessageSquare, roles: ["SUPER_ADMIN", "ADMIN", "OWNER", "AGENT", "TENANT"] },
    
    // === SETTINGS - Semua ===
    { href: "/dashboard/settings", label: "Pengaturan", icon: Settings, roles: ["SUPER_ADMIN", "ADMIN", "OWNER", "AGENT", "TENANT", "USER"] },
];

interface SidebarProps {
    userRole?: string;
    userName?: string;
    userAvatar?: string;
}

// Role labels untuk display
const roleLabels: Record<string, { label: string; color: string }> = {
    SUPER_ADMIN: { label: "Super Admin", color: "bg-red-500" },
    ADMIN: { label: "Admin", color: "bg-orange-500" },
    OWNER: { label: "Pemilik", color: "bg-blue-500" },
    AGENT: { label: "Agent", color: "bg-purple-500" },
    TENANT: { label: "Penghuni", color: "bg-green-500" },
    USER: { label: "User", color: "bg-slate-500" },
};

export function Sidebar({ userRole = "OWNER", userName = "User", userAvatar }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));
    
    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({ callbackUrl: "/login" });
    };
    
    const roleInfo = roleLabels[userRole] || roleLabels.USER;

    return (
        <aside
            className={`
        fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-64"}
      `}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
                {!isCollapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">KosanHub</span>
                    </Link>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="rounded-lg p-1.5 hover:bg-slate-800"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-2 py-4">
                {filteredNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5
                transition-colors duration-200
                ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }
                ${isCollapsed ? "justify-center" : ""}
              `}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-4">
                <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
                    <div className="relative h-10 w-10 flex-shrink-0">
                        <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5">
                            <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center">
                                {userAvatar ? (
                                    <img src={userAvatar} alt={userName} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-sm font-bold text-white">{userName.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ${roleInfo.color} border-2 border-slate-900`} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-white">{userName}</p>
                            <p className={`text-xs font-medium truncate ${roleInfo.color} bg-opacity-20 text-slate-300`}>
                                {roleInfo.label}
                            </p>
                        </div>
                    )}
                    {!isCollapsed && (
                        <button 
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Logout"
                        >
                            <LogOut className={`h-5 w-5 ${isLoggingOut ? "animate-spin" : ""}`} />
                        </button>
                    )}
                </div>
                {isCollapsed && (
                    <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="mt-3 w-full rounded-lg p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5 mx-auto" />
                    </button>
                )}
            </div>
        </aside>
    );
}

// Header component
interface HeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
            <div>
                <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                </button>
                {actions}
            </div>
        </header>
    );
}
