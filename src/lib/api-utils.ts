import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ZodError, ZodSchema } from "zod";
import type { UserRole } from "@/types";

// =============================================================================
// TYPES
// =============================================================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

// =============================================================================
// ERROR CODES
// =============================================================================

export const ErrorCodes = {
    // Auth errors
    UNAUTHORIZED: "AUTH_001",
    FORBIDDEN: "AUTH_002",
    INVALID_CREDENTIALS: "AUTH_003",
    SESSION_EXPIRED: "AUTH_004",
    ACCOUNT_SUSPENDED: "AUTH_005",

    // Resource errors
    NOT_FOUND: "RES_001",
    ALREADY_EXISTS: "RES_002",
    CONFLICT: "RES_003",

    // Validation errors
    VALIDATION_ERROR: "VAL_001",
    INVALID_INPUT: "VAL_002",

    // Server errors
    INTERNAL_ERROR: "SRV_001",
    DATABASE_ERROR: "SRV_002",
    EXTERNAL_SERVICE_ERROR: "SRV_003",

    // Rate limiting
    RATE_LIMIT_EXCEEDED: "RATE_001",
} as const;

// =============================================================================
// RESPONSE HELPERS
// =============================================================================

export function successResponse<T>(
    data: T,
    meta?: ApiResponse["meta"],
    status: number = 200
): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        { success: true, data, meta },
        { status }
    );
}

export function errorResponse(
    code: string,
    message: string,
    status: number = 400,
    details?: Record<string, string[]>
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error: { code, message, details },
        },
        { status }
    );
}

export function validationErrorResponse(
    error: ZodError<unknown>
): NextResponse<ApiResponse> {
    const details: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!details[path]) {
            details[path] = [];
        }
        details[path].push(issue.message);
    });

    return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        "Validasi gagal",
        400,
        details
    );
}

// =============================================================================
// AUTH HELPERS
// =============================================================================

export async function getSession() {
    return await auth();
}

export async function requireAuth() {
    const session = await getSession();

    if (!session?.user) {
        throw new AuthError("Silakan login terlebih dahulu", ErrorCodes.UNAUTHORIZED);
    }

    return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
    const session = await requireAuth();

    if (!allowedRoles.includes(session.user.role)) {
        throw new AuthError("Anda tidak memiliki akses ke resource ini", ErrorCodes.FORBIDDEN);
    }

    return session;
}

export async function requireVerified() {
    const session = await requireAuth();

    if (session.user.verificationStatus !== "VERIFIED") {
        throw new AuthError("Akun Anda belum terverifikasi", ErrorCodes.FORBIDDEN);
    }

    return session;
}

// =============================================================================
// CUSTOM ERRORS
// =============================================================================

export class AuthError extends Error {
    code: string;

    constructor(message: string, code: string = ErrorCodes.UNAUTHORIZED) {
        super(message);
        this.name = "AuthError";
        this.code = code;
    }
}

export class NotFoundError extends Error {
    code: string;

    constructor(message: string = "Resource tidak ditemukan") {
        super(message);
        this.name = "NotFoundError";
        this.code = ErrorCodes.NOT_FOUND;
    }
}

export class ValidationError extends Error {
    code: string;
    details?: Record<string, string[]>;

    constructor(message: string, details?: Record<string, string[]>) {
        super(message);
        this.name = "ValidationError";
        this.code = ErrorCodes.VALIDATION_ERROR;
        this.details = details;
    }
}

// =============================================================================
// REQUEST HELPERS
// =============================================================================

export async function parseBody<T>(
    request: Request,
    schema: ZodSchema<T>
): Promise<T> {
    try {
        const body = await request.json();
        return schema.parse(body);
    } catch (error) {
        if (error instanceof ZodError) {
            throw error;
        }
        throw new ValidationError("Invalid JSON body");
    }
}

export function getPaginationParams(
    searchParams: URLSearchParams
): PaginationParams {
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    return { page, limit, sortBy, sortOrder };
}

export function getPaginationMeta(
    total: number,
    page: number,
    limit: number
): ApiResponse["meta"] {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

// =============================================================================
// API HANDLER WRAPPER
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiHandler = (request: Request, context?: any) => Promise<NextResponse>;

export function withErrorHandler(handler: ApiHandler): ApiHandler {
    return async (request: Request, context?: any) => {
        try {
            return await handler(request, context);
        } catch (error) {
            console.error("API Error:", error);

            if (error instanceof ZodError) {
                return validationErrorResponse(error);
            }

            if (error instanceof AuthError) {
                const status = error.code === ErrorCodes.UNAUTHORIZED ? 401 : 403;
                return errorResponse(error.code, error.message, status);
            }

            if (error instanceof NotFoundError) {
                return errorResponse(error.code, error.message, 404);
            }

            if (error instanceof ValidationError) {
                return errorResponse(error.code, error.message, 400, error.details);
            }

            // Unknown error
            return errorResponse(
                ErrorCodes.INTERNAL_ERROR,
                process.env.NODE_ENV === "development"
                    ? (error as Error).message
                    : "Terjadi kesalahan pada server",
                500
            );
        }
    };
}

// =============================================================================
// SOFT DELETE HELPERS
// =============================================================================

export function softDeleteData(userId: string) {
    return {
        deletedAt: new Date(),
        deletedBy: userId,
    };
}

export function restoreData() {
    return {
        deletedAt: null,
        deletedBy: null,
    };
}
