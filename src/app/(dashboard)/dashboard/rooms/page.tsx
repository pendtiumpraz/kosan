"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Sidebar";
import { CrudPanel } from "@/components/layout/RightPanel";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button, Badge, Input, Select } from "@/components/ui/FormElements";
import { Plus, DoorOpen } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface Property {
    id: string;
    name: string;
}

interface Room {
    id: string;
    name: string;
    floor: number;
    roomSize: number | null;
    priceMonthly: number | null;
    priceDaily: number | null;
    priceYearly: number | null;
    deposit: number | null;
    status: string;
    property: Property;
    _count?: {
        residents: number;
    };
    createdAt: string;
}

interface RoomFormData {
    propertyId: string;
    name: string;
    floor: number;
    roomSize: number | null;
    priceMonthly: number | null;
    priceDaily: number | null;
    priceYearly: number | null;
    deposit: number | null;
    status: string;
}

const roomStatuses = [
    { value: "AVAILABLE", label: "Tersedia" },
    { value: "OCCUPIED", label: "Terisi" },
    { value: "RESERVED", label: "Dipesan" },
    { value: "MAINTENANCE", label: "Perbaikan" },
];

const initialFormData: RoomFormData = {
    propertyId: "",
    name: "",
    floor: 1,
    roomSize: null,
    priceMonthly: null,
    priceDaily: null,
    priceYearly: null,
    deposit: null,
    status: "AVAILABLE",
};

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function RoomsPage() {
    // State
    const [rooms, setRooms] = useState<Room[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Filters
    const [filterPropertyId, setFilterPropertyId] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // Panel state
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [formData, setFormData] = useState<RoomFormData>(initialFormData);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch properties for dropdown
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

    // Fetch rooms
    const fetchRooms = async () => {
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

            const res = await fetch(`/api/rooms?${params}`);
            const data = await res.json();

            if (data.success) {
                setRooms(data.data);
                setTotal(data.meta?.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        fetchRooms();
    }, [page, sortBy, sortOrder, filterPropertyId, filterStatus]);

    // Handlers
    const handleCreate = () => {
        setFormData({
            ...initialFormData,
            propertyId: filterPropertyId || (properties[0]?.id || ""),
        });
        setSelectedId(null);
        setPanelMode("create");
        setErrors({});
        setPanelOpen(true);
    };

    const handleEdit = async (room: Room) => {
        try {
            const res = await fetch(`/api/rooms/${room.id}`);
            const data = await res.json();

            if (data.success) {
                setFormData({
                    propertyId: data.data.property.id,
                    name: data.data.name || "",
                    floor: data.data.floor || 1,
                    roomSize: data.data.roomSize,
                    priceMonthly: data.data.priceMonthly ? Number(data.data.priceMonthly) : null,
                    priceDaily: data.data.priceDaily ? Number(data.data.priceDaily) : null,
                    priceYearly: data.data.priceYearly ? Number(data.data.priceYearly) : null,
                    deposit: data.data.deposit ? Number(data.data.deposit) : null,
                    status: data.data.status || "AVAILABLE",
                });
                setSelectedId(room.id);
                setPanelMode("edit");
                setErrors({});
                setPanelOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch room:", error);
        }
    };

    const handleSave = async () => {
        // Validate
        const newErrors: Record<string, string> = {};
        if (!formData.propertyId) newErrors.propertyId = "Properti wajib dipilih";
        if (!formData.name) newErrors.name = "Nama kamar wajib diisi";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSaving(true);
        try {
            const url = panelMode === "create"
                ? "/api/rooms"
                : `/api/rooms/${selectedId}`;

            const payload = {
                ...formData,
                priceMonthly: formData.priceMonthly || undefined,
                priceDaily: formData.priceDaily || undefined,
                priceYearly: formData.priceYearly || undefined,
                deposit: formData.deposit || undefined,
                roomSize: formData.roomSize || undefined,
            };

            const res = await fetch(url, {
                method: panelMode === "create" ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                setPanelOpen(false);
                fetchRooms();
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

        if (!confirm("Apakah Anda yakin ingin menghapus kamar ini?")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/rooms/${selectedId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                setPanelOpen(false);
                fetchRooms();
            } else {
                alert(data.error?.message || "Gagal menghapus");
            }
        } catch (error) {
            alert("Terjadi kesalahan");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSort = (key: string, order: "asc" | "desc") => {
        setSortBy(key);
        setSortOrder(order);
    };

    const formatCurrency = (value: number | null) => {
        if (!value) return "-";
        return `Rp ${value.toLocaleString("id-ID")}`;
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "success" | "warning" | "info" | "default"> = {
            AVAILABLE: "success",
            OCCUPIED: "info",
            RESERVED: "warning",
            MAINTENANCE: "default",
        };
        const labels: Record<string, string> = {
            AVAILABLE: "Tersedia",
            OCCUPIED: "Terisi",
            RESERVED: "Dipesan",
            MAINTENANCE: "Perbaikan",
        };
        return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
    };

    // Table columns
    const columns: Column<Room>[] = [
        {
            key: "name",
            header: "Kamar",
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                        <DoorOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-500">Lantai {row.floor}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "property.name",
            header: "Properti",
            render: (row) => (
                <span className="text-slate-700">{row.property.name}</span>
            ),
        },
        {
            key: "priceMonthly",
            header: "Harga/Bulan",
            sortable: true,
            render: (row) => (
                <span className="font-medium text-slate-900">
                    {formatCurrency(row.priceMonthly ? Number(row.priceMonthly) : null)}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (row) => getStatusBadge(row.status),
        },
        {
            key: "_count.residents",
            header: "Penghuni",
            render: (row) => (
                <span className={row._count?.residents ? "text-blue-600 font-medium" : "text-slate-400"}>
                    {row._count?.residents || 0} orang
                </span>
            ),
        },
    ];

    return (
        <div className="min-h-screen">
            <Header
                title="Kamar"
                subtitle={`${total} kamar terdaftar`}
                actions={
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
                        Tambah Kamar
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
                            ...roomStatuses,
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
                    data={rooms}
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
                    onDelete={(r) => handleEdit(r)}
                    emptyMessage="Belum ada kamar. Klik 'Tambah Kamar' untuk memulai."
                />
            </div>

            {/* CRUD Panel */}
            <CrudPanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                title={panelMode === "create" ? "Tambah Kamar" : "Edit Kamar"}
                subtitle={panelMode === "create" ? "Isi informasi kamar baru" : "Update informasi kamar"}
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

                    <Select
                        label="Properti"
                        options={properties.map((p) => ({ value: p.id, label: p.name }))}
                        value={formData.propertyId}
                        onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                        error={errors.propertyId}
                        required
                        disabled={panelMode === "edit"}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nama Kamar"
                            placeholder="Contoh: 1A, 2B, Kamar Depan"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={errors.name}
                            required
                        />
                        <Input
                            label="Lantai"
                            type="number"
                            min={1}
                            value={formData.floor}
                            onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 1 })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Ukuran (m²)"
                            type="number"
                            placeholder="0"
                            value={formData.roomSize || ""}
                            onChange={(e) => setFormData({ ...formData, roomSize: e.target.value ? parseInt(e.target.value) : null })}
                        />
                        <Select
                            label="Status"
                            options={roomStatuses}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        />
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Harga Sewa</h4>

                        <div className="space-y-4">
                            <Input
                                label="Harga per Bulan"
                                type="number"
                                placeholder="0"
                                value={formData.priceMonthly || ""}
                                onChange={(e) => setFormData({ ...formData, priceMonthly: e.target.value ? parseInt(e.target.value) : null })}
                                helperText="Harga utama untuk kos bulanan"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Harga per Hari"
                                    type="number"
                                    placeholder="0"
                                    value={formData.priceDaily || ""}
                                    onChange={(e) => setFormData({ ...formData, priceDaily: e.target.value ? parseInt(e.target.value) : null })}
                                />
                                <Input
                                    label="Harga per Tahun"
                                    type="number"
                                    placeholder="0"
                                    value={formData.priceYearly || ""}
                                    onChange={(e) => setFormData({ ...formData, priceYearly: e.target.value ? parseInt(e.target.value) : null })}
                                />
                            </div>

                            <Input
                                label="Deposit"
                                type="number"
                                placeholder="0"
                                value={formData.deposit || ""}
                                onChange={(e) => setFormData({ ...formData, deposit: e.target.value ? parseInt(e.target.value) : null })}
                                helperText="Jumlah uang jaminan"
                            />
                        </div>
                    </div>
                </div>
            </CrudPanel>
        </div>
    );
}
