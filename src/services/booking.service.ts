import { prisma } from "@/lib/prisma";
import { NotFoundError, AuthError, ErrorCodes } from "@/lib/api-utils";
import type { CreateBookingInput } from "@/lib/validations";
import type { Prisma, UserRole } from "@prisma/client";

// =============================================================================
// BOOKING SERVICE - Business Logic Layer
// =============================================================================

export const bookingService = {
    // -------------------------------------------------------------------------
    // CREATE (User creates booking)
    // -------------------------------------------------------------------------
    async create(data: CreateBookingInput, userId: string) {
        // Check listing exists and is active
        const listing = await prisma.listing.findUnique({
            where: { id: data.listingId, deletedAt: null, status: "ACTIVE" },
        });

        if (!listing) {
            throw new NotFoundError("Listing tidak ditemukan atau tidak aktif");
        }

        // Calculate total price (simplified - in real app, would be more complex)
        const totalPrice = listing.price;

        const booking = await prisma.booking.create({
            data: {
                ...data,
                userId,
                totalPrice,
                status: "PENDING",
            },
            include: {
                listing: { select: { id: true, title: true, ownerId: true } },
                user: { select: { id: true, name: true, phone: true } },
                room: { select: { id: true, name: true } },
            },
        });

        // Notify listing owner
        await prisma.notification.create({
            data: {
                userId: listing.ownerId,
                type: "BOOKING_REQUEST",
                title: "Permintaan Booking Baru",
                content: `Ada permintaan booking untuk ${listing.title}`,
                data: { bookingId: booking.id },
            },
        });

        await prisma.auditLog.create({
            data: {
                userId,
                action: "CREATE",
                entityType: "bookings",
                entityId: booking.id,
                newData: { listingId: data.listingId, bookingType: data.bookingType },
            },
        });

        return booking;
    },

    // -------------------------------------------------------------------------
    // GET BY ID
    // -------------------------------------------------------------------------
    async getById(id: string, userId: string, userRole: UserRole) {
        const booking = await prisma.booking.findUnique({
            where: { id, deletedAt: null },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        ownerId: true,
                        address: true,
                        city: true,
                    },
                },
                user: { select: { id: true, name: true, phone: true, email: true } },
                room: { select: { id: true, name: true } },
            },
        });

        if (!booking) {
            throw new NotFoundError("Booking tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = booking.listing.ownerId === userId;
        const isBooker = booking.userId === userId;

        if (!isAdmin && !isOwner && !isBooker) {
            throw new AuthError("Anda tidak memiliki akses", ErrorCodes.FORBIDDEN);
        }

        return booking;
    },

    // -------------------------------------------------------------------------
    // RESPOND (Owner responds to booking)
    // -------------------------------------------------------------------------
    async respond(
        id: string,
        status: "CONFIRMED" | "REJECTED",
        userId: string,
        userRole: UserRole,
        note?: string
    ) {
        const existing = await prisma.booking.findUnique({
            where: { id, deletedAt: null },
            include: {
                listing: { select: { ownerId: true, title: true } },
            },
        });

        if (!existing) {
            throw new NotFoundError("Booking tidak ditemukan");
        }

        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(userRole);
        const isOwner = existing.listing.ownerId === userId;

        if (!isAdmin && !isOwner) {
            throw new AuthError("Hanya pemilik listing yang dapat merespon", ErrorCodes.FORBIDDEN);
        }

        if (existing.status !== "PENDING") {
            throw new AuthError("Booking sudah direspon sebelumnya", ErrorCodes.CONFLICT);
        }

        const booking = await prisma.booking.update({
            where: { id },
            data: {
                status,
                respondedAt: new Date(),
                responseNote: note,
            },
        });

        // Notify booker
        await prisma.notification.create({
            data: {
                userId: existing.userId,
                type: "BOOKING_RESPONSE",
                title: status === "CONFIRMED" ? "Booking Dikonfirmasi" : "Booking Ditolak",
                content:
                    status === "CONFIRMED"
                        ? `Booking Anda untuk ${existing.listing.title} telah dikonfirmasi!`
                        : `Booking Anda untuk ${existing.listing.title} ditolak. ${note || ""}`,
                data: { bookingId: id, status },
            },
        });

        await prisma.auditLog.create({
            data: {
                userId,
                action: "RESPOND",
                entityType: "bookings",
                entityId: id,
                oldData: { status: existing.status },
                newData: { status, note },
            },
        });

        return booking;
    },

    // -------------------------------------------------------------------------
    // CANCEL (User cancels their booking)
    // -------------------------------------------------------------------------
    async cancel(id: string, userId: string) {
        const existing = await prisma.booking.findUnique({
            where: { id, deletedAt: null },
            include: {
                listing: { select: { ownerId: true, title: true } },
            },
        });

        if (!existing) {
            throw new NotFoundError("Booking tidak ditemukan");
        }

        if (existing.userId !== userId) {
            throw new AuthError("Anda hanya dapat membatalkan booking Anda sendiri", ErrorCodes.FORBIDDEN);
        }

        if (!["PENDING", "CONFIRMED"].includes(existing.status)) {
            throw new AuthError("Booking tidak dapat dibatalkan", ErrorCodes.CONFLICT);
        }

        const booking = await prisma.booking.update({
            where: { id },
            data: {
                status: "CANCELLED",
            },
        });

        // Notify owner
        await prisma.notification.create({
            data: {
                userId: existing.listing.ownerId,
                type: "BOOKING_CANCELLED",
                title: "Booking Dibatalkan",
                content: `Booking untuk ${existing.listing.title} telah dibatalkan oleh calon penyewa.`,
                data: { bookingId: id },
            },
        });

        return booking;
    },

    // -------------------------------------------------------------------------
    // LIST - My bookings (as booker)
    // -------------------------------------------------------------------------
    async listMyBookings(
        params: {
            page: number;
            limit: number;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
            status?: string;
        },
        userId: string
    ) {
        const { page, limit, sortBy = "createdAt", sortOrder = "desc", status } = params;

        const where: Prisma.BookingWhereInput = {
            deletedAt: null,
            userId,
        };

        if (status) where.status = status as Prisma.EnumBookingStatusFilter;

        const [items, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: {
                    listing: {
                        select: {
                            id: true,
                            title: true,
                            city: true,
                            images: { where: { deletedAt: null, isPrimary: true }, take: 1 },
                        },
                    },
                    room: { select: { id: true, name: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.booking.count({ where }),
        ]);

        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },

    // -------------------------------------------------------------------------
    // LIST - Received bookings (as listing owner)
    // -------------------------------------------------------------------------
    async listReceivedBookings(
        params: {
            page: number;
            limit: number;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
            status?: string;
            listingId?: string;
        },
        userId: string,
        userRole: UserRole
    ) {
        const { page, limit, sortBy = "createdAt", sortOrder = "desc", status, listingId } = params;

        const where: Prisma.BookingWhereInput = {
            deletedAt: null,
            listing: { ownerId: userId },
        };

        if (status) where.status = status as Prisma.EnumBookingStatusFilter;
        if (listingId) where.listingId = listingId;

        const [items, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: {
                    listing: { select: { id: true, title: true } },
                    user: { select: { id: true, name: true, phone: true } },
                    room: { select: { id: true, name: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.booking.count({ where }),
        ]);

        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },
};
