import { prisma } from "@/lib/prisma";
import { NotFoundError, AuthError, ErrorCodes } from "@/lib/api-utils";
import type { CreateRoomInput, UpdateRoomInput } from "@/lib/validations";
import type { Prisma, UserRole } from "@prisma/client";

// =============================================================================
// ROOM SERVICE - Business Logic Layer
// =============================================================================

export const roomService = {
    // -------------------------------------------------------------------------
    // CREATE
    // -------------------------------------------------------------------------
    async create(data: CreateRoomInput, userId: string, userRole: UserRole) {
        // Check property exists and user has access
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

        const room = await prisma.room.create({
            data: {
                ...data,
                priceDaily: data.priceDaily ? data.priceDaily : null,
                priceMonthly: data.priceMonthly ? data.priceMonthly : null,
                priceYearly: data.priceYearly ? data.priceYearly : null,
                deposit: data.deposit ? data.deposit : null,
            },
            include: {
                property: {
                    select: { id: true, name: true },
                },
                _count: {
                    select: { residents: true },
                },
            },
        });

        // Update property room count
        await prisma.property.update({
            where: { id: data.propertyId },
            data: { totalRooms: { increment: 1 } },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId,
                action: "CREATE",
                entityType: "rooms",
                entityId: room.id,
                newData: data as any,
            },
        });

        return room;
    },

    // -------------------------------------------------------------------------
    // GET BY ID
    // -------------------------------------------------------------------------
    async getById(id: string, userId: string, userRole: UserRole) {
        const room = await prisma.room.findUnique({
            where: { id, deletedAt: null },
            include: {
                property: {
                    select: { id: true, name: true, ownerId: true, agentId: true },
                },
                images: {
                    where: { deletedAt: null },
                    orderBy: { sortOrder: "asc" },
                },
                facilities: {
                    where: { deletedAt: null },
                },
                residents: {
                    where: { deletedAt: null, rentalStatus: "ACTIVE" },
                    select: { id: true, fullName: true, checkInDate: true },
                },
            },
        });

        if (!room) {
            throw new NotFoundError("Kamar tidak ditemukan");
        }

        // Check access
        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = room.property.ownerId === userId;
        const isAgent = room.property.agentId === userId;

        if (!isAdmin && !isOwner && !isAgent) {
            throw new AuthError("Anda tidak memiliki akses ke kamar ini", ErrorCodes.FORBIDDEN);
        }

        return room;
    },

    // -------------------------------------------------------------------------
    // UPDATE
    // -------------------------------------------------------------------------
    async update(id: string, data: UpdateRoomInput, userId: string, userRole: UserRole) {
        const existing = await prisma.room.findUnique({
            where: { id, deletedAt: null },
            include: {
                property: { select: { ownerId: true, agentId: true } },
            },
        });

        if (!existing) {
            throw new NotFoundError("Kamar tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = existing.property.ownerId === userId;
        const isAgent = existing.property.agentId === userId;

        if (!isAdmin && !isOwner && !isAgent) {
            throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
        }

        const room = await prisma.room.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            include: {
                property: { select: { id: true, name: true } },
            },
        });

        await prisma.auditLog.create({
            data: {
                userId,
                action: "UPDATE",
                entityType: "rooms",
                entityId: id,
                oldData: existing as any,
                newData: data as any,
            },
        });

        return room;
    },

    // -------------------------------------------------------------------------
    // DELETE (Soft)
    // -------------------------------------------------------------------------
    async delete(id: string, userId: string, userRole: UserRole) {
        const existing = await prisma.room.findUnique({
            where: { id, deletedAt: null },
            include: {
                property: { select: { id: true, ownerId: true } },
                _count: {
                    select: { residents: { where: { deletedAt: null, rentalStatus: "ACTIVE" } } },
                },
            },
        });

        if (!existing) {
            throw new NotFoundError("Kamar tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN"].includes(userRole);
        const isOwner = existing.property.ownerId === userId;

        if (!isAdmin && !isOwner) {
            throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
        }

        if (existing._count.residents > 0) {
            throw new AuthError("Tidak dapat menghapus kamar yang masih memiliki penghuni", ErrorCodes.CONFLICT);
        }

        await prisma.room.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: userId,
            },
        });

        // Update property room count
        await prisma.property.update({
            where: { id: existing.property.id },
            data: { totalRooms: { decrement: 1 } },
        });

        await prisma.auditLog.create({
            data: {
                userId,
                action: "DELETE",
                entityType: "rooms",
                entityId: id,
                oldData: { name: existing.name },
            },
        });

        return { success: true };
    },

    // -------------------------------------------------------------------------
    // LIST
    // -------------------------------------------------------------------------
    async list(
        params: {
            page: number;
            limit: number;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
            propertyId?: string;
            status?: string;
            search?: string;
        },
        userId: string,
        userRole: UserRole
    ) {
        const { page, limit, sortBy = "createdAt", sortOrder = "desc", propertyId, status, search } = params;

        const where: Prisma.RoomWhereInput = {
            deletedAt: null,
        };

        // If propertyId specified, check access to that property
        if (propertyId) {
            const property = await prisma.property.findUnique({
                where: { id: propertyId, deletedAt: null },
            });

            if (!property) {
                throw new NotFoundError("Properti tidak ditemukan");
            }

            const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
            const isOwner = property.ownerId === userId;
            const isAgent = property.agentId === userId;

            if (!isAdmin && !isOwner && !isAgent) {
                throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
            }

            where.propertyId = propertyId;
        } else {
            // Filter by properties user has access to
            const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
            if (!isAdmin) {
                where.property = {
                    OR: [{ ownerId: userId }, { agentId: userId }],
                };
            }
        }

        if (status) {
            where.status = status as any;
        }

        if (search) {
            where.name = { contains: search, mode: "insensitive" };
        }

        const [items, total] = await Promise.all([
            prisma.room.findMany({
                where,
                include: {
                    property: { select: { id: true, name: true } },
                    images: {
                        where: { deletedAt: null, isPrimary: true },
                        take: 1,
                    },
                    _count: {
                        select: { residents: { where: { deletedAt: null, rentalStatus: "ACTIVE" } } },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.room.count({ where }),
        ]);

        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },
};
