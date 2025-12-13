"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Sidebar";
import { CrudPanel } from "@/components/layout/RightPanel";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button, Badge, Input, Select, Textarea } from "@/components/ui/FormElements";
import { Plus, Users } from "lucide-react";

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
}

interface Resident {
    id: string;
    fullName: string;
    phone: string;
    email: string | null;
    checkInDate: string;
    checkOutDate: string | null;
    rentalPrice: number;
    rentalStatus: string;
    paymentDueDay: number;
    property: Property;
    room: Room | null;
    _count?: {
        payments: number;
    };
}

interface ResidentFormData {
    propertyId: string;
    roomId: string;
    fullName: string;
    ktpNumber: string;
    phone: string;
    email: string;
    gender: string;
    occupation: string;
    originAddress: string;
    emergencyName: string;
    emergencyRelation: string;
    emergencyPhone: string;
    checkInDate: string;
    rentalPrice: number;
    depositAmount: number;
    paymentDueDay: number;
    notes: string;
}

const residentStatuses = [
    { value: "ACTIVE", label: "Aktif" },
    { value: "ENDED", label: "Selesai" },
    { value: "SUSPENDED", label: "Ditangguhkan" },
];

const genderOptions = [
    { value: "MALE", label: "Laki-laki" },
    { value: "FEMALE", label: "Perempuan" },
];

const initialFormData: ResidentFormData = {
    propertyId: "",
    roomId: "",
    fullName: "",
    ktpNumber: "",
    phone: "",
    email: "",
    gender: "",
    occupation: "",
    originAddress: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    checkInDate: new Date().toISOString().split("T")[0],
    rentalPrice: 0,
    depositAmount: 0,
    paymentDueDay: 1,
    notes: "",
};

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ResidentsPage() {
    // State
    const [residents, setResidents] = useState<Resident[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Filters
    const [filterPropertyId, setFilterPropertyId] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Panel state
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [formData, setFormData] = useState<ResidentFormData>(initialFormData);
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

    // Fetch rooms for selected property
    const fetchRooms = async (propertyId: string) => {
        if (!propertyId) {
            setRooms([]);
            return;
        }
        try {
            const res = await fetch(`/api/rooms?propertyId=${propertyId}&limit=100`);
            const data = await res.json();
            if (data.success) {
                setRooms(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        }
    };

    // Fetch residents
    const fetchResidents = async () => {
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
            if (searchQuery) params.set("search", searchQuery);

            const res = await fetch(`/api/residents?${params}`);
            const data = await res.json();

            if (data.success) {
                setResidents(data.data);
                setTotal(data.meta?.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch residents:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        fetchResidents();
    }, [page, sortBy, sortOrder, filterPropertyId, filterStatus, searchQuery]);

    useEffect(() => {
        if (formData.propertyId) {
            fetchRooms(formData.propertyId);
        }
    }, [formData.propertyId]);

    // Handlers
    const handleCreate = () => {
        const defaultPropertyId = filterPropertyId || (properties[0]?.id || "");
        setFormData({
            ...initialFormData,
            propertyId: defaultPropertyId,
            checkInDate: new Date().toISOString().split("T")[0],
        });
        if (defaultPropertyId) {
            fetchRooms(defaultPropertyId);
        }
        setSelectedId(null);
        setPanelMode("create");
        setErrors({});
        setPanelOpen(true);
    };

    const handleEdit = async (resident: Resident) => {
        try {
            const res = await fetch(`/api/residents/${resident.id}`);
            const data = await res.json();

            if (data.success) {
                const r = data.data;
                await fetchRooms(r.property.id);
                setFormData({
                    propertyId: r.property.id,
                    roomId: r.room?.id || "",
                    fullName: r.fullName || "",
                    ktpNumber: r.ktpNumber || "",
                    phone: r.phone || "",
                    email: r.email || "",
                    gender: r.gender || "",
                    occupation: r.occupation || "",
                    originAddress: r.originAddress || "",
                    emergencyName: r.emergencyName || "",
                    emergencyRelation: r.emergencyRelation || "",
                    emergencyPhone: r.emergencyPhone || "",
                    checkInDate: r.checkInDate ? new Date(r.checkInDate).toISOString().split("T")[0] : "",
                    rentalPrice: r.rentalPrice ? Number(r.rentalPrice) : 0,
                    depositAmount: r.depositAmount ? Number(r.depositAmount) : 0,
                    paymentDueDay: r.paymentDueDay || 1,
                    notes: r.notes || "",
                });
                setSelectedId(resident.id);
                setPanelMode("edit");
                setErrors({});
                setPanelOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch resident:", error);
        }
    };

    const handleSave = async () => {
        // Validate
        const newErrors: Record<string, string> = {};
        if (!formData.propertyId) newErrors.propertyId = "Properti wajib dipilih";
        if (!formData.fullName) newErrors.fullName = "Nama lengkap wajib diisi";
        if (!formData.ktpNumber) newErrors.ktpNumber = "NIK wajib diisi";
        if (formData.ktpNumber && formData.ktpNumber.length !== 16) newErrors.ktpNumber = "NIK harus 16 digit";
        if (!formData.phone) newErrors.phone = "No. HP wajib diisi";
        if (!formData.checkInDate) newErrors.checkInDate = "Tanggal masuk wajib diisi";
        if (!formData.rentalPrice || formData.rentalPrice <= 0) newErrors.rentalPrice = "Harga sewa wajib diisi";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSaving(true);
        try {
            const url = panelMode === "create"
                ? "/api/residents"
                : `/api/residents/${selectedId}`;

            const payload: Record<string, unknown> = {
                ...formData,
                roomId: formData.roomId || undefined,
                email: formData.email || undefined,
                gender: formData.gender || undefined,
                occupation: formData.occupation || undefined,
                originAddress: formData.originAddress || undefined,
                emergencyName: formData.emergencyName || undefined,
                emergencyRelation: formData.emergencyRelation || undefined,
                emergencyPhone: formData.emergencyPhone || undefined,
                depositAmount: formData.depositAmount || undefined,
                notes: formData.notes || undefined,
                checkInDate: new Date(formData.checkInDate),
            };

            // Remove propertyId for update
            if (panelMode === "edit") {
                delete payload.propertyId;
            }

            const res = await fetch(url, {
                method: panelMode === "create" ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                setPanelOpen(false);
                fetchResidents();
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

        if (!confirm("Apakah Anda yakin ingin mengakhiri sewa penghuni ini?")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/residents/${selectedId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                setPanelOpen(false);
                fetchResidents();
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

    const formatCurrency = (value: number) => {
        return `Rp ${value.toLocaleString("id-ID")}`;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "success" | "warning" | "default"> = {
            ACTIVE: "success",
            ENDED: "default",
            SUSPENDED: "warning",
        };
        const labels: Record<string, string> = {
            ACTIVE: "Aktif",
            ENDED: "Selesai",
            SUSPENDED: "Ditangguhkan",
        };
        return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
    };

    // Table columns
    const columns: Column<Resident>[] = [
        {
            key: "fullName",
            header: "Penghuni",
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">{row.fullName}</p>
                        <p className="text-xs text-slate-500">{row.phone}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "property.name",
            header: "Properti / Kamar",
            render: (row) => (
                <div>
                    <p className="text-sm text-slate-700">{row.property.name}</p>
                    <p className="text-xs text-slate-500">{row.room?.name || "-"}</p>
                </div>
            ),
        },
        {
            key: "checkInDate",
            header: "Tanggal Masuk",
            sortable: true,
            render: (row) => formatDate(row.checkInDate),
        },
        {
            key: "rentalPrice",
            header: "Harga Sewa",
            sortable: true,
            render: (row) => (
                <span className="font-medium text-slate-900">
                    {formatCurrency(Number(row.rentalPrice))}
                </span>
            ),
        },
        {
            key: "rentalStatus",
            header: "Status",
            render: (row) => getStatusBadge(row.rentalStatus),
        },
    ];

    return (
        <div className="min-h-screen">
            <Header
                title="Penghuni"
                subtitle={`${total} penghuni terdaftar`}
                actions={
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
                        Tambah Penghuni
                    </Button>
                }
            />

            <div className="p-6">
                {/* Filters */}
                <div className="mb-4 flex flex-wrap gap-3">
                    <Input
                        placeholder="Cari nama, HP, email..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                        className="w-64"
                    />
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
                            ...residentStatuses,
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
                    data={residents}
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
                    emptyMessage="Belum ada penghuni. Klik 'Tambah Penghuni' untuk memulai."
                />
            </div>

            {/* CRUD Panel */}
            <CrudPanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                title={panelMode === "create" ? "Tambah Penghuni" : "Edit Penghuni"}
                subtitle={panelMode === "create" ? "Isi data penghuni baru" : "Update data penghuni"}
                mode={panelMode}
                onSave={handleSave}
                onDelete={handleDelete}
                isSaving={isSaving}
                isDeleting={isDeleting}
                showDelete={panelMode === "edit"}
                width="lg"
            >
                <div className="space-y-5">
                    {errors._form && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {errors._form}
                        </div>
                    )}

                    {/* Property & Room */}
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Properti"
                            options={properties.map((p) => ({ value: p.id, label: p.name }))}
                            value={formData.propertyId}
                            onChange={(e) => setFormData({ ...formData, propertyId: e.target.value, roomId: "" })}
                            error={errors.propertyId}
                            required
                            disabled={panelMode === "edit"}
                        />
                        <Select
                            label="Kamar"
                            options={[
                                { value: "", label: "- Pilih Kamar -" },
                                ...rooms.map((r) => ({ value: r.id, label: r.name })),
                            ]}
                            value={formData.roomId}
                            onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                        />
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Data Pribadi</h4>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Nama Lengkap"
                                    placeholder="Nama sesuai KTP"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    error={errors.fullName}
                                    required
                                />
                                <Input
                                    label="NIK (No. KTP)"
                                    placeholder="16 digit"
                                    maxLength={16}
                                    value={formData.ktpNumber}
                                    onChange={(e) => setFormData({ ...formData, ktpNumber: e.target.value.replace(/\D/g, "") })}
                                    error={errors.ktpNumber}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="No. HP"
                                    placeholder="08xxxxxxxxxx"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    error={errors.phone}
                                    required
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Jenis Kelamin"
                                    options={[{ value: "", label: "- Pilih -" }, ...genderOptions]}
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                />
                                <Input
                                    label="Pekerjaan"
                                    placeholder="Mahasiswa, Karyawan, dll"
                                    value={formData.occupation}
                                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                />
                            </div>

                            <Textarea
                                label="Alamat Asal"
                                placeholder="Alamat lengkap sesuai KTP"
                                value={formData.originAddress}
                                onChange={(e) => setFormData({ ...formData, originAddress: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Kontak Darurat</h4>

                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <Input
                                    label="Nama"
                                    placeholder="Nama kontak"
                                    value={formData.emergencyName}
                                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                                />
                                <Input
                                    label="Hubungan"
                                    placeholder="Orang tua, Saudara"
                                    value={formData.emergencyRelation}
                                    onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                                />
                                <Input
                                    label="No. HP"
                                    placeholder="08xxxxxxxxxx"
                                    value={formData.emergencyPhone}
                                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Informasi Sewa</h4>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Tanggal Masuk"
                                    type="date"
                                    value={formData.checkInDate}
                                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                                    error={errors.checkInDate}
                                    required
                                />
                                <Input
                                    label="Tanggal Jatuh Tempo"
                                    type="number"
                                    min={1}
                                    max={31}
                                    value={formData.paymentDueDay}
                                    onChange={(e) => setFormData({ ...formData, paymentDueDay: parseInt(e.target.value) || 1 })}
                                    helperText="Tanggal 1-31 setiap bulan"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Harga Sewa per Bulan"
                                    type="number"
                                    placeholder="0"
                                    value={formData.rentalPrice || ""}
                                    onChange={(e) => setFormData({ ...formData, rentalPrice: parseInt(e.target.value) || 0 })}
                                    error={errors.rentalPrice}
                                    required
                                />
                                <Input
                                    label="Deposit"
                                    type="number"
                                    placeholder="0"
                                    value={formData.depositAmount || ""}
                                    onChange={(e) => setFormData({ ...formData, depositAmount: parseInt(e.target.value) || 0 })}
                                />
                            </div>

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
