import {
    successResponse,
    withErrorHandler,
    requireAuth,
} from "@/lib/api-utils";
import { updatePaymentSchema } from "@/lib/validations";
import { paymentService } from "@/services/payment.service";

// =============================================================================
// GET /api/payments/[id] - Get payment by ID
// =============================================================================

export const GET = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    const payment = await paymentService.getById(
        id,
        session.user.id,
        session.user.role
    );

    return successResponse(payment);
});

// =============================================================================
// PUT /api/payments/[id] - Update payment
// =============================================================================

export const PUT = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    const body = await request.json();
    const data = updatePaymentSchema.parse(body);

    const payment = await paymentService.update(
        id,
        data,
        session.user.id,
        session.user.role
    );

    return successResponse(payment);
});

// =============================================================================
// DELETE /api/payments/[id] - Soft delete payment
// =============================================================================

export const DELETE = withErrorHandler(async (
    request: Request,
    context?: { params: Promise<{ id: string }> }
) => {
    const session = await requireAuth();
    const { id } = await context!.params;

    await paymentService.delete(
        id,
        session.user.id,
        session.user.role
    );

    return successResponse({ message: "Pembayaran berhasil dihapus" });
});
