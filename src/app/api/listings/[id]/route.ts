import {
    successResponse,
    withErrorHandler,
    requireAuth,
} from "@/lib/api-utils";
import { updateListingSchema } from "@/lib/validations";
import { listingService } from "@/services/listing.service";
import { z } from "zod";

// =============================================================================
// GET /api/listings/[id] - Get listing detail
// =============================================================================

export const GET = withErrorHandler(async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;

    // Try to get session for access control
    let userId: string | undefined;
    let userRole: string | undefined;

    try {
        const session = await requireAuth();
        userId = session.user.id;
        userRole = session.user.role;
    } catch {
        // Public access
    }

    const listing = await listingService.getById(id, userId, userRole as "SUPER_ADMIN" | "ADMIN" | "OWNER" | "AGENT" | "TENANT" | "USER" | undefined);

    return successResponse(listing);
});

// =============================================================================
// PUT /api/listings/[id] - Update listing
// =============================================================================

export const PUT = withErrorHandler(async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    const session = await requireAuth();

    const body = await request.json();

    // Check if this is a status update
    if (body.status && Object.keys(body).length <= 2) {
        const statusSchema = z.object({
            status: z.enum(["DRAFT", "PENDING", "ACTIVE", "SOLD", "RENTED", "EXPIRED", "REJECTED"]),
            note: z.string().optional(),
        });
        const { status, note } = statusSchema.parse(body);

        const listing = await listingService.updateStatus(
            id,
            status,
            session.user.id,
            session.user.role,
            note
        );

        return successResponse(listing);
    }

    // Regular update
    const data = updateListingSchema.parse(body);
    const listing = await listingService.update(
        id,
        data,
        session.user.id,
        session.user.role
    );

    return successResponse(listing);
});

// =============================================================================
// DELETE /api/listings/[id] - Delete listing
// =============================================================================

export const DELETE = withErrorHandler(async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    const session = await requireAuth();

    await listingService.delete(
        id,
        session.user.id,
        session.user.role
    );

    return successResponse({ success: true });
});
