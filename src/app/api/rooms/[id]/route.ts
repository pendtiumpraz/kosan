import {
    successResponse,
    withErrorHandler,
    requireAuth,
} from "@/lib/api-utils";
import { updateRoomSchema } from "@/lib/validations";
import { roomService } from "@/services/room.service";

// =============================================================================
// GET /api/rooms/[id] - Get room by ID
// =============================================================================

export const GET = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    const room = await roomService.getById(
        id,
        session.user.id,
        session.user.role
    );

    return successResponse(room);
});

// =============================================================================
// PUT /api/rooms/[id] - Update room
// =============================================================================

export const PUT = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    const body = await request.json();
    const data = updateRoomSchema.parse(body);

    const room = await roomService.update(
        id,
        data,
        session.user.id,
        session.user.role
    );

    return successResponse(room);
});

// =============================================================================
// DELETE /api/rooms/[id] - Soft delete room
// =============================================================================

export const DELETE = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    await roomService.delete(
        id,
        session.user.id,
        session.user.role
    );

    return successResponse({ message: "Kamar berhasil dihapus" });
});
