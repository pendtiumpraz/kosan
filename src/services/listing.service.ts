import { prisma } from "@/lib/prisma";
import { NotFoundError, AuthError, ErrorCodes } from "@/lib/api-utils";
import type { CreateListingInput, UpdateListingInput } from "@/lib/validations";
import type { Prisma, UserRole } from "@prisma/client";

// =============================================================================
// LISTING SERVICE - Business Logic Layer
// =============================================================================

export const listingService = {
    // -------------------------------------------------------------------------
    // CREATE
    // -------------------------------------------------------------------------
    async create(data: CreateListingInput, userId: string, userRole: UserRole) {
        // If linking to property, check access
        if (data.propertyId) {
            const property = await prisma.property.findUnique({
                where: { id: data.propertyId, deletedAt: null },
            });

            if (!property) {
                throw new NotFoundError("Properti tidak ditemukan");
            }

            const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
            const isOwner = property.ownerId === userId;
            const isAgent = property.agentId === userId;

            if (!isAdmin && !isOwner && !isAgent) {
                throw new AuthError("Anda tidak memiliki akses ke properti ini", ErrorCodes.FORBIDDEN);
            }
        }

        // Extract facilities from data (it's a relation, not direct field)
        const { facilities, ...listingData } = data;

        const listing = await prisma.listing.create({
            data: {
                ...listingData,
                ownerId: userId,
                status: "DRAFT",
                // Create facilities if provided
                ...(facilities && facilities.length > 0 && {
                    facilities: {
                        create: facilities.map((name) => ({
                            facilityCode: name.toUpperCase().replace(/\s+/g, "_"),
                            facilityName: name,
                        })),
                    },
                }),
            },
            include: {
                owner: { select: { id: true, name: true } },
                property: { select: { id: true, name: true } },
                images: { where: { deletedAt: null }, take: 1 },
            },
        });

        await prisma.auditLog.create({
            data: {
                userId,
                action: "CREATE",
                entityType: "listings",
                entityId: listing.id,
                newData: { title: data.title },
            },
        });

        return listing;
    },

    // -------------------------------------------------------------------------
    // GET BY ID
    // -------------------------------------------------------------------------
    async getById(id: string, userId?: string, userRole?: UserRole) {
        const listing = await prisma.listing.findUnique({
            where: { id, deletedAt: null },
            include: {
                owner: { select: { id: true, name: true, avatar: true, verificationStatus: true } },
                property: { select: { id: true, name: true } },
                images: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } },
                facilities: { where: { deletedAt: null } },
                _count: { select: { bookings: true, favorites: true } },
            },
        });

        if (!listing) {
            throw new NotFoundError("Listing tidak ditemukan");
        }

        // If not public (ACTIVE), check access
        if (listing.status !== "ACTIVE" && userId) {
            const isAdmin = userRole && ["SUPER_ADMIN", "ADMIN"].includes(userRole);
            const isOwner = listing.ownerId === userId;

            if (!isAdmin && !isOwner) {
                throw new AuthError("Listing belum dipublikasikan", ErrorCodes.FORBIDDEN);
            }
        }

        // Increment view count for public access
        if (listing.status === "ACTIVE") {
            await prisma.listing.update({
                where: { id },
                data: { views: { increment: 1 } },
            });
        }

        return listing;
    },

    // -------------------------------------------------------------------------
    // UPDATE
    // -------------------------------------------------------------------------
    async update(id: string, data: UpdateListingInput, userId: string, userRole: UserRole) {
        const existing = await prisma.listing.findUnique({
            where: { id, deletedAt: null },
        });

        if (!existing) {
            throw new NotFoundError("Listing tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = existing.ownerId === userId;

        if (!isAdmin && !isOwner) {
            throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
        }

        // Extract fields that need special handling
        const { facilities, propertyId, ...updateData } = data;

        const listing = await prisma.listing.update({
            where: { id },
            data: {
                ...updateData,
                // Connect to property if provided
                ...(propertyId && { property: { connect: { id: propertyId } } }),
                updatedAt: new Date(),
            },
            include: {
                owner: { select: { id: true, name: true } },
                property: { select: { id: true, name: true } },
            },
        });

        await prisma.auditLog.create({
            data: {
                userId,
                action: "UPDATE",
                entityType: "listings",
                entityId: id,
                oldData: { title: existing.title, status: existing.status },
                newData: updateData as object,
            },
        });

        return listing;
    },

    // -------------------------------------------------------------------------
    // UPDATE STATUS
    // -------------------------------------------------------------------------
    async updateStatus(
        id: string,
        status: string,
        userId: string,
        userRole: UserRole,
        note?: string
    ) {
        const existing = await prisma.listing.findUnique({
            where: { id, deletedAt: null },
        });

        if (!existing) {
            throw new NotFoundError("Listing tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = existing.ownerId === userId;

        // Owner can: DRAFT -> PENDING, ACTIVE -> DRAFT
        // Admin can: PENDING -> ACTIVE/REJECTED, any status change
        const ownerAllowed = ["DRAFT", "PENDING"].includes(status) && isOwner;
        if (!isAdmin && !ownerAllowed) {
            throw new AuthError("Anda tidak memiliki akses untuk mengubah status ini", ErrorCodes.FORBIDDEN);
        }

        const updateData: Prisma.ListingUpdateInput = {
            status,
            updatedAt: new Date(),
        };

        // If admin verifying
        if (isAdmin && status === "ACTIVE") {
            updateData.isVerified = true;
            updateData.verifiedAt = new Date();
            updateData.verifiedBy = userId;
            updateData.verificationNote = note;
        }

        if (isAdmin && status === "REJECTED") {
            updateData.verificationNote = note;
        }

        const listing = await prisma.listing.update({
            where: { id },
            data: updateData,
        });

        await prisma.auditLog.create({
            data: {
                userId,
                action: "UPDATE_STATUS",
                entityType: "listings",
                entityId: id,
                oldData: { status: existing.status },
                newData: { status, note },
            },
        });

        return listing;
    },

    // -------------------------------------------------------------------------
    // DELETE (Soft)
    // -------------------------------------------------------------------------
    async delete(id: string, userId: string, userRole: UserRole) {
        const existing = await prisma.listing.findUnique({
            where: { id, deletedAt: null },
        });

        if (!existing) {
            throw new NotFoundError("Listing tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN"].includes(userRole);
        const isOwner = existing.ownerId === userId;

        if (!isAdmin && !isOwner) {
            throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
        }

        await prisma.listing.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: userId,
            },
        });

        await prisma.auditLog.create({
            data: {
                userId,
                action: "DELETE",
                entityType: "listings",
                entityId: id,
                oldData: { title: existing.title },
            },
        });

        return { success: true };
    },

    // -------------------------------------------------------------------------
    // LIST - Public marketplace
    // -------------------------------------------------------------------------
    async listPublic(params: {
        page: number;
        limit: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        listingType?: string;
        propertyType?: string;
        city?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
    }) {
        const {
            page,
            limit,
            sortBy = "createdAt",
            sortOrder = "desc",
            listingType,
            propertyType,
            city,
            minPrice,
            maxPrice,
            search,
        } = params;

        const where: Prisma.ListingWhereInput = {
            deletedAt: null,
            status: "ACTIVE",
        };

        if (listingType) where.listingType = listingType as "RENT" | "SALE";
        if (propertyType) where.propertyType = propertyType as Prisma.EnumPropertyTypeFilter;
        if (city) where.city = { contains: city, mode: "insensitive" };
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = minPrice;
            if (maxPrice) where.price.lte = maxPrice;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
                { city: { contains: search, mode: "insensitive" } },
            ];
        }

        const [items, total] = await Promise.all([
            prisma.listing.findMany({
                where,
                include: {
                    owner: { select: { id: true, name: true, verificationStatus: true } },
                    images: { where: { deletedAt: null, isPrimary: true }, take: 1 },
                    _count: { select: { favorites: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.listing.count({ where }),
        ]);

        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },

    // -------------------------------------------------------------------------
    // LIST - Owner's listings
    // -------------------------------------------------------------------------
    async listMy(
        params: {
            page: number;
            limit: number;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
            status?: string;
            search?: string;
        },
        userId: string
    ) {
        const { page, limit, sortBy = "createdAt", sortOrder = "desc", status, search } = params;

        const where: Prisma.ListingWhereInput = {
            deletedAt: null,
            ownerId: userId,
        };

        if (status) where.status = status;
        if (search) {
            where.title = { contains: search, mode: "insensitive" };
        }

        const [items, total] = await Promise.all([
            prisma.listing.findMany({
                where,
                include: {
                    property: { select: { id: true, name: true } },
                    images: { where: { deletedAt: null, isPrimary: true }, take: 1 },
                    _count: { select: { bookings: true, favorites: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.listing.count({ where }),
        ]);

        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },

    // -------------------------------------------------------------------------
    // LIST - Admin (all listings)
    // -------------------------------------------------------------------------
    async listAll(
        params: {
            page: number;
            limit: number;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
            status?: string;
            search?: string;
        },
        userRole: UserRole
    ) {
        if (!["SUPER_ADMIN", "ADMIN"].includes(userRole)) {
            throw new AuthError("Akses tidak diizinkan", ErrorCodes.FORBIDDEN);
        }

        const { page, limit, sortBy = "createdAt", sortOrder = "desc", status, search } = params;

        const where: Prisma.ListingWhereInput = {
            deletedAt: null,
        };

        if (status) where.status = status;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { owner: { name: { contains: search, mode: "insensitive" } } },
            ];
        }

        const [items, total] = await Promise.all([
            prisma.listing.findMany({
                where,
                include: {
                    owner: { select: { id: true, name: true } },
                    images: { where: { deletedAt: null, isPrimary: true }, take: 1 },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.listing.count({ where }),
        ]);

        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },
};
