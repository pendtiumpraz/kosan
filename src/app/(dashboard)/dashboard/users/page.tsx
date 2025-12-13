"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Sidebar";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button, Badge, Input, Select } from "@/components/ui/FormElements";
import { Users, Shield, CheckCircle, XCircle, Search } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    avatar: string | null;
    verificationStatus: string;
    trustScore: number;
    isActive: boolean;
    emailVerifiedAt: string | null;
    createdAt: string;
    lastLoginAt: string | null;
}

const userRoles = [
    { value: "USER", label: "User" },
    { value: "TENANT", label: "Penyewa" },
    { value: "OWNER", label: "Pemilik" },
    { value: "AGENT", label: "Agen" },
    { value: "ADMIN", label: "Admin" },
    { value: "SUPER_ADMIN", label: "Super Admin" },
];

const verificationStatuses = [
    { value: "UNVERIFIED", label: "Belum Verifikasi" },
    { value: "PENDING", label: "Menunggu" },
    { value: "VERIFIED", label: "Terverifikasi" },
    { value: "REJECTED", label: "Ditolak" },
];

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // Fetch users
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: "10",
                sortBy,
                sortOrder,
            });

            if (searchQuery) params.set("search", searchQuery);
            if (filterRole) params.set("role", filterRole);
            if (filterStatus) params.set("verificationStatus", filterStatus);

            const res = await fetch(`/api/users?${params}`);
            const data = await res.json();

            if (data.success) {
                setUsers(data.data);
                setTotal(data.meta?.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, sortBy, sortOrder, searchQuery, filterRole, filterStatus]);

    const handleSort = (key: string, order: "asc" | "desc") => {
        setSortBy(key);
        setSortOrder(order);
    };

    const handleUpdateRole = async (user: User, newRole: string) => {
        if (!confirm(`Ubah role ${user.name} menjadi ${newRole}?`)) return;

        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await res.json();
            if (data.success) {
                fetchUsers();
            } else {
                alert(data.error?.message || "Gagal mengubah role");
            }
        } catch (error) {
            alert("Terjadi kesalahan");
        }
    };

    const handleToggleActive = async (user: User) => {
        const action = user.isActive ? "nonaktifkan" : "aktifkan";
        if (!confirm(`Apakah Anda yakin ingin ${action} user ${user.name}?`)) return;

        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !user.isActive }),
            });

            const data = await res.json();
            if (data.success) {
                fetchUsers();
            } else {
                alert(data.error?.message || `Gagal ${action}`);
            }
        } catch (error) {
            alert("Terjadi kesalahan");
        }
    };

    const handleVerify = async (user: User, status: "VERIFIED" | "REJECTED") => {
        const action = status === "VERIFIED" ? "verifikasi" : "tolak";
        if (!confirm(`${action} user ${user.name}?`)) return;

        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ verificationStatus: status }),
            });

            const data = await res.json();
            if (data.success) {
                fetchUsers();
            } else {
                alert(data.error?.message || `Gagal ${action}`);
            }
        } catch (error) {
            alert("Terjadi kesalahan");
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getRoleBadge = (role: string) => {
        const variants: Record<string, "success" | "info" | "warning" | "default" | "danger"> = {
            SUPER_ADMIN: "danger",
            ADMIN: "warning",
            OWNER: "info",
            AGENT: "info",
            TENANT: "success",
            USER: "default",
        };
        return <Badge variant={variants[role] || "default"}>{role}</Badge>;
    };

    const getVerificationBadge = (status: string) => {
        const variants: Record<string, "success" | "warning" | "danger" | "default"> = {
            VERIFIED: "success",
            PENDING: "warning",
            REJECTED: "danger",
            UNVERIFIED: "default",
        };
        const labels: Record<string, string> = {
            VERIFIED: "Terverifikasi",
            PENDING: "Pending",
            REJECTED: "Ditolak",
            UNVERIFIED: "Belum",
        };
        return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
    };

    // Table columns
    const columns: Column<User>[] = [
        {
            key: "name",
            header: "User",
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                        {row.avatar ? (
                            <img src={row.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                        ) : (
                            row.name.charAt(0)
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{row.name}</p>
                        <p className="text-xs text-slate-500 truncate">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "role",
            header: "Role",
            render: (row) => getRoleBadge(row.role),
        },
        {
            key: "verificationStatus",
            header: "Verifikasi",
            render: (row) => (
                <div className="flex items-center gap-2">
                    {getVerificationBadge(row.verificationStatus)}
                    {row.verificationStatus === "PENDING" && (
                        <div className="flex gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleVerify(row, "VERIFIED");
                                }}
                                className="rounded p-1 text-emerald-600 hover:bg-emerald-50"
                                title="Verifikasi"
                            >
                                <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleVerify(row, "REJECTED");
                                }}
                                className="rounded p-1 text-red-600 hover:bg-red-50"
                                title="Tolak"
                            >
                                <XCircle className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "trustScore",
            header: "Trust Score",
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${row.trustScore >= 80
                                    ? "bg-emerald-500"
                                    : row.trustScore >= 50
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                }`}
                            style={{ width: `${row.trustScore}%` }}
                        />
                    </div>
                    <span className="text-sm text-slate-600">{row.trustScore}</span>
                </div>
            ),
        },
        {
            key: "createdAt",
            header: "Terdaftar",
            sortable: true,
            render: (row) => formatDate(row.createdAt),
        },
        {
            key: "isActive",
            header: "Status",
            render: (row) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(row);
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium ${row.isActive
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                >
                    {row.isActive ? "Aktif" : "Nonaktif"}
                </button>
            ),
        },
    ];

    return (
        <div className="min-h-screen">
            <Header
                title="Manajemen User"
                subtitle={`${total} user terdaftar`}
            />

            <div className="p-6">
                {/* Filters */}
                <div className="mb-4 flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari nama, email..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                            className="pl-9 w-64"
                        />
                    </div>
                    <Select
                        options={[
                            { value: "", label: "Semua Role" },
                            ...userRoles,
                        ]}
                        value={filterRole}
                        onChange={(e) => {
                            setFilterRole(e.target.value);
                            setPage(1);
                        }}
                        className="w-40"
                    />
                    <Select
                        options={[
                            { value: "", label: "Semua Status" },
                            ...verificationStatuses,
                        ]}
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setPage(1);
                        }}
                        className="w-48"
                    />
                </div>

                <DataTable
                    data={users}
                    columns={columns}
                    isLoading={isLoading}
                    page={page}
                    limit={10}
                    total={total}
                    onPageChange={setPage}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    emptyMessage="Tidak ada user ditemukan."
                />
            </div>
        </div>
    );
}
