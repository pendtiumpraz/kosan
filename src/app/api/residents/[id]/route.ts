import {
    successResponse,
    withErrorHandler,
    requireAuth,
} from "@/lib/api-utils";
import { updateResidentSchema } from "@/lib/validations";
import { residentService } from "@/services/resident.service";

// =============================================================================
// GET /api/residents/[id] - Get resident by ID (PRIVATE)
// =============================================================================

export const GET = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    const resident = await residentService.getById(
        id,
        session.user.id,
        session.user.role
    );

    return successResponse(resident);
});

// =============================================================================
// PUT /api/residents/[id] - Update resident
// =============================================================================

export const PUT = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    const body = await request.json();
    const data = updateResidentSchema.parse(body);

    const resident = await residentService.update(
        id,
        data,
        session.user.id,
        session.user.role
    );

    return successResponse(resident);
});

// =============================================================================
// DELETE /api/residents/[id] - Soft delete (end tenancy)
// =============================================================================

export const DELETE = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    await residentService.delete(
        id,
        session.user.id,
        session.user.role
    );

    return successResponse({ message: "Penghuni berhasil dikeluarkan" });
});
