import {
    successResponse,
    withErrorHandler,
    requireAuth,
} from "@/lib/api-utils";
import { bookingService } from "@/services/booking.service";
import { z } from "zod";

// =============================================================================
// GET /api/bookings/[id] - Get booking detail
// =============================================================================

export const GET = withErrorHandler(async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    const session = await requireAuth();

    const booking = await bookingService.getById(
        id,
        session.user.id,
        session.user.role
    );

    return successResponse(booking);
});

// =============================================================================
// PUT /api/bookings/[id] - Respond to or cancel booking
// =============================================================================

export const PUT = withErrorHandler(async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    const session = await requireAuth();

    const body = await request.json();

    // Cancel action
    if (body.action === "cancel") {
        const booking = await bookingService.cancel(id, session.user.id);
        return successResponse(booking);
    }

    // Respond action (owner)
    const respondSchema = z.object({
        status: z.enum(["CONFIRMED", "REJECTED"]),
        note: z.string().optional(),
    });
    const { status, note } = respondSchema.parse(body);

    const booking = await bookingService.respond(
        id,
        status,
        session.user.id,
        session.user.role,
        note
    );

    return successResponse(booking);
});
