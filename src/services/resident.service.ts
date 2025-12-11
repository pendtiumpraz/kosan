import { prisma } from "@/lib/prisma";
import { NotFoundError, AuthError, ErrorCodes } from "@/lib/api-utils";
import type { CreateResidentInput, UpdateResidentInput } from "@/lib/validations";
import type { Prisma, UserRole } from "@prisma/client";

// =============================================================================
// RESIDENT SERVICE - Business Logic Layer (PRIVATE DATA)
// =============================================================================

export const residentService = {
    // -------------------------------------------------------------------------
    // CREATE - Tambah penghuni
    // -------------------------------------------------------------------------
    async create(data: CreateResidentInput, userId: string, userRole: UserRole) {
        // Check property access
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

        // If room specified, check room exists and available
        if (data.roomId) {
            const room = await prisma.room.findUnique({
                where: { id: data.roomId, deletedAt: null },
            });

            if (!room) {
                throw new NotFoundError("Kamar tidak ditemukan");
            }

            if (room.status === "OCCUPIED") {
                throw new AuthError("Kamar sudah terisi", ErrorCodes.CONFLICT);
            }

            // Update room status
            await prisma.room.update({
                where: { id: data.roomId },
                data: { status: "OCCUPIED" },
            });
        }

        // Check if user account exists (optional link)
        if (data.userId) {
            const user = await prisma.user.findUnique({
                where: { id: data.userId, deletedAt: null },
            });

            if (!user) {
                throw new NotFoundError("User tidak ditemukan");
            }

            // Update user role to TENANT if still USER
            if (user.role === "USER") {
                await prisma.user.update({
                    where: { id: data.userId },
                    data: { role: "TENANT" },
                });
            }
        }

        const resident = await prisma.resident.create({
            data: {
                ...data,
                depositStatus: "PENDING",
                rentalStatus: "ACTIVE",
            },
            include: {
                property: { select: { id: true, name: true } },
                room: { select: { id: true, name: true } },
                user: { select: { id: true, name: true, email: true } },
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId,
                action: "CREATE",
                entityType: "residents",
                entityId: resident.id,
                newData: { fullName: data.fullName, propertyId: data.propertyId },
            },
        });

        return resident;
    },

    // -------------------------------------------------------------------------
    // GET BY ID - Detail penghuni (PRIVATE)
    // -------------------------------------------------------------------------
    async getById(id: string, userId: string, userRole: UserRole) {
        const resident = await prisma.resident.findUnique({
            where: { id, deletedAt: null },
            include: {
                property: {
                    select: { id: true, name: true, ownerId: true, agentId: true },
                },
                room: { select: { id: true, name: true, floor: true } },
                user: { select: { id: true, name: true, email: true, phone: true } },
                documents: { where: { deletedAt: null } },
                payments: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
        });

        if (!resident) {
            throw new NotFoundError("Penghuni tidak ditemukan");
        }

        // PRIVATE: Only property owner/agent or the resident themselves can view
        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = resident.property.ownerId === userId;
        const isAgent = resident.property.agentId === userId;
        const isSelf = resident.userId === userId;

        if (!isAdmin && !isOwner && !isAgent && !isSelf) {
            throw new AuthError("Anda tidak memiliki akses ke data ini", ErrorCodes.FORBIDDEN);
        }

        return resident;
    },

    // -------------------------------------------------------------------------
    // UPDATE
    // -------------------------------------------------------------------------
    async update(id: string, data: UpdateResidentInput, userId: string, userRole: UserRole) {
        const existing = await prisma.resident.findUnique({
            where: { id, deletedAt: null },
            include: {
                property: { select: { ownerId: true, agentId: true } },
            },
        });

        if (!existing) {
            throw new NotFoundError("Penghuni tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = existing.property.ownerId === userId;
        const isAgent = existing.property.agentId === userId;

        if (!isAdmin && !isOwner && !isAgent) {
            throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
        }

        // Handle room change
        if (data.roomId && data.roomId !== existing.roomId) {
            // Free old room
            if (existing.roomId) {
                await prisma.room.update({
                    where: { id: existing.roomId },
                    data: { status: "AVAILABLE" },
                });
            }

            // Check & occupy new room
            const newRoom = await prisma.room.findUnique({
                where: { id: data.roomId, deletedAt: null },
            });

            if (!newRoom) {
                throw new NotFoundError("Kamar baru tidak ditemukan");
            }

            if (newRoom.status === "OCCUPIED") {
                throw new AuthError("Kamar sudah terisi", ErrorCodes.CONFLICT);
            }

            await prisma.room.update({
                where: { id: data.roomId },
                data: { status: "OCCUPIED" },
            });
        }

        const resident = await prisma.resident.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            include: {
                property: { select: { id: true, name: true } },
                room: { select: { id: true, name: true } },
            },
        });

        await prisma.auditLog.create({
            data: {
                userId,
                action: "UPDATE",
                entityType: "residents",
                entityId: id,
                oldData: { fullName: existing.fullName },
                newData: data as any,
            },
        });

        return resident;
    },

    // -------------------------------------------------------------------------
    // DELETE (Soft) - End tenancy
    // -------------------------------------------------------------------------
    async delete(id: string, userId: string, userRole: UserRole) {
        const existing = await prisma.resident.findUnique({
            where: { id, deletedAt: null },
            include: {
                property: { select: { ownerId: true } },
            },
        });

        if (!existing) {
            throw new NotFoundError("Penghuni tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN"].includes(userRole);
        const isOwner = existing.property.ownerId === userId;

        if (!isAdmin && !isOwner) {
            throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
        }

        // Update room status to available
        if (existing.roomId) {
            await prisma.room.update({
                where: { id: existing.roomId },
                data: { status: "AVAILABLE" },
            });
        }

        // Soft delete
        await prisma.resident.update({
            where: { id },
            data: {
                rentalStatus: "ENDED",
                checkOutDate: new Date(),
                deletedAt: new Date(),
                deletedBy: userId,
            },
        });

        await prisma.auditLog.create({
            data: {
                userId,
                action: "DELETE",
                entityType: "residents",
                entityId: id,
                oldData: { fullName: existing.fullName },
            },
        });

        return { success: true };
    },

    // -------------------------------------------------------------------------
    // LIST - Daftar penghuni (filtered by property access)
    // -------------------------------------------------------------------------
    async list(
        params: {
            page: number;
            limit: number;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
            propertyId?: string;
            roomId?: string;
            status?: string;
            search?: string;
        },
        userId: string,
        userRole: UserRole
    ) {
        const { page, limit, sortBy = "createdAt", sortOrder = "desc", propertyId, roomId, status, search } = params;

        const where: Prisma.ResidentWhereInput = {
            deletedAt: null,
        };

        // Filter by property access
        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        if (!isAdmin) {
            where.property = {
                OR: [{ ownerId: userId }, { agentId: userId }],
            };
        }

        if (propertyId) {
            where.propertyId = propertyId;
        }

        if (roomId) {
            where.roomId = roomId;
        }

        if (status) {
            where.rentalStatus = status as any;
        }

        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        const [items, total] = await Promise.all([
            prisma.resident.findMany({
                where,
                select: {
                    id: true,
                    fullName: true,
                    phone: true,
                    email: true,
                    checkInDate: true,
                    checkOutDate: true,
                    rentalPrice: true,
                    rentalStatus: true,
                    paymentDueDay: true,
                    property: { select: { id: true, name: true } },
                    room: { select: { id: true, name: true } },
                    _count: {
                        select: { payments: { where: { deletedAt: null } } },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.resident.count({ where }),
        ]);

        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },
};
