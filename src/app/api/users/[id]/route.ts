import { prisma } from "@/lib/prisma";
import {
    successResponse,
    errorResponse,
    ErrorCodes,
    withErrorHandler,
    requireAuth,
    requireRole,
    softDeleteData,
    NotFoundError,
    parseBody,
} from "@/lib/api-utils";
import { updateUserSchema } from "@/lib/validations";

// =============================================================================
// GET /api/users/[id] - Get user by ID
// =============================================================================

export const GET = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    // Users can only view their own profile, admins can view any
    const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(session.user.role);
    if (!isAdmin && session.user.id !== id) {
        return errorResponse(ErrorCodes.FORBIDDEN, "Akses ditolak", 403);
    }

    const user = await prisma.user.findUnique({
        where: { id, deletedAt: null },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            avatar: true,
            dateOfBirth: true,
            gender: true,
            address: true,
            ktpNumber: isAdmin ? true : false,
            businessName: true,
            businessAddress: true,
            npwp: isAdmin ? true : false,
            agentLicense: isAdmin ? true : false,
            verificationStatus: true,
            verificationNote: isAdmin ? true : false,
            verifiedAt: true,
            trustScore: true,
            isActive: true,
            emailVerifiedAt: true,
            phoneVerifiedAt: true,
            createdAt: true,
            lastLoginAt: true,
            _count: {
                select: {
                    properties: true,
                    listings: true,
                },
            },
        },
    });

    if (!user) {
        throw new NotFoundError("User tidak ditemukan");
    }

    return successResponse(user);
});

// =============================================================================
// PUT /api/users/[id] - Update user
// =============================================================================

export const PUT = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    // Users can only update their own profile, admins can update any
    const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(session.user.role);
    if (!isAdmin && session.user.id !== id) {
        return errorResponse(ErrorCodes.FORBIDDEN, "Akses ditolak", 403);
    }

    const body = await request.json();
    const data = updateUserSchema.parse(body);

    // Check user exists
    const existingUser = await prisma.user.findUnique({
        where: { id, deletedAt: null },
    });

    if (!existingUser) {
        throw new NotFoundError("User tidak ditemukan");
    }

    const user = await prisma.user.update({
        where: { id },
        data: {
            ...data,
            updatedAt: new Date(),
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            avatar: true,
            updatedAt: true,
        },
    });

    // Audit log
    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "UPDATE",
            entityType: "users",
            entityId: id,
            oldData: existingUser as any,
            newData: data,
        },
    });

    return successResponse(user);
});

// =============================================================================
// PATCH /api/users/[id] - Partial update (status, verification, etc.)
// =============================================================================

export const PATCH = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireRole(["SUPER_ADMIN", "ADMIN"]);
    const { id } = await context!.params;

    const body = await request.json();
    const { action, ...data } = body;

    const existingUser = await prisma.user.findUnique({
        where: { id, deletedAt: null },
    });

    if (!existingUser) {
        throw new NotFoundError("User tidak ditemukan");
    }

    let updateData: any = {};
    let notificationData: any = null;

    switch (action) {
        case "verify":
            updateData = {
                verificationStatus: "VERIFIED",
                verifiedAt: new Date(),
                verifiedBy: session.user.id,
                verificationNote: data.note,
                isActive: true,
                trustScore: { increment: 20 },
            };
            notificationData = {
                type: "ACCOUNT_VERIFIED",
                title: "Akun Anda Telah Diverifikasi",
                content: "Selamat! Akun Anda telah diverifikasi. Anda sekarang dapat mengakses semua fitur.",
            };
            break;

        case "reject":
            updateData = {
                verificationStatus: "REJECTED",
                verificationNote: data.note || "Dokumen tidak valid",
                isActive: false,
            };
            notificationData = {
                type: "ACCOUNT_REJECTED",
                title: "Verifikasi Akun Ditolak",
                content: `Maaf, verifikasi akun Anda ditolak. Alasan: ${data.note || "Dokumen tidak valid"}`,
            };
            break;

        case "suspend":
            updateData = {
                verificationStatus: "SUSPENDED",
                isActive: false,
                trustScore: { decrement: 30 },
            };
            notificationData = {
                type: "ACCOUNT_SUSPENDED",
                title: "Akun Anda Ditangguhkan",
                content: `Akun Anda telah ditangguhkan. Alasan: ${data.note || "Pelanggaran kebijakan"}`,
            };
            break;

        case "unsuspend":
            updateData = {
                verificationStatus: "VERIFIED",
                isActive: true,
            };
            notificationData = {
                type: "ACCOUNT_UNSUSPENDED",
                title: "Akun Anda Telah Diaktifkan Kembali",
                content: "Akun Anda telah diaktifkan kembali. Terima kasih atas kesabarannya.",
            };
            break;

        default:
            return errorResponse(ErrorCodes.VALIDATION_ERROR, "Action tidak valid", 400);
    }

    const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            verificationStatus: true,
            isActive: true,
            trustScore: true,
        },
    });

    // Send notification to user
    if (notificationData) {
        await prisma.notification.create({
            data: {
                userId: id,
                ...notificationData,
            },
        });
    }

    // Audit log
    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: action.toUpperCase(),
            entityType: "users",
            entityId: id,
            oldData: { verificationStatus: existingUser.verificationStatus },
            newData: { action, ...updateData },
        },
    });

    return successResponse(user);
});

// =============================================================================
// DELETE /api/users/[id] - Soft delete user
// =============================================================================

export const DELETE = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireRole(["SUPER_ADMIN"]);
    const { id } = await context!.params;

    // Cannot delete yourself
    if (session.user.id === id) {
        return errorResponse(ErrorCodes.VALIDATION_ERROR, "Tidak dapat menghapus akun sendiri", 400);
    }

    const existingUser = await prisma.user.findUnique({
        where: { id, deletedAt: null },
    });

    if (!existingUser) {
        throw new NotFoundError("User tidak ditemukan");
    }

    // Soft delete
    await prisma.user.update({
        where: { id },
        data: softDeleteData(session.user.id),
    });

    // Audit log
    await prisma.auditLog.create({
        data: {
            userId: session.user.id,
            action: "DELETE",
            entityType: "users",
            entityId: id,
            oldData: { email: existingUser.email, name: existingUser.name },
        },
    });

    return successResponse({ message: "User berhasil dihapus" });
});
