"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    BarChart3
} from "lucide-react";

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: string[];
}

const navItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/properties", label: "Properti", icon: Building2 },
    { href: "/dashboard/rooms", label: "Kamar", icon: DoorOpen },
    { href: "/dashboard/residents", label: "Penghuni", icon: Users },
    { href: "/dashboard/payments", label: "Pembayaran", icon: CreditCard },
    { href: "/dashboard/listings", label: "Listing", icon: ShoppingBag },
    { href: "/dashboard/chats", label: "Chat", icon: MessageSquare },
    { href: "/dashboard/reports", label: "Laporan", icon: Flag, roles: ["SUPER_ADMIN", "ADMIN"] },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, roles: ["SUPER_ADMIN", "ADMIN", "OWNER"] },
    { href: "/dashboard/settings", label: "Pengaturan", icon: Settings },
];

interface SidebarProps {
    userRole?: string;
    userName?: string;
    userAvatar?: string;
}

export function Sidebar({ userRole = "OWNER", userName = "User", userAvatar }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const filteredNavItems = navItems.filter(
        (item) => !item.roles || item.roles.includes(userRole)
    );

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
                    <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        {userAvatar ? (
                            <img src={userAvatar} alt={userName} className="h-full w-full rounded-full object-cover" />
                        ) : (
                            <span className="text-sm font-medium">{userName.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{userName}</p>
                            <p className="text-xs text-slate-400 truncate">{userRole}</p>
                        </div>
                    )}
                    {!isCollapsed && (
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
                            <LogOut className="h-5 w-5" />
                        </button>
                    )}
                </div>
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
