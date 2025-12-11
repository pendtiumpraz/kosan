import { prisma } from "@/lib/prisma";
import {
    successResponse,
    withErrorHandler,
    requireAuth,
    requireRole,
    getPaginationParams,
    parseBody,
} from "@/lib/api-utils";
import { createPropertySchema } from "@/lib/validations";
import { propertyService } from "@/services/property.service";

// =============================================================================
// GET /api/properties - List properties
// =============================================================================

export const GET = withErrorHandler(async (request: Request) => {
    const session = await requireAuth();

    const { searchParams } = new URL(request.url);
    const { page, limit, sortBy, sortOrder } = getPaginationParams(searchParams);

    // Additional filters
    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || undefined;
    const city = searchParams.get("city") || undefined;
    const isPublished = searchParams.get("isPublished")
        ? searchParams.get("isPublished") === "true"
        : undefined;

    const result = await propertyService.list(
        { page, limit, sortBy, sortOrder, search, type, city, isPublished },
        session.user.id,
        session.user.role
    );

    return successResponse(result.items, result.meta);
});

// =============================================================================
// POST /api/properties - Create new property
// =============================================================================

export const POST = withErrorHandler(async (request: Request) => {
    const session = await requireRole(["OWNER", "AGENT", "SUPER_ADMIN", "ADMIN"]);

    const body = await request.json();
    const data = createPropertySchema.parse(body);

    const property = await propertyService.create(
        data,
        session.user.id,
        session.user.role
    );

    return successResponse(property, undefined, 201);
});
