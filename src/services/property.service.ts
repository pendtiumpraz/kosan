import { prisma } from "@/lib/prisma";
import { NotFoundError, AuthError, ErrorCodes } from "@/lib/api-utils";
import type { CreatePropertyInput, UpdatePropertyInput } from "@/lib/validations";
import type { Prisma, UserRole } from "@prisma/client";

// =============================================================================
// PROPERTY SERVICE - Business Logic Layer
// =============================================================================

export const propertyService = {
    // -------------------------------------------------------------------------
    // CREATE - Buat properti baru
    // -------------------------------------------------------------------------
    async create(data: CreatePropertyInput, userId: string, userRole: UserRole) {
        // Business rule: Only OWNER, AGENT, ADMIN can create
        if (!["OWNER", "AGENT", "SUPER_ADMIN", "ADMIN"].includes(userRole)) {
            throw new AuthError("Anda tidak memiliki akses untuk membuat properti", ErrorCodes.FORBIDDEN);
        }

        const property = await prisma.property.create({
            data: {
                ...data,
                ownerId: userId,
                totalRooms: data.totalRooms || 0,
                totalFloors: data.totalFloors || 1,
            },
            include: {
                owner: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { rooms: true, residents: true },
                },
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId,
                action: "CREATE",
                entityType: "properties",
                entityId: property.id,
                newData: data as any,
            },
        });

        return property;
    },

    // -------------------------------------------------------------------------
    // GET BY ID - Ambil detail properti
    // -------------------------------------------------------------------------
    async getById(id: string, userId: string, userRole: UserRole) {
        const property = await prisma.property.findUnique({
            where: { id, deletedAt: null },
            include: {
                owner: {
                    select: { id: true, name: true, email: true, phone: true, avatar: true },
                },
                agent: {
                    select: { id: true, name: true, email: true, phone: true },
                },
                images: {
                    where: { deletedAt: null },
                    orderBy: { sortOrder: "asc" },
                },
                facilities: {
                    where: { deletedAt: null },
                },
                _count: {
                    select: {
                        rooms: { where: { deletedAt: null } },
                        residents: { where: { deletedAt: null, rentalStatus: "ACTIVE" } },
                    },
                },
            },
        });

        if (!property) {
            throw new NotFoundError("Properti tidak ditemukan");
        }

        // Check access: Owner, Agent assigned, or Admin
        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = property.ownerId === userId;
        const isAgent = property.agentId === userId;

        if (!isAdmin && !isOwner && !isAgent) {
            throw new AuthError("Anda tidak memiliki akses ke properti ini", ErrorCodes.FORBIDDEN);
        }

        return property;
    },

    // -------------------------------------------------------------------------
    // UPDATE - Update properti
    // -------------------------------------------------------------------------
    async update(id: string, data: UpdatePropertyInput, userId: string, userRole: UserRole) {
        const existing = await prisma.property.findUnique({
            where: { id, deletedAt: null },
        });

        if (!existing) {
            throw new NotFoundError("Properti tidak ditemukan");
        }

        // Check permission
        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = existing.ownerId === userId;

        if (!isAdmin && !isOwner) {
            throw new AuthError("Anda tidak memiliki akses untuk mengubah properti ini", ErrorCodes.FORBIDDEN);
        }

        const property = await prisma.property.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            include: {
                owner: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { rooms: true, residents: true },
                },
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId,
                action: "UPDATE",
                entityType: "properties",
                entityId: id,
                oldData: existing as any,
                newData: data as any,
            },
        });

        return property;
    },

    // -------------------------------------------------------------------------
    // DELETE - Soft delete properti
    // -------------------------------------------------------------------------
    async delete(id: string, userId: string, userRole: UserRole) {
        const existing = await prisma.property.findUnique({
            where: { id, deletedAt: null },
            include: {
                _count: {
                    select: {
                        residents: { where: { deletedAt: null, rentalStatus: "ACTIVE" } },
                    },
                },
            },
        });

        if (!existing) {
            throw new NotFoundError("Properti tidak ditemukan");
        }

        // Check permission
        const isAdmin = ["SUPER_ADMIN"].includes(userRole);
        const isOwner = existing.ownerId === userId;

        if (!isAdmin && !isOwner) {
            throw new AuthError("Anda tidak memiliki akses untuk menghapus properti ini", ErrorCodes.FORBIDDEN);
        }

        // Business rule: Cannot delete if has active residents
        if (existing._count.residents > 0) {
            throw new AuthError(
                "Tidak dapat menghapus properti yang masih memiliki penghuni aktif",
                ErrorCodes.CONFLICT
            );
        }

        // Soft delete
        await prisma.property.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: userId,
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId,
                action: "DELETE",
                entityType: "properties",
                entityId: id,
                oldData: { name: existing.name, type: existing.type },
            },
        });

        return { success: true };
    },

    // -------------------------------------------------------------------------
    // LIST - Daftar properti dengan pagination & filter
    // -------------------------------------------------------------------------
    async list(
        params: {
            page: number;
            limit: number;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
            search?: string;
            type?: string;
            city?: string;
            isPublished?: boolean;
        },
        userId: string,
        userRole: UserRole
    ) {
        const { page, limit, sortBy = "createdAt", sortOrder = "desc", search, type, city, isPublished } = params;

        // Build where clause
        const where: Prisma.PropertyWhereInput = {
            deletedAt: null,
        };

        // Filter by ownership unless admin
        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        if (!isAdmin) {
            where.OR = [
                { ownerId: userId },
                { agentId: userId },
            ];
        }

        // Additional filters
        if (search) {
            where.AND = [
                {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { address: { contains: search, mode: "insensitive" } },
                        { city: { contains: search, mode: "insensitive" } },
                    ],
                },
            ];
        }

        if (type) {
            where.type = type as any;
        }

        if (city) {
            where.city = { contains: city, mode: "insensitive" };
        }

        if (isPublished !== undefined) {
            where.isPublished = isPublished;
        }

        // Execute queries
        const [items, total] = await Promise.all([
            prisma.property.findMany({
                where,
                include: {
                    owner: {
                        select: { id: true, name: true },
                    },
                    images: {
                        where: { deletedAt: null, isPrimary: true },
                        take: 1,
                    },
                    _count: {
                        select: {
                            rooms: { where: { deletedAt: null } },
                            residents: { where: { deletedAt: null, rentalStatus: "ACTIVE" } },
                        },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.property.count({ where }),
        ]);

        return {
            items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    // -------------------------------------------------------------------------
    // VERIFY - Admin verify properti
    // -------------------------------------------------------------------------
    async verify(id: string, userId: string, note?: string) {
        const existing = await prisma.property.findUnique({
            where: { id, deletedAt: null },
        });

        if (!existing) {
            throw new NotFoundError("Properti tidak ditemukan");
        }

        const property = await prisma.property.update({
            where: { id },
            data: {
                isVerified: true,
                verifiedAt: new Date(),
                verifiedBy: userId,
                verificationNote: note,
            },
        });

        // Notify owner
        await prisma.notification.create({
            data: {
                userId: existing.ownerId,
                type: "PROPERTY_VERIFIED",
                title: "Properti Anda Telah Diverifikasi",
                content: `Properti "${existing.name}" telah diverifikasi dan siap dipublikasikan.`,
                data: { propertyId: id },
            },
        });

        return property;
    },
};
