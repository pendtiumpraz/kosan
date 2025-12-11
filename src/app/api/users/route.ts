import { prisma } from "@/lib/prisma";
import {
    successResponse,
    errorResponse,
    ErrorCodes,
    withErrorHandler,
    requireAuth,
    requireRole,
    getPaginationParams,
    getPaginationMeta,
    softDeleteData,
    NotFoundError,
} from "@/lib/api-utils";
import { updateUserSchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

// =============================================================================
// GET /api/users - List all users (Admin only)
// =============================================================================

export const GET = withErrorHandler(async (request: Request) => {
    const session = await requireRole(["SUPER_ADMIN", "ADMIN"]);

    const { searchParams } = new URL(request.url);
    const { page, limit, sortBy, sortOrder } = getPaginationParams(searchParams);

    // Filters
    const role = searchParams.get("role");
    const verificationStatus = searchParams.get("verificationStatus");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");

    const where: Prisma.UserWhereInput = {
        deletedAt: null,
        ...(role && { role: role as any }),
        ...(verificationStatus && { verificationStatus: verificationStatus as any }),
        ...(isActive !== null && { isActive: isActive === "true" }),
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } },
            ],
        }),
    };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                avatar: true,
                verificationStatus: true,
                trustScore: true,
                isActive: true,
                emailVerifiedAt: true,
                createdAt: true,
                lastLoginAt: true,
            },
            orderBy: { [sortBy as string]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.user.count({ where }),
    ]);

    return successResponse(users, getPaginationMeta(total, page, limit));
});

// =============================================================================
// POST /api/users - Create user (Admin only)
// =============================================================================

export const POST = withErrorHandler(async (request: Request) => {
    const session = await requireRole(["SUPER_ADMIN"]);

    // Use register logic from /api/auth/register
    return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        "Gunakan /api/auth/register untuk membuat user baru",
        400
    );
});
