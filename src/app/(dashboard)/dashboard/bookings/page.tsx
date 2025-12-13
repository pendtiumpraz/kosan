"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Sidebar";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button, Badge, Select } from "@/components/ui/FormElements";
import { Calendar, Check, X, Eye } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface Listing {
    id: string;
    title: string;
    city?: string;
    images?: { imageUrl: string }[];
}

interface User {
    id: string;
    name: string;
    phone: string;
}

interface Booking {
    id: string;
    bookingType: string;
    checkIn: string | null;
    checkOut: string | null;
    guests: number;
    totalPrice: number;
    status: string;
    notes: string | null;
    responseNote: string | null;
    listing: Listing;
    user: User;
    createdAt: string;
}

const bookingStatuses = [
    { value: "PENDING", label: "Menunggu" },
    { value: "CONFIRMED", label: "Dikonfirmasi" },
    { value: "REJECTED", label: "Ditolak" },
    { value: "CANCELLED", label: "Dibatalkan" },
    { value: "COMPLETED", label: "Selesai" },
];

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function BookingsPage() {
    // State
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Filters
    const [filterStatus, setFilterStatus] = useState("");
    const [viewMode, setViewMode] = useState<"received" | "my">("received");

    // Fetch bookings
    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: "10",
                sortBy,
                sortOrder,
            });

            if (viewMode === "received") {
                params.set("scope", "received");
            }
            if (filterStatus) params.set("status", filterStatus);

            const res = await fetch(`/api/bookings?${params}`);
            const data = await res.json();

            if (data.success) {
                setBookings(data.data);
                setTotal(data.meta?.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [page, sortBy, sortOrder, filterStatus, viewMode]);

    // Handlers
    const handleRespond = async (booking: Booking, status: "CONFIRMED" | "REJECTED") => {
        const action = status === "CONFIRMED" ? "konfirmasi" : "tolak";
        if (!confirm(`Apakah Anda yakin ingin ${action} booking ini?`)) return;

        try {
            const res = await fetch(`/api/bookings/${booking.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            const data = await res.json();
            if (data.success) {
                fetchBookings();
            } else {
                alert(data.error?.message || `Gagal ${action}`);
            }
        } catch (error) {
            alert("Terjadi kesalahan");
        }
    };

    const handleSort = (key: string, order: "asc" | "desc") => {
        setSortBy(key);
        setSortOrder(order);
    };

    const formatCurrency = (value: number) => {
        return `Rp ${value.toLocaleString("id-ID")}`;
    };

    const formatDate = (date: string | null) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "success" | "warning" | "danger" | "default" | "info"> = {
            PENDING: "warning",
            CONFIRMED: "success",
            REJECTED: "danger",
            CANCELLED: "default",
            COMPLETED: "info",
        };
        const labels: Record<string, string> = {
            PENDING: "Menunggu",
            CONFIRMED: "Dikonfirmasi",
            REJECTED: "Ditolak",
            CANCELLED: "Dibatalkan",
            COMPLETED: "Selesai",
        };
        return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
    };

    const getBookingTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            RENT: "Sewa",
            VISIT: "Kunjungan",
            PURCHASE: "Pembelian",
        };
        return labels[type] || type;
    };

    // Table columns
    const columns: Column<Booking>[] = [
        {
            key: "listing.title",
            header: "Listing",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        {row.listing.images?.[0] ? (
                            <img src={row.listing.images[0].imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-400">
                                <Calendar className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{row.listing.title}</p>
                        <p className="text-xs text-slate-500">{row.listing.city}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "user.name",
            header: viewMode === "received" ? "Pemesan" : "Tipe",
            render: (row) =>
                viewMode === "received" ? (
                    <div>
                        <p className="font-medium text-slate-900">{row.user.name}</p>
                        <p className="text-xs text-slate-500">{row.user.phone}</p>
                    </div>
                ) : (
                    <Badge variant="info">{getBookingTypeLabel(row.bookingType)}</Badge>
                ),
        },
        {
            key: "checkIn",
            header: "Tanggal",
            render: (row) => (
                <div className="text-sm">
                    <p>{formatDate(row.checkIn)}</p>
                    {row.checkOut && (
                        <p className="text-slate-500">→ {formatDate(row.checkOut)}</p>
                    )}
                </div>
            ),
        },
        {
            key: "totalPrice",
            header: "Total",
            sortable: true,
            render: (row) => (
                <span className="font-medium text-slate-900">
                    {formatCurrency(Number(row.totalPrice))}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (row) => (
                <div className="flex items-center gap-2">
                    {getStatusBadge(row.status)}
                    {viewMode === "received" && row.status === "PENDING" && (
                        <div className="flex gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRespond(row, "CONFIRMED");
                                }}
                                className="rounded p-1 text-emerald-600 hover:bg-emerald-50"
                                title="Konfirmasi"
                            >
                                <Check className="h-4 w-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRespond(row, "REJECTED");
                                }}
                                className="rounded p-1 text-red-600 hover:bg-red-50"
                                title="Tolak"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen">
            <Header
                title="Booking"
                subtitle={`${total} permintaan booking`}
            />

            <div className="p-6">
                {/* View Mode Toggle */}
                <div className="mb-4 flex items-center gap-4">
                    <div className="flex rounded-lg border bg-white p-1">
                        <button
                            onClick={() => {
                                setViewMode("received");
                                setPage(1);
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === "received"
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            Diterima
                        </button>
                        <button
                            onClick={() => {
                                setViewMode("my");
                                setPage(1);
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === "my"
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            Booking Saya
                        </button>
                    </div>

                    <Select
                        options={[
                            { value: "", label: "Semua Status" },
                            ...bookingStatuses,
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
                    data={bookings}
                    columns={columns}
                    isLoading={isLoading}
                    page={page}
                    limit={10}
                    total={total}
                    onPageChange={setPage}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onView={(b) => window.open(`/listings/${b.listing.id}`, "_blank")}
                    emptyMessage={
                        viewMode === "received"
                            ? "Belum ada permintaan booking masuk."
                            : "Anda belum melakukan booking apapun."
                    }
                />
            </div>
        </div>
    );
}
