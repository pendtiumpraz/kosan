import {
    successResponse,
    withErrorHandler,
    requireAuth,
    getPaginationParams,
} from "@/lib/api-utils";
import { createResidentSchema } from "@/lib/validations";
import { residentService } from "@/services/resident.service";

// =============================================================================
// GET /api/residents - List residents (PRIVATE - filtered by ownership)
// =============================================================================

export const GET = withErrorHandler(async (request: Request) => {
    const session = await requireAuth();

    const { searchParams } = new URL(request.url);
    const { page, limit, sortBy, sortOrder } = getPaginationParams(searchParams);

    const propertyId = searchParams.get("propertyId") || undefined;
    const roomId = searchParams.get("roomId") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const result = await residentService.list(
        { page, limit, sortBy, sortOrder, propertyId, roomId, status, search },
        session.user.id,
        session.user.role
    );

    return successResponse(result.items, result.meta);
});

// =============================================================================
// POST /api/residents - Add new resident
// =============================================================================

export const POST = withErrorHandler(async (request: Request) => {
    const session = await requireAuth();

    const body = await request.json();
    const data = createResidentSchema.parse(body);

    const resident = await residentService.create(
        data,
        session.user.id,
        session.user.role
    );

    return successResponse(resident, undefined, 201);
});
