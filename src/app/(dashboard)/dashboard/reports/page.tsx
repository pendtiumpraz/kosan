"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Sidebar";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button, Badge, Select } from "@/components/ui/FormElements";
import { AlertTriangle, Eye, CheckCircle, XCircle, MessageSquare } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface Report {
    id: string;
    reportType: string;
    description: string;
    status: string;
    submitter: {
        id: string;
        name: string;
    };
    targetUser?: {
        id: string;
        name: string;
    };
    targetListing?: {
        id: string;
        title: string;
    };
    createdAt: string;
    reviewedAt: string | null;
}

const reportTypes = [
    { value: "FAKE_LISTING", label: "Listing Palsu" },
    { value: "FRAUD", label: "Penipuan" },
    { value: "SPAM", label: "Spam" },
    { value: "INAPPROPRIATE", label: "Konten Tidak Pantas" },
    { value: "OTHER", label: "Lainnya" },
];

const reportStatuses = [
    { value: "PENDING", label: "Menunggu" },
    { value: "REVIEWING", label: "Ditinjau" },
    { value: "RESOLVED", label: "Selesai" },
    { value: "DISMISSED", label: "Ditolak" },
];

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Filters
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // Mock data for demo
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setReports([
                {
                    id: "1",
                    reportType: "FAKE_LISTING",
                    description: "Gambar tidak sesuai dengan kondisi asli properti. Saya sudah datang ke lokasi dan sangat berbeda.",
                    status: "PENDING",
                    submitter: { id: "u1", name: "Ahmad Rizki" },
                    targetListing: { id: "l1", title: "Kos Mewah Jakarta Selatan" },
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    reviewedAt: null,
                },
                {
                    id: "2",
                    reportType: "FRAUD",
                    description: "User ini meminta uang muka tapi tidak pernah memberikan kunci kamar.",
                    status: "REVIEWING",
                    submitter: { id: "u2", name: "Sarah Dewi" },
                    targetUser: { id: "u3", name: "Budi Santoso" },
                    createdAt: new Date(Date.now() - 172800000).toISOString(),
                    reviewedAt: null,
                },
                {
                    id: "3",
                    reportType: "SPAM",
                    description: "Listing duplikat yang sama dipost berkali-kali.",
                    status: "RESOLVED",
                    submitter: { id: "u4", name: "Rina Wati" },
                    targetListing: { id: "l2", title: "Kontrakan Murah Bandung" },
                    createdAt: new Date(Date.now() - 604800000).toISOString(),
                    reviewedAt: new Date(Date.now() - 432000000).toISOString(),
                },
            ]);
            setTotal(3);
            setIsLoading(false);
        }, 500);
    }, [page, filterType, filterStatus]);

    const handleSort = (key: string, order: "asc" | "desc") => {
        setSortBy(key);
        setSortOrder(order);
    };

    const handleUpdateStatus = async (report: Report, newStatus: string) => {
        // In real app, would call API
        alert(`Status report ${report.id} diubah menjadi ${newStatus}`);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTypeBadge = (type: string) => {
        const variants: Record<string, "danger" | "warning" | "info" | "default"> = {
            FAKE_LISTING: "danger",
            FRAUD: "danger",
            SPAM: "warning",
            INAPPROPRIATE: "warning",
            OTHER: "default",
        };
        const labels: Record<string, string> = {
            FAKE_LISTING: "Listing Palsu",
            FRAUD: "Penipuan",
            SPAM: "Spam",
            INAPPROPRIATE: "Konten Tidak Pantas",
            OTHER: "Lainnya",
        };
        return <Badge variant={variants[type] || "default"}>{labels[type] || type}</Badge>;
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "success" | "warning" | "info" | "default"> = {
            PENDING: "warning",
            REVIEWING: "info",
            RESOLVED: "success",
            DISMISSED: "default",
        };
        const labels: Record<string, string> = {
            PENDING: "Menunggu",
            REVIEWING: "Ditinjau",
            RESOLVED: "Selesai",
            DISMISSED: "Ditolak",
        };
        return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
    };

    // Table columns
    const columns: Column<Report>[] = [
        {
            key: "reportType",
            header: "Laporan",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        {getTypeBadge(row.reportType)}
                        <p className="text-xs text-slate-500 mt-1">
                            {row.targetListing ? `Listing: ${row.targetListing.title}` :
                                row.targetUser ? `User: ${row.targetUser.name}` : "-"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "description",
            header: "Deskripsi",
            render: (row) => (
                <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">
                    {row.description}
                </p>
            ),
        },
        {
            key: "submitter.name",
            header: "Pelapor",
            render: (row) => (
                <span className="text-sm font-medium text-slate-900">
                    {row.submitter.name}
                </span>
            ),
        },
        {
            key: "createdAt",
            header: "Tanggal",
            sortable: true,
            render: (row) => (
                <span className="text-sm text-slate-600">{formatDate(row.createdAt)}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (row) => (
                <div className="flex items-center gap-2">
                    {getStatusBadge(row.status)}
                    {row.status === "PENDING" && (
                        <div className="flex gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(row, "REVIEWING");
                                }}
                                className="rounded p-1 text-blue-600 hover:bg-blue-50"
                                title="Tinjau"
                            >
                                <Eye className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    {row.status === "REVIEWING" && (
                        <div className="flex gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(row, "RESOLVED");
                                }}
                                className="rounded p-1 text-emerald-600 hover:bg-emerald-50"
                                title="Selesaikan"
                            >
                                <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(row, "DISMISSED");
                                }}
                                className="rounded p-1 text-slate-600 hover:bg-slate-100"
                                title="Tolak"
                            >
                                <XCircle className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    // Stats
    const pendingCount = reports.filter((r) => r.status === "PENDING").length;
    const reviewingCount = reports.filter((r) => r.status === "REVIEWING").length;

    return (
        <div className="min-h-screen">
            <Header
                title="Manajemen Laporan"
                subtitle={`${total} laporan total • ${pendingCount} menunggu • ${reviewingCount} ditinjau`}
            />

            <div className="p-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Menunggu", count: pendingCount, color: "amber" },
                        { label: "Ditinjau", count: reviewingCount, color: "blue" },
                        { label: "Selesai", count: reports.filter((r) => r.status === "RESOLVED").length, color: "emerald" },
                        { label: "Ditolak", count: reports.filter((r) => r.status === "DISMISSED").length, color: "slate" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className={`p-4 rounded-xl border bg-${stat.color}-50 border-${stat.color}-200`}
                        >
                            <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                            <p className="text-sm text-slate-600">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="mb-4 flex flex-wrap gap-3">
                    <Select
                        options={[
                            { value: "", label: "Semua Tipe" },
                            ...reportTypes,
                        ]}
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            setPage(1);
                        }}
                        className="w-48"
                    />
                    <Select
                        options={[
                            { value: "", label: "Semua Status" },
                            ...reportStatuses,
                        ]}
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setPage(1);
                        }}
                        className="w-40"
                    />
                </div>

                <DataTable
                    data={reports}
                    columns={columns}
                    isLoading={isLoading}
                    page={page}
                    limit={10}
                    total={total}
                    onPageChange={setPage}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    emptyMessage="Tidak ada laporan ditemukan."
                />
            </div>
        </div>
    );
}
