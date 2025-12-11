import {
    successResponse,
    withErrorHandler,
    requireAuth,
    getPaginationParams,
} from "@/lib/api-utils";
import { createRoomSchema } from "@/lib/validations";
import { roomService } from "@/services/room.service";

// =============================================================================
// GET /api/rooms - List rooms
// =============================================================================

export const GET = withErrorHandler(async (request: Request) => {
    const session = await requireAuth();

    const { searchParams } = new URL(request.url);
    const { page, limit, sortBy, sortOrder } = getPaginationParams(searchParams);

    const propertyId = searchParams.get("propertyId") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const result = await roomService.list(
        { page, limit, sortBy, sortOrder, propertyId, status, search },
        session.user.id,
        session.user.role
    );

    return successResponse(result.items, result.meta);
});

// =============================================================================
// POST /api/rooms - Create new room
// =============================================================================

export const POST = withErrorHandler(async (request: Request) => {
    const session = await requireAuth();

    const body = await request.json();
    const data = createRoomSchema.parse(body);

    const room = await roomService.create(
        data,
        session.user.id,
        session.user.role
    );

    return successResponse(room, undefined, 201);
});
