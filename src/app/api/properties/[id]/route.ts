import {
    successResponse,
    errorResponse,
    ErrorCodes,
    withErrorHandler,
    requireAuth,
    requireRole,
} from "@/lib/api-utils";
import { updatePropertySchema } from "@/lib/validations";
import { propertyService } from "@/services/property.service";

// =============================================================================
// GET /api/properties/[id] - Get property by ID
// =============================================================================

export const GET = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    const property = await propertyService.getById(
        id,
        session.user.id,
        session.user.role
    );

    return successResponse(property);
});

// =============================================================================
// PUT /api/properties/[id] - Update property
// =============================================================================

export const PUT = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    const body = await request.json();
    const data = updatePropertySchema.parse(body);

    const property = await propertyService.update(
        id,
        data,
        session.user.id,
        session.user.role
    );

    return successResponse(property);
});

// =============================================================================
// PATCH /api/properties/[id] - Partial update (verify, publish, etc.)
// =============================================================================

export const PATCH = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
        case "verify":
            // Only admin can verify
            await requireRole(["SUPER_ADMIN", "ADMIN"]);
            const verifiedProperty = await propertyService.verify(
                id,
                session.user.id,
                data.note
            );
            return successResponse(verifiedProperty);

        case "publish":
            // Owner can publish their own verified property
            const property = await propertyService.getById(id, session.user.id, session.user.role);
            if (!property.isVerified) {
                return errorResponse(
                    ErrorCodes.VALIDATION_ERROR,
                    "Properti harus diverifikasi terlebih dahulu sebelum dipublikasikan",
                    400
                );
            }
            const updated = await propertyService.update(
                id,
                { isPublished: true } as any,
                session.user.id,
                session.user.role
            );
            return successResponse(updated);

        default:
            return errorResponse(ErrorCodes.VALIDATION_ERROR, "Action tidak valid", 400);
    }
});

// =============================================================================
// DELETE /api/properties/[id] - Soft delete property
// =============================================================================

export const DELETE = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    await propertyService.delete(
        id,
        session.user.id,
        session.user.role
    );

    return successResponse({ message: "Properti berhasil dihapus" });
});
