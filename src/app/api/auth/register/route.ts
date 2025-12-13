import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
    successResponse,
    errorResponse,
    ErrorCodes,
    withErrorHandler,
} from "@/lib/api-utils";
import { z } from "zod";

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const baseRegisterSchema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    phone: z.string().regex(/^(\+62|62|08)[0-9]{8,12}$/, "Format nomor HP tidak valid").optional(),
    password: z.string().min(8, "Password minimal 8 karakter"),
    role: z.enum(["USER", "TENANT", "OWNER", "AGENT"]).default("USER"),
});

const ownerAgentSchema = baseRegisterSchema.extend({
    role: z.enum(["OWNER", "AGENT"]),
    ktpNumber: z.string().length(16, "NIK harus 16 digit").optional(),
    businessName: z.string().min(3, "Nama usaha minimal 3 karakter").optional(),
    businessAddress: z.string().min(10, "Alamat usaha minimal 10 karakter").optional(),
    npwp: z.string().optional(),
    agentLicense: z.string().optional(),
});

// =============================================================================
// POST /api/auth/register - Register new user
// =============================================================================

export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const role = body.role || "USER";

    // Parse based on role
    let data;
    try {
        if (role === "OWNER" || role === "AGENT") {
            data = ownerAgentSchema.parse(body);
        } else {
            data = baseRegisterSchema.parse(body);
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issues = error.issues;
            return errorResponse(
                ErrorCodes.VALIDATION_ERROR,
                issues[0]?.message || "Data tidak valid",
                400
            );
        }
        throw error;
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

    // Role-based settings:
    // USER/TENANT: active immediately, can login
    // OWNER/AGENT: needs admin approval before login
    const needsApproval = role === "OWNER" || role === "AGENT";
    const isActive = !needsApproval;
    const verificationStatus = needsApproval ? "PENDING" : "PENDING";

    // Build user data
    const userData: Record<string, unknown> = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        passwordHash,
        role: data.role,
        verificationStatus,
        isActive,
        trustScore: isActive ? 5 : 0,
    };

    // Add OWNER/AGENT specific fields
    if (role === "OWNER" || role === "AGENT") {
        const ownerData = data as z.infer<typeof ownerAgentSchema>;
        userData.ktpNumber = ownerData.ktpNumber || null;
        userData.businessName = ownerData.businessName || null;
        userData.businessAddress = ownerData.businessAddress || null;
        userData.npwp = ownerData.npwp || null;
        if (role === "AGENT") {
            userData.agentLicense = ownerData.agentLicense || null;
        }
    }

    // Create user
    const user = await prisma.user.create({
        data: userData as Parameters<typeof prisma.user.create>[0]["data"],
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
            action: "REGISTER",
            entityType: "users",
            entityId: user.id,
            newData: {
                email: user.email,
                name: user.name,
                role: user.role,
            },
        },
    });

    // Notify admins for OWNER/AGENT registration
    if (needsApproval) {
        const admins = await prisma.user.findMany({
            where: {
                role: { in: ["SUPER_ADMIN", "ADMIN"] },
                isActive: true,
                deletedAt: null,
            },
            select: { id: true },
        });

        if (admins.length > 0) {
            await prisma.notification.createMany({
                data: admins.map((admin) => ({
                    userId: admin.id,
                    type: "VERIFICATION_REQUEST",
                    title: `Registrasi ${role} Baru`,
                    content: `${user.name} mendaftar sebagai ${role}. Mohon review dan verifikasi.`,
                    data: { userId: user.id, role },
                })),
            });
        }
    }

    const message = needsApproval
        ? "Registrasi berhasil! Akun Anda akan direview oleh admin dalam 1-3 hari kerja."
        : "Registrasi berhasil! Silakan login.";

    return successResponse({ user, message }, undefined, 201);
});
