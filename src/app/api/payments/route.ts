import {
    successResponse,
    withErrorHandler,
    requireAuth,
    getPaginationParams,
} from "@/lib/api-utils";
import { createPaymentSchema } from "@/lib/validations";
import { paymentService } from "@/services/payment.service";

// =============================================================================
// GET /api/payments - List payments
// =============================================================================

export const GET = withErrorHandler(async (request: Request) => {
    const session = await requireAuth();

    const { searchParams } = new URL(request.url);
    const { page, limit, sortBy, sortOrder } = getPaginationParams(searchParams);

    const propertyId = searchParams.get("propertyId") || undefined;
    const residentId = searchParams.get("residentId") || undefined;
    const status = searchParams.get("status") || undefined;
    const paymentType = searchParams.get("paymentType") || undefined;

    const result = await paymentService.list(
        { page, limit, sortBy, sortOrder, propertyId, residentId, status, paymentType },
        session.user.id,
        session.user.role
    );

    return successResponse(result.items, result.meta);
});

// =============================================================================
// POST /api/payments - Create new payment
// =============================================================================

export const POST = withErrorHandler(async (request: Request) => {
    const session = await requireAuth();

    const body = await request.json();
    const data = createPaymentSchema.parse(body);

    const payment = await paymentService.create(
        data,
        session.user.id,
        session.user.role
    );

    return successResponse(payment, undefined, 201);
});
