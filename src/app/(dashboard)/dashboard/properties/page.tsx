"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Sidebar";
import { CrudPanel } from "@/components/layout/RightPanel";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button, Badge, Input, Textarea, Select } from "@/components/ui/FormElements";
import { Plus, Building2 } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface Property {
    id: string;
    name: string;
    type: string;
    address: string;
    city: string;
    totalRooms: number;
    isPublished: boolean;
    isVerified: boolean;
    createdAt: string;
    _count?: {
        rooms: number;
        residents: number;
    };
}

interface PropertyFormData {
    name: string;
    type: string;
    description: string;
    address: string;
    province: string;
    city: string;
    district: string;
    postalCode: string;
    totalRooms: number;
    totalFloors: number;
}

const propertyTypes = [
    { value: "KOS", label: "Kos-kosan" },
    { value: "KONTRAKAN", label: "Kontrakan" },
    { value: "VILLA", label: "Villa" },
    { value: "HOUSE", label: "Rumah" },
    { value: "LAND", label: "Tanah" },
    { value: "APARTMENT", label: "Apartemen" },
];

const initialFormData: PropertyFormData = {
    name: "",
    type: "KOS",
    description: "",
    address: "",
    province: "",
    city: "",
    district: "",
    postalCode: "",
    totalRooms: 0,
    totalFloors: 1,
};

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function PropertiesPage() {
    // State
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Panel state
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch properties
    const fetchProperties = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: "10",
                sortBy,
                sortOrder,
            });

            const res = await fetch(`/api/properties?${params}`);
            const data = await res.json();

            if (data.success) {
                setProperties(data.data);
                setTotal(data.meta?.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [page, sortBy, sortOrder]);

    // Handlers
    const handleCreate = () => {
        setFormData(initialFormData);
        setSelectedId(null);
        setPanelMode("create");
        setErrors({});
        setPanelOpen(true);
    };

    const handleEdit = async (property: Property) => {
        try {
            const res = await fetch(`/api/properties/${property.id}`);
            const data = await res.json();

            if (data.success) {
                setFormData({
                    name: data.data.name || "",
                    type: data.data.type || "KOS",
                    description: data.data.description || "",
                    address: data.data.address || "",
                    province: data.data.province || "",
                    city: data.data.city || "",
                    district: data.data.district || "",
                    postalCode: data.data.postalCode || "",
                    totalRooms: data.data.totalRooms || 0,
                    totalFloors: data.data.totalFloors || 1,
                });
                setSelectedId(property.id);
                setPanelMode("edit");
                setErrors({});
                setPanelOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch property:", error);
        }
    };

    const handleSave = async () => {
        // Validate
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "Nama properti wajib diisi";
        if (!formData.address) newErrors.address = "Alamat wajib diisi";
        if (!formData.city) newErrors.city = "Kota wajib diisi";
        if (!formData.province) newErrors.province = "Provinsi wajib diisi";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSaving(true);
        try {
            const url = panelMode === "create"
                ? "/api/properties"
                : `/api/properties/${selectedId}`;

            const res = await fetch(url, {
                method: panelMode === "create" ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setPanelOpen(false);
                fetchProperties();
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

        if (!confirm("Apakah Anda yakin ingin menghapus properti ini?")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/properties/${selectedId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                setPanelOpen(false);
                fetchProperties();
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

    // Table columns
    const columns: Column<Property>[] = [
        {
            key: "name",
            header: "Nama Properti",
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.city}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "type",
            header: "Tipe",
            sortable: true,
            render: (row) => (
                <Badge variant="info">{row.type}</Badge>
            ),
        },
        {
            key: "totalRooms",
            header: "Kamar",
            sortable: true,
            render: (row) => `${row._count?.residents || 0}/${row.totalRooms}`,
        },
        {
            key: "isPublished",
            header: "Status",
            render: (row) => (
                <div className="flex flex-col gap-1">
                    {row.isVerified && <Badge variant="success">Verified</Badge>}
                    <Badge variant={row.isPublished ? "info" : "default"}>
                        {row.isPublished ? "Published" : "Draft"}
                    </Badge>
                </div>
            ),
        },
        {
            key: "createdAt",
            header: "Dibuat",
            sortable: true,
            render: (row) => new Date(row.createdAt).toLocaleDateString("id-ID"),
        },
    ];

    return (
        <div className="min-h-screen">
            <Header
                title="Properti"
                subtitle={`${total} properti terdaftar`}
                actions={
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
                        Tambah Properti
                    </Button>
                }
            />

            <div className="p-6">
                <DataTable
                    data={properties}
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
                    onDelete={(p) => { handleEdit(p); }}
                    emptyMessage="Belum ada properti. Klik 'Tambah Properti' untuk memulai."
                />
            </div>

            {/* CRUD Panel */}
            <CrudPanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                title={panelMode === "create" ? "Tambah Properti" : "Edit Properti"}
                subtitle={panelMode === "create" ? "Isi informasi properti baru" : "Update informasi properti"}
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

                    <Input
                        label="Nama Properti"
                        placeholder="Contoh: Kos Putri Melati"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={errors.name}
                        required
                    />

                    <Select
                        label="Tipe Properti"
                        options={propertyTypes}
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        required
                    />

                    <Textarea
                        label="Deskripsi"
                        placeholder="Deskripsi singkat tentang properti..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Lokasi</h4>

                        <div className="space-y-4">
                            <Textarea
                                label="Alamat Lengkap"
                                placeholder="Jl. Contoh No. 123, RT 01/RW 02"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                error={errors.address}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Provinsi"
                                    placeholder="Jawa Barat"
                                    value={formData.province}
                                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                    error={errors.province}
                                    required
                                />
                                <Input
                                    label="Kota/Kabupaten"
                                    placeholder="Bandung"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    error={errors.city}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Kecamatan"
                                    placeholder="Coblong"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                />
                                <Input
                                    label="Kode Pos"
                                    placeholder="40132"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Detail Properti</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Jumlah Kamar"
                                type="number"
                                min={0}
                                value={formData.totalRooms}
                                onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value) || 0 })}
                            />
                            <Input
                                label="Jumlah Lantai"
                                type="number"
                                min={1}
                                value={formData.totalFloors}
                                onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value) || 1 })}
                            />
                        </div>
                    </div>
                </div>
            </CrudPanel>
        </div>
    );
}
