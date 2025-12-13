"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Sidebar";
import { CrudPanel } from "@/components/layout/RightPanel";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button, Badge, Input, Select, Textarea } from "@/components/ui/FormElements";
import { Plus, CreditCard, CheckCircle } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface Property {
    id: string;
    name: string;
}

interface Resident {
    id: string;
    fullName: string;
}

interface Payment {
    id: string;
    paymentType: string;
    amount: number;
    periodStart: string | null;
    periodEnd: string | null;
    dueDate: string | null;
    paidDate: string | null;
    paymentMethod: string | null;
    status: string;
    resident: Resident;
    property: Property;
    createdAt: string;
}

interface PaymentFormData {
    residentId: string;
    propertyId: string;
    paymentType: string;
    amount: number;
    periodStart: string;
    periodEnd: string;
    dueDate: string;
    paymentMethod: string;
    notes: string;
    // For edit
    status: string;
}

const paymentTypes = [
    { value: "RENT", label: "Sewa Bulanan" },
    { value: "DEPOSIT", label: "Deposit" },
    { value: "UTILITY", label: "Utilitas (Listrik/Air)" },
    { value: "OTHER", label: "Lainnya" },
];

const paymentMethods = [
    { value: "CASH", label: "Tunai" },
    { value: "BANK_TRANSFER", label: "Transfer Bank" },
    { value: "EWALLET", label: "E-Wallet" },
    { value: "CARD", label: "Kartu Kredit/Debit" },
    { value: "VIRTUAL_ACCOUNT", label: "Virtual Account" },
];

const paymentStatuses = [
    { value: "PENDING", label: "Menunggu" },
    { value: "PAID", label: "Lunas" },
    { value: "OVERDUE", label: "Jatuh Tempo" },
    { value: "CANCELLED", label: "Dibatalkan" },
];

const initialFormData: PaymentFormData = {
    residentId: "",
    propertyId: "",
    paymentType: "RENT",
    amount: 0,
    periodStart: "",
    periodEnd: "",
    dueDate: "",
    paymentMethod: "",
    notes: "",
    status: "PENDING",
};

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function PaymentsPage() {
    // State
    const [payments, setPayments] = useState<Payment[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [residents, setResidents] = useState<Resident[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Filters
    const [filterPropertyId, setFilterPropertyId] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterType, setFilterType] = useState("");

    // Panel state
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [formData, setFormData] = useState<PaymentFormData>(initialFormData);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch properties
    const fetchProperties = async () => {
        try {
            const res = await fetch("/api/properties?limit=100");
            const data = await res.json();
            if (data.success) {
                setProperties(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        }
    };

    // Fetch residents for selected property
    const fetchResidents = async (propertyId: string) => {
        if (!propertyId) {
            setResidents([]);
            return;
        }
        try {
            const res = await fetch(`/api/residents?propertyId=${propertyId}&status=ACTIVE&limit=100`);
            const data = await res.json();
            if (data.success) {
                setResidents(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch residents:", error);
        }
    };

    // Fetch payments
    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: "10",
                sortBy,
                sortOrder,
            });

            if (filterPropertyId) params.set("propertyId", filterPropertyId);
            if (filterStatus) params.set("status", filterStatus);
            if (filterType) params.set("paymentType", filterType);

            const res = await fetch(`/api/payments?${params}`);
            const data = await res.json();

            if (data.success) {
                setPayments(data.data);
                setTotal(data.meta?.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch payments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [page, sortBy, sortOrder, filterPropertyId, filterStatus, filterType]);

    useEffect(() => {
        if (formData.propertyId) {
            fetchResidents(formData.propertyId);
        }
    }, [formData.propertyId]);

    // Handlers
    const handleCreate = () => {
        const defaultPropertyId = filterPropertyId || (properties[0]?.id || "");
        setFormData({
            ...initialFormData,
            propertyId: defaultPropertyId,
        });
        if (defaultPropertyId) {
            fetchResidents(defaultPropertyId);
        }
        setSelectedId(null);
        setPanelMode("create");
        setErrors({});
        setPanelOpen(true);
    };

    const handleEdit = async (payment: Payment) => {
        try {
            const res = await fetch(`/api/payments/${payment.id}`);
            const data = await res.json();

            if (data.success) {
                const p = data.data;
                await fetchResidents(p.property.id);
                setFormData({
                    residentId: p.resident.id,
                    propertyId: p.property.id,
                    paymentType: p.paymentType,
                    amount: Number(p.amount),
                    periodStart: p.periodStart ? new Date(p.periodStart).toISOString().split("T")[0] : "",
                    periodEnd: p.periodEnd ? new Date(p.periodEnd).toISOString().split("T")[0] : "",
                    dueDate: p.dueDate ? new Date(p.dueDate).toISOString().split("T")[0] : "",
                    paymentMethod: p.paymentMethod || "",
                    notes: p.notes || "",
                    status: p.status,
                });
                setSelectedId(payment.id);
                setPanelMode("edit");
                setErrors({});
                setPanelOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch payment:", error);
        }
    };

    const handleSave = async () => {
        // Validate
        const newErrors: Record<string, string> = {};
        if (!formData.propertyId) newErrors.propertyId = "Properti wajib dipilih";
        if (!formData.residentId) newErrors.residentId = "Penghuni wajib dipilih";
        if (!formData.amount || formData.amount <= 0) newErrors.amount = "Jumlah wajib diisi";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSaving(true);
        try {
            const url = panelMode === "create"
                ? "/api/payments"
                : `/api/payments/${selectedId}`;

            let payload: Record<string, unknown>;

            if (panelMode === "create") {
                payload = {
                    residentId: formData.residentId,
                    propertyId: formData.propertyId,
                    paymentType: formData.paymentType,
                    amount: formData.amount,
                    periodStart: formData.periodStart ? new Date(formData.periodStart) : undefined,
                    periodEnd: formData.periodEnd ? new Date(formData.periodEnd) : undefined,
                    dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
                    paymentMethod: formData.paymentMethod || undefined,
                    notes: formData.notes || undefined,
                };
            } else {
                // For update, only send editable fields
                payload = {
                    status: formData.status,
                    paymentMethod: formData.paymentMethod || undefined,
                    notes: formData.notes || undefined,
                };
            }

            const res = await fetch(url, {
                method: panelMode === "create" ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                setPanelOpen(false);
                fetchPayments();
            } else {
                setErrors({ _form: data.error?.message || "Gagal menyimpan" });
            }
        } catch (error) {
            setErrors({ _form: "Terjadi kesalahan" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;

        if (!confirm("Apakah Anda yakin ingin menghapus pembayaran ini?")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/payments/${selectedId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                setPanelOpen(false);
                fetchPayments();
            } else {
                alert(data.error?.message || "Gagal menghapus");
            }
        } catch (error) {
            alert("Terjadi kesalahan");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleVerify = async (payment: Payment) => {
        if (!confirm(`Konfirmasi pembayaran dari ${payment.resident.fullName}?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/payments/${payment.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "PAID" }),
            });

            const data = await res.json();

            if (data.success) {
                fetchPayments();
            } else {
                alert(data.error?.message || "Gagal mengkonfirmasi");
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
        const variants: Record<string, "success" | "warning" | "danger" | "default"> = {
            PENDING: "warning",
            PAID: "success",
            OVERDUE: "danger",
            CANCELLED: "default",
        };
        const labels: Record<string, string> = {
            PENDING: "Menunggu",
            PAID: "Lunas",
            OVERDUE: "Jatuh Tempo",
            CANCELLED: "Dibatalkan",
        };
        return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            RENT: "Sewa",
            DEPOSIT: "Deposit",
            UTILITY: "Utilitas",
            OTHER: "Lainnya",
        };
        return labels[type] || type;
    };

    // Table columns
    const columns: Column<Payment>[] = [
        {
            key: "resident.fullName",
            header: "Penghuni",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">{row.resident.fullName}</p>
                        <p className="text-xs text-slate-500">{row.property.name}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "paymentType",
            header: "Jenis",
            render: (row) => (
                <Badge variant="info">{getTypeLabel(row.paymentType)}</Badge>
            ),
        },
        {
            key: "amount",
            header: "Jumlah",
            sortable: true,
            render: (row) => (
                <span className="font-medium text-slate-900">
                    {formatCurrency(Number(row.amount))}
                </span>
            ),
        },
        {
            key: "dueDate",
            header: "Jatuh Tempo",
            sortable: true,
            render: (row) => formatDate(row.dueDate),
        },
        {
            key: "status",
            header: "Status",
            render: (row) => (
                <div className="flex items-center gap-2">
                    {getStatusBadge(row.status)}
                    {row.status === "PENDING" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleVerify(row);
                            }}
                            className="rounded p-1 text-emerald-600 hover:bg-emerald-50"
                            title="Konfirmasi Pembayaran"
                        >
                            <CheckCircle className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen">
            <Header
                title="Pembayaran"
                subtitle={`${total} pembayaran tercatat`}
                actions={
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
                        Tambah Pembayaran
                    </Button>
                }
            />

            <div className="p-6">
                {/* Filters */}
                <div className="mb-4 flex flex-wrap gap-3">
                    <Select
                        options={[
                            { value: "", label: "Semua Properti" },
                            ...properties.map((p) => ({ value: p.id, label: p.name })),
                        ]}
                        value={filterPropertyId}
                        onChange={(e) => {
                            setFilterPropertyId(e.target.value);
                            setPage(1);
                        }}
                        className="w-48"
                    />
                    <Select
                        options={[
                            { value: "", label: "Semua Status" },
                            ...paymentStatuses,
                        ]}
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setPage(1);
                        }}
                        className="w-40"
                    />
                    <Select
                        options={[
                            { value: "", label: "Semua Jenis" },
                            ...paymentTypes,
                        ]}
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            setPage(1);
                        }}
                        className="w-48"
                    />
                </div>

                <DataTable
                    data={payments}
                    columns={columns}
                    isLoading={isLoading}
                    page={page}
                    limit={10}
                    total={total}
                    onPageChange={setPage}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onEdit={handleEdit}
                    onDelete={(p) => handleEdit(p)}
                    emptyMessage="Belum ada pembayaran. Klik 'Tambah Pembayaran' untuk membuat tagihan baru."
                />
            </div>

            {/* CRUD Panel */}
            <CrudPanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                title={panelMode === "create" ? "Tambah Pembayaran" : "Detail Pembayaran"}
                subtitle={panelMode === "create" ? "Buat tagihan baru" : "Lihat dan update status"}
                mode={panelMode}
                onSave={handleSave}
                onDelete={handleDelete}
                isSaving={isSaving}
                isDeleting={isDeleting}
                showDelete={panelMode === "edit"}
                width="md"
            >
                <div className="space-y-5">
                    {errors._form && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {errors._form}
                        </div>
                    )}

                    {/* Property & Resident */}
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Properti"
                            options={properties.map((p) => ({ value: p.id, label: p.name }))}
                            value={formData.propertyId}
                            onChange={(e) => setFormData({ ...formData, propertyId: e.target.value, residentId: "" })}
                            error={errors.propertyId}
                            required
                            disabled={panelMode === "edit"}
                        />
                        <Select
                            label="Penghuni"
                            options={[
                                { value: "", label: "- Pilih Penghuni -" },
                                ...residents.map((r) => ({ value: r.id, label: r.fullName })),
                            ]}
                            value={formData.residentId}
                            onChange={(e) => setFormData({ ...formData, residentId: e.target.value })}
                            error={errors.residentId}
                            required
                            disabled={panelMode === "edit"}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Jenis Pembayaran"
                            options={paymentTypes}
                            value={formData.paymentType}
                            onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                            disabled={panelMode === "edit"}
                        />
                        <Input
                            label="Jumlah"
                            type="number"
                            placeholder="0"
                            value={formData.amount || ""}
                            onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                            error={errors.amount}
                            required
                            disabled={panelMode === "edit"}
                        />
                    </div>

                    {panelMode === "create" && (
                        <>
                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium text-slate-700 mb-3">Periode</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Periode Mulai"
                                        type="date"
                                        value={formData.periodStart}
                                        onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                                    />
                                    <Input
                                        label="Periode Akhir"
                                        type="date"
                                        value={formData.periodEnd}
                                        onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                                    />
                                </div>

                                <div className="mt-4">
                                    <Input
                                        label="Tanggal Jatuh Tempo"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Detail Pembayaran</h4>

                        <div className="space-y-4">
                            {panelMode === "edit" && (
                                <Select
                                    label="Status"
                                    options={paymentStatuses}
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                />
                            )}

                            <Select
                                label="Metode Pembayaran"
                                options={[
                                    { value: "", label: "- Pilih Metode -" },
                                    ...paymentMethods,
                                ]}
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            />

                            <Textarea
                                label="Catatan"
                                placeholder="Catatan tambahan..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </CrudPanel>
        </div>
    );
}
