import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
    successResponse,
    errorResponse,
    ErrorCodes,
    withErrorHandler,
} from "@/lib/api-utils";
import {
    registerUserSchema,
    registerOwnerSchema,
    registerAgentSchema,
    type RegisterUserInput,
} from "@/lib/validations";

// =============================================================================
// POST /api/auth/register - Register new user
// =============================================================================

export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();

    // Determine which schema to use based on role
    let data: RegisterUserInput;

    try {
        if (body.role === "AGENT") {
            data = registerAgentSchema.parse(body);
        } else if (body.role === "OWNER") {
            data = registerOwnerSchema.parse(body);
        } else {
            data = registerUserSchema.parse(body);
        }
    } catch (error: any) {
        return errorResponse(
            ErrorCodes.VALIDATION_ERROR,
            error.errors?.[0]?.message || "Data tidak valid",
            400
        );
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingEmail) {
        return errorResponse(
            ErrorCodes.ALREADY_EXISTS,
            "Email sudah terdaftar",
            409
        );
    }

    // Check if phone already exists (if provided)
    if (data.phone) {
        const existingPhone = await prisma.user.findUnique({
            where: { phone: data.phone },
        });

        if (existingPhone) {
            return errorResponse(
                ErrorCodes.ALREADY_EXISTS,
                "Nomor HP sudah terdaftar",
                409
            );
        }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Determine verification status based on role
    // USER: can login immediately
    // OWNER/AGENT: needs admin verification
    const verificationStatus = data.role === "USER" ? "PENDING" : "PENDING";
    const isActive = data.role === "USER"; // USER active immediately, OWNER/AGENT need approval

    // Create user
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            passwordHash,
            role: data.role,
            verificationStatus,
            isActive,
            trustScore: 0,
            // Owner/Agent specific fields
            ...(data.role === "OWNER" || data.role === "AGENT"
                ? {
                    ktpNumber: (body as any).ktpNumber,
                    businessName: (body as any).businessName,
                    businessAddress: (body as any).businessAddress,
                    npwp: (body as any).npwp,
                }
                : {}),
            // Agent specific
            ...(data.role === "AGENT"
                ? {
                    agentLicense: (body as any).agentLicense,
                }
                : {}),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            verificationStatus: true,
            isActive: true,
            createdAt: true,
        },
    });

    // Create audit log
    await prisma.auditLog.create({
        data: {
            userId: user.id,
            action: "CREATE",
            entityType: "users",
            entityId: user.id,
            newData: {
                email: user.email,
                name: user.name,
                role: user.role,
            },
        },
    });

    // Create notification for admin if OWNER/AGENT registration
    if (data.role === "OWNER" || data.role === "AGENT") {
        // Get all admins
        const admins = await prisma.user.findMany({
            where: {
                role: { in: ["SUPER_ADMIN", "ADMIN"] },
                isActive: true,
            },
            select: { id: true },
        });

        // Create notification for each admin
        if (admins.length > 0) {
            await prisma.notification.createMany({
                data: admins.map((admin) => ({
                    userId: admin.id,
                    type: "VERIFICATION_REQUEST",
                    title: `Registrasi ${data.role} Baru`,
                    content: `${user.name} mendaftar sebagai ${data.role}. Mohon review dan verifikasi.`,
                    data: { userId: user.id, role: data.role },
                })),
            });
        }
    }

    const message =
        data.role === "USER"
            ? "Registrasi berhasil! Silakan login."
            : "Registrasi berhasil! Akun Anda akan direview oleh admin dalam 1-3 hari kerja.";

    return successResponse(
        {
            user,
            message,
        },
        undefined,
        201
    );
});
