import {
    successResponse,
    withErrorHandler,
    requireAuth,
    getPaginationParams,
} from "@/lib/api-utils";
import { createListingSchema } from "@/lib/validations";
import { listingService } from "@/services/listing.service";

// =============================================================================
// GET /api/listings - List listings (public or owner's)
// =============================================================================

export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { page, limit, sortBy, sortOrder } = getPaginationParams(searchParams);

    const scope = searchParams.get("scope"); // "my" for owner's listings
    const status = searchParams.get("status") || undefined;
    const listingType = searchParams.get("listingType") || undefined;
    const propertyType = searchParams.get("propertyType") || undefined;
    const city = searchParams.get("city") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const search = searchParams.get("search") || undefined;

    // Owner's listings
    if (scope === "my") {
        const session = await requireAuth();
        const result = await listingService.listMy(
            { page, limit, sortBy, sortOrder, status, search },
            session.user.id
        );
        return successResponse(result.items, result.meta);
    }

    // Admin view all
    if (scope === "admin") {
        const session = await requireAuth();
        const result = await listingService.listAll(
            { page, limit, sortBy, sortOrder, status, search },
            session.user.role
        );
        return successResponse(result.items, result.meta);
    }

    // Public marketplace
    const result = await listingService.listPublic({
        page,
        limit,
        sortBy,
        sortOrder,
        listingType,
        propertyType,
        city,
        minPrice,
        maxPrice,
        search,
    });

    return successResponse(result.items, result.meta);
});

// =============================================================================
// POST /api/listings - Create new listing
// =============================================================================

export const POST = withErrorHandler(async (request: Request) => {
    const session = await requireAuth();

    const body = await request.json();
    const data = createListingSchema.parse(body);

    const listing = await listingService.create(
        data,
        session.user.id,
        session.user.role
    );

    return successResponse(listing, undefined, 201);
});
