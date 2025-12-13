import {
    successResponse,
    withErrorHandler,
    requireAuth,
    getPaginationParams,
} from "@/lib/api-utils";
import { createBookingSchema } from "@/lib/validations";
import { bookingService } from "@/services/booking.service";

// =============================================================================
// GET /api/bookings - List bookings
// =============================================================================

export const GET = withErrorHandler(async (request: Request) => {
    const session = await requireAuth();

    const { searchParams } = new URL(request.url);
    const { page, limit, sortBy, sortOrder } = getPaginationParams(searchParams);

    const scope = searchParams.get("scope"); // "received" for owner's received bookings
    const status = searchParams.get("status") || undefined;
    const listingId = searchParams.get("listingId") || undefined;

    if (scope === "received") {
        // Owner viewing received bookings
        const result = await bookingService.listReceivedBookings(
            { page, limit, sortBy, sortOrder, status, listingId },
            session.user.id,
            session.user.role
        );
        return successResponse(result.items, result.meta);
    }

    // User viewing their own bookings
    const result = await bookingService.listMyBookings(
        { page, limit, sortBy, sortOrder, status },
        session.user.id
    );
    return successResponse(result.items, result.meta);
});

// =============================================================================
// POST /api/bookings - Create new booking
// =============================================================================

export const POST = withErrorHandler(async (request: Request) => {
    const session = await requireAuth();

    const body = await request.json();
    const data = createBookingSchema.parse(body);

    const booking = await bookingService.create(data, session.user.id);

    return successResponse(booking, undefined, 201);
});
