"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Sidebar";
import { CrudPanel } from "@/components/layout/RightPanel";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button, Badge, Input, Select, Textarea } from "@/components/ui/FormElements";
import { Plus, ShoppingBag, Eye, Send } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface Property {
    id: string;
    name: string;
}

interface Listing {
    id: string;
    title: string;
    listingType: string;
    propertyType: string;
    price: number;
    pricePeriod: string | null;
    city: string;
    status: string;
    isVerified: boolean;
    views: number;
    property: Property | null;
    images: { imageUrl: string }[];
    _count?: {
        bookings: number;
        favorites: number;
    };
    createdAt: string;
}

interface ListingFormData {
    propertyId: string;
    title: string;
    listingType: string;
    propertyType: string;
    description: string;
    address: string;
    province: string;
    city: string;
    district: string;
    price: number;
    pricePeriod: string;
    isNegotiable: boolean;
    bedrooms: number | null;
    bathrooms: number | null;
    landArea: number | null;
    buildingArea: number | null;
}

const listingTypes = [
    { value: "RENT", label: "Disewakan" },
    { value: "SALE", label: "Dijual" },
];

const propertyTypes = [
    { value: "KOS", label: "Kos-kosan" },
    { value: "KONTRAKAN", label: "Kontrakan" },
    { value: "VILLA", label: "Villa" },
    { value: "HOUSE", label: "Rumah" },
    { value: "LAND", label: "Tanah" },
    { value: "APARTMENT", label: "Apartemen" },
];

const pricePeriods = [
    { value: "DAILY", label: "Per Hari" },
    { value: "MONTHLY", label: "Per Bulan" },
    { value: "YEARLY", label: "Per Tahun" },
    { value: "ONCE", label: "Sekali Bayar" },
];

const listingStatuses = [
    { value: "DRAFT", label: "Draft" },
    { value: "PENDING", label: "Menunggu Review" },
    { value: "ACTIVE", label: "Aktif" },
    { value: "SOLD", label: "Terjual" },
    { value: "RENTED", label: "Tersewa" },
    { value: "EXPIRED", label: "Kadaluarsa" },
];

const initialFormData: ListingFormData = {
    propertyId: "",
    title: "",
    listingType: "RENT",
    propertyType: "KOS",
    description: "",
    address: "",
    province: "",
    city: "",
    district: "",
    price: 0,
    pricePeriod: "MONTHLY",
    isNegotiable: true,
    bedrooms: null,
    bathrooms: null,
    landArea: null,
    buildingArea: null,
};

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ListingsPage() {
    // State
    const [listings, setListings] = useState<Listing[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Filters
    const [filterStatus, setFilterStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Panel state
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [formData, setFormData] = useState<ListingFormData>(initialFormData);
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

    // Fetch listings
    const fetchListings = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                scope: "my",
                page: String(page),
                limit: "10",
                sortBy,
                sortOrder,
            });

            if (filterStatus) params.set("status", filterStatus);
            if (searchQuery) params.set("search", searchQuery);

            const res = await fetch(`/api/listings?${params}`);
            const data = await res.json();

            if (data.success) {
                setListings(data.data);
                setTotal(data.meta?.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch listings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        fetchListings();
    }, [page, sortBy, sortOrder, filterStatus, searchQuery]);

    // Handlers
    const handleCreate = () => {
        setFormData(initialFormData);
        setSelectedId(null);
        setSelectedListing(null);
        setPanelMode("create");
        setErrors({});
        setPanelOpen(true);
    };

    const handleEdit = async (listing: Listing) => {
        try {
            const res = await fetch(`/api/listings/${listing.id}`);
            const data = await res.json();

            if (data.success) {
                const l = data.data;
                setFormData({
                    propertyId: l.property?.id || "",
                    title: l.title || "",
                    listingType: l.listingType || "RENT",
                    propertyType: l.propertyType || "KOS",
                    description: l.description || "",
                    address: l.address || "",
                    province: l.province || "",
                    city: l.city || "",
                    district: l.district || "",
                    price: l.price ? Number(l.price) : 0,
                    pricePeriod: l.pricePeriod || "MONTHLY",
                    isNegotiable: l.isNegotiable ?? true,
                    bedrooms: l.bedrooms,
                    bathrooms: l.bathrooms,
                    landArea: l.landArea,
                    buildingArea: l.buildingArea,
                });
                setSelectedId(listing.id);
                setSelectedListing(l);
                setPanelMode("edit");
                setErrors({});
                setPanelOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch listing:", error);
        }
    };

    const handleSave = async () => {
        // Validate
        const newErrors: Record<string, string> = {};
        if (!formData.title || formData.title.length < 10) newErrors.title = "Judul minimal 10 karakter";
        if (!formData.address || formData.address.length < 10) newErrors.address = "Alamat minimal 10 karakter";
        if (!formData.city) newErrors.city = "Kota wajib diisi";
        if (!formData.province) newErrors.province = "Provinsi wajib diisi";
        if (!formData.price || formData.price <= 0) newErrors.price = "Harga wajib diisi";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSaving(true);
        try {
            const url = panelMode === "create"
                ? "/api/listings"
                : `/api/listings/${selectedId}`;

            const payload: Record<string, unknown> = {
                ...formData,
                propertyId: formData.propertyId || undefined,
                bedrooms: formData.bedrooms || undefined,
                bathrooms: formData.bathrooms || undefined,
                landArea: formData.landArea || undefined,
                buildingArea: formData.buildingArea || undefined,
            };

            const res = await fetch(url, {
                method: panelMode === "create" ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                setPanelOpen(false);
                fetchListings();
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

        if (!confirm("Apakah Anda yakin ingin menghapus listing ini?")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/listings/${selectedId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
                setPanelOpen(false);
                fetchListings();
            } else {
                alert(data.error?.message || "Gagal menghapus");
            }
        } catch (error) {
            alert("Terjadi kesalahan");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSubmitForReview = async (listing: Listing) => {
        if (!confirm("Kirim listing untuk direview admin?")) return;

        try {
            const res = await fetch(`/api/listings/${listing.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "PENDING" }),
            });

            const data = await res.json();
            if (data.success) {
                fetchListings();
            } else {
                alert(data.error?.message || "Gagal mengirim");
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

    const getStatusBadge = (status: string, isVerified: boolean) => {
        const variants: Record<string, "success" | "warning" | "info" | "default" | "danger"> = {
            DRAFT: "default",
            PENDING: "warning",
            ACTIVE: "success",
            SOLD: "info",
            RENTED: "info",
            EXPIRED: "danger",
            REJECTED: "danger",
        };
        const labels: Record<string, string> = {
            DRAFT: "Draft",
            PENDING: "Review",
            ACTIVE: "Aktif",
            SOLD: "Terjual",
            RENTED: "Tersewa",
            EXPIRED: "Kadaluarsa",
            REJECTED: "Ditolak",
        };

        return (
            <div className="flex flex-col gap-1">
                <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>
                {isVerified && <Badge variant="success">✓ Verified</Badge>}
            </div>
        );
    };

    // Table columns
    const columns: Column<Listing>[] = [
        {
            key: "title",
            header: "Listing",
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        {row.images[0] ? (
                            <img src={row.images[0].imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-400">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{row.title}</p>
                        <p className="text-xs text-slate-500">{row.city} • {row.propertyType}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "listingType",
            header: "Tipe",
            render: (row) => (
                <Badge variant={row.listingType === "SALE" ? "info" : "default"}>
                    {row.listingType === "SALE" ? "Dijual" : "Disewa"}
                </Badge>
            ),
        },
        {
            key: "price",
            header: "Harga",
            sortable: true,
            render: (row) => (
                <div>
                    <p className="font-medium text-slate-900">{formatCurrency(Number(row.price))}</p>
                    {row.pricePeriod && (
                        <p className="text-xs text-slate-500">
                            {row.pricePeriod === "MONTHLY" ? "/bulan" : row.pricePeriod === "YEARLY" ? "/tahun" : row.pricePeriod === "DAILY" ? "/hari" : ""}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "views",
            header: "Views",
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-1 text-slate-600">
                    <Eye className="h-4 w-4" />
                    <span>{row.views}</span>
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (row) => (
                <div className="flex items-center gap-2">
                    {getStatusBadge(row.status, row.isVerified)}
                    {row.status === "DRAFT" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSubmitForReview(row);
                            }}
                            className="rounded p-1 text-blue-600 hover:bg-blue-50"
                            title="Kirim untuk Review"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen">
            <Header
                title="Listing Saya"
                subtitle={`${total} listing`}
                actions={
                    <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
                        Buat Listing
                    </Button>
                }
            />

            <div className="p-6">
                {/* Filters */}
                <div className="mb-4 flex flex-wrap gap-3">
                    <Input
                        placeholder="Cari judul..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                        className="w-64"
                    />
                    <Select
                        options={[
                            { value: "", label: "Semua Status" },
                            ...listingStatuses,
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
                    data={listings}
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
                    onDelete={(l) => handleEdit(l)}
                    emptyMessage="Belum ada listing. Klik 'Buat Listing' untuk mulai memasarkan properti Anda."
                />
            </div>

            {/* CRUD Panel */}
            <CrudPanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                title={panelMode === "create" ? "Buat Listing Baru" : "Edit Listing"}
                subtitle={panelMode === "create" ? "Pasarkan properti Anda" : "Update informasi listing"}
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

                    {/* Link to Property (optional) */}
                    <Select
                        label="Hubungkan dengan Properti (Opsional)"
                        options={[
                            { value: "", label: "- Tidak dihubungkan -" },
                            ...properties.map((p) => ({ value: p.id, label: p.name })),
                        ]}
                        value={formData.propertyId}
                        onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                        helperText="Hubungkan listing dengan properti yang sudah terdaftar"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Tipe Listing"
                            options={listingTypes}
                            value={formData.listingType}
                            onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                            required
                        />
                        <Select
                            label="Tipe Properti"
                            options={propertyTypes}
                            value={formData.propertyType}
                            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Judul Listing"
                        placeholder="Contoh: Kos Putri Eksklusif dekat Kampus UI"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        error={errors.title}
                        required
                    />

                    <Textarea
                        label="Deskripsi"
                        placeholder="Deskripsikan properti Anda secara detail..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                    />

                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Lokasi</h4>

                        <div className="space-y-4">
                            <Textarea
                                label="Alamat Lengkap"
                                placeholder="Jl. Margonda Raya No. 123"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                error={errors.address}
                                required
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <Input
                                    label="Provinsi"
                                    placeholder="Jawa Barat"
                                    value={formData.province}
                                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                    error={errors.province}
                                    required
                                />
                                <Input
                                    label="Kota"
                                    placeholder="Depok"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    error={errors.city}
                                    required
                                />
                                <Input
                                    label="Kecamatan"
                                    placeholder="Beji"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Harga</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Harga"
                                type="number"
                                placeholder="0"
                                value={formData.price || ""}
                                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                error={errors.price}
                                required
                            />
                            <Select
                                label="Periode"
                                options={pricePeriods}
                                value={formData.pricePeriod}
                                onChange={(e) => setFormData({ ...formData, pricePeriod: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Spesifikasi</h4>

                        <div className="grid grid-cols-4 gap-4">
                            <Input
                                label="Kamar Tidur"
                                type="number"
                                value={formData.bedrooms || ""}
                                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value ? parseInt(e.target.value) : null })}
                            />
                            <Input
                                label="Kamar Mandi"
                                type="number"
                                value={formData.bathrooms || ""}
                                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value ? parseInt(e.target.value) : null })}
                            />
                            <Input
                                label="Luas Tanah (m²)"
                                type="number"
                                value={formData.landArea || ""}
                                onChange={(e) => setFormData({ ...formData, landArea: e.target.value ? parseInt(e.target.value) : null })}
                            />
                            <Input
                                label="Luas Bangunan (m²)"
                                type="number"
                                value={formData.buildingArea || ""}
                                onChange={(e) => setFormData({ ...formData, buildingArea: e.target.value ? parseInt(e.target.value) : null })}
                            />
                        </div>
                    </div>
                </div>
            </CrudPanel>
        </div>
    );
}
