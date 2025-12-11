import { prisma } from "@/lib/prisma";
import { NotFoundError, AuthError, ErrorCodes } from "@/lib/api-utils";
import type { CreatePaymentInput, UpdatePaymentInput } from "@/lib/validations";
import type { Prisma, UserRole } from "@prisma/client";

// =============================================================================
// PAYMENT SERVICE - Business Logic Layer
// =============================================================================

export const paymentService = {
    // -------------------------------------------------------------------------
    // CREATE
    // -------------------------------------------------------------------------
    async create(data: CreatePaymentInput, userId: string, userRole: UserRole) {
        // Check resident exists
        const resident = await prisma.resident.findUnique({
            where: { id: data.residentId, deletedAt: null },
            include: {
                property: { select: { ownerId: true, agentId: true } },
            },
        });

        if (!resident) {
            throw new NotFoundError("Penghuni tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = resident.property.ownerId === userId;
        const isAgent = resident.property.agentId === userId;

        if (!isAdmin && !isOwner && !isAgent) {
            throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
        }

        const payment = await prisma.payment.create({
            data: {
                ...data,
                userId: resident.userId || undefined,
                status: "PENDING",
            },
            include: {
                resident: { select: { id: true, fullName: true } },
                property: { select: { id: true, name: true } },
            },
        });

        // Create notification for tenant if linked to user account
        if (resident.userId) {
            await prisma.notification.create({
                data: {
                    userId: resident.userId,
                    type: "PAYMENT_CREATED",
                    title: "Tagihan Baru",
                    content: `Tagihan ${data.paymentType} sebesar Rp ${data.amount.toLocaleString()} telah dibuat.`,
                    data: { paymentId: payment.id },
                },
            });
        }

        await prisma.auditLog.create({
            data: {
                userId,
                action: "CREATE",
                entityType: "payments",
                entityId: payment.id,
                newData: data as any,
            },
        });

        return payment;
    },

    // -------------------------------------------------------------------------
    // GET BY ID
    // -------------------------------------------------------------------------
    async getById(id: string, userId: string, userRole: UserRole) {
        const payment = await prisma.payment.findUnique({
            where: { id, deletedAt: null },
            include: {
                resident: {
                    select: { id: true, fullName: true, userId: true },
                    include: {
                        property: { select: { ownerId: true, agentId: true } },
                    },
                },
                property: { select: { id: true, name: true } },
            },
        });

        if (!payment) {
            throw new NotFoundError("Pembayaran tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = payment.resident.property.ownerId === userId;
        const isAgent = payment.resident.property.agentId === userId;
        const isTenant = payment.resident.userId === userId;

        if (!isAdmin && !isOwner && !isAgent && !isTenant) {
            throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
        }

        return payment;
    },

    // -------------------------------------------------------------------------
    // UPDATE
    // -------------------------------------------------------------------------
    async update(id: string, data: UpdatePaymentInput, userId: string, userRole: UserRole) {
        const existing = await prisma.payment.findUnique({
            where: { id, deletedAt: null },
            include: {
                resident: {
                    select: { userId: true },
                    include: {
                        property: { select: { ownerId: true, agentId: true } },
                    },
                },
            },
        });

        if (!existing) {
            throw new NotFoundError("Pembayaran tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = existing.resident.property.ownerId === userId;
        const isAgent = existing.resident.property.agentId === userId;
        const isTenant = existing.resident.userId === userId;

        // Tenant can only upload payment proof
        if (isTenant && !isOwner && !isAgent && !isAdmin) {
            // Only allow updating paymentProofUrl
            const allowedFields = ["paymentProofUrl"];
            const providedFields = Object.keys(data);
            const invalidFields = providedFields.filter((f) => !allowedFields.includes(f));

            if (invalidFields.length > 0) {
                throw new AuthError("Anda hanya dapat mengupload bukti pembayaran", ErrorCodes.FORBIDDEN);
            }
        } else if (!isAdmin && !isOwner && !isAgent) {
            throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
        }

        const payment = await prisma.payment.update({
            where: { id },
            data: {
                ...data,
                paidDate: data.status === "PAID" ? new Date() : existing.paidDate,
                verifiedById: data.status === "PAID" ? userId : undefined,
                verifiedAt: data.status === "PAID" ? new Date() : undefined,
                updatedAt: new Date(),
            },
            include: {
                resident: { select: { id: true, fullName: true, userId: true } },
                property: { select: { id: true, name: true } },
            },
        });

        // Notify tenant if payment status changed
        if (data.status && payment.resident.userId) {
            const statusMessages: Record<string, string> = {
                PAID: "Pembayaran Anda telah dikonfirmasi. Terima kasih!",
                OVERDUE: "Pembayaran Anda telah jatuh tempo. Mohon segera melakukan pembayaran.",
                CANCELLED: "Pembayaran Anda telah dibatalkan.",
            };

            if (statusMessages[data.status]) {
                await prisma.notification.create({
                    data: {
                        userId: payment.resident.userId,
                        type: "PAYMENT_STATUS",
                        title: `Status Pembayaran: ${data.status}`,
                        content: statusMessages[data.status],
                        data: { paymentId: id, status: data.status },
                    },
                });
            }
        }

        await prisma.auditLog.create({
            data: {
                userId,
                action: "UPDATE",
                entityType: "payments",
                entityId: id,
                oldData: { status: existing.status },
                newData: data as any,
            },
        });

        return payment;
    },

    // -------------------------------------------------------------------------
    // DELETE (Soft)
    // -------------------------------------------------------------------------
    async delete(id: string, userId: string, userRole: UserRole) {
        const existing = await prisma.payment.findUnique({
            where: { id, deletedAt: null },
            include: {
                resident: {
                    include: {
                        property: { select: { ownerId: true } },
                    },
                },
            },
        });

        if (!existing) {
            throw new NotFoundError("Pembayaran tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN"].includes(userRole);
        const isOwner = existing.resident.property.ownerId === userId;

        if (!isAdmin && !isOwner) {
            throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
        }

        // Can only delete PENDING payments
        if (existing.status !== "PENDING") {
            throw new AuthError("Hanya dapat menghapus pembayaran dengan status PENDING", ErrorCodes.CONFLICT);
        }

        await prisma.payment.update({
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
                entityType: "payments",
                entityId: id,
                oldData: { amount: existing.amount, status: existing.status },
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
            residentId?: string;
            status?: string;
            paymentType?: string;
        },
        userId: string,
        userRole: UserRole
    ) {
        const { page, limit, sortBy = "createdAt", sortOrder = "desc", propertyId, residentId, status, paymentType } = params;

        const where: Prisma.PaymentWhereInput = {
            deletedAt: null,
        };

        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        if (!isAdmin) {
            // Owner/Agent: see payments for their properties
            // Tenant: see only their own payments
            where.OR = [
                { resident: { property: { ownerId: userId } } },
                { resident: { property: { agentId: userId } } },
                { resident: { userId: userId } },
            ];
        }

        if (propertyId) where.propertyId = propertyId;
        if (residentId) where.residentId = residentId;
        if (status) where.status = status as any;
        if (paymentType) where.paymentType = paymentType as any;

        const [items, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                include: {
                    resident: { select: { id: true, fullName: true } },
                    property: { select: { id: true, name: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.payment.count({ where }),
        ]);

        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },
};
