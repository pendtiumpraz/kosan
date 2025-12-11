import { z } from "zod";

// =============================================================================
// COMMON SCHEMAS
// =============================================================================

export const idSchema = z.string().cuid();

export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// =============================================================================
// USER SCHEMAS
// =============================================================================

export const userRoleSchema = z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "OWNER",
    "AGENT",
    "TENANT",
    "USER",
]);

// Base schema without refine - can be extended
const registerUserBaseSchema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    phone: z.string()
        .regex(/^(\+62|08)[0-9]{8,12}$/, "Format: +62xxx atau 08xxx")
        .optional(),
    password: z.string()
        .min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().optional(),
    role: z.enum(["USER", "OWNER", "AGENT"]).default("USER"),
});

// With refine for registration
export const registerUserSchema = registerUserBaseSchema.refine(
    (data) => !data.confirmPassword || data.password === data.confirmPassword,
    {
        message: "Konfirmasi password tidak cocok",
        path: ["confirmPassword"],
    }
);

// Owner extends base (not refined)
export const registerOwnerSchema = registerUserBaseSchema.extend({
    role: z.literal("OWNER"),
    ktpNumber: z.string().length(16, "NIK harus 16 digit"),
    businessName: z.string().min(3, "Nama usaha minimal 3 karakter"),
    businessAddress: z.string().min(10, "Alamat usaha minimal 10 karakter"),
    propertyType: z.enum(["KOS", "KONTRAKAN", "VILLA", "HOUSE", "LAND", "APARTMENT"]),
    npwp: z.string().optional(),
});

// Agent extends base with additional fields
export const registerAgentSchema = registerUserBaseSchema.extend({
    role: z.literal("AGENT"),
    ktpNumber: z.string().length(16, "NIK harus 16 digit"),
    businessName: z.string().min(3, "Nama usaha minimal 3 karakter"),
    businessAddress: z.string().min(10, "Alamat usaha minimal 10 karakter"),
    propertyType: z.enum(["KOS", "KONTRAKAN", "VILLA", "HOUSE", "LAND", "APARTMENT"]),
    npwp: z.string().optional(),
    agentLicense: z.string().min(5, "Nomor lisensi wajib diisi"),
});

export const updateUserSchema = z.object({
    name: z.string().min(3).optional(),
    phone: z.string().regex(/^\+62[0-9]{9,12}$/).optional(),
    avatar: z.string().url().optional(),
    dateOfBirth: z.coerce.date().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    address: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
});

// =============================================================================
// PROPERTY SCHEMAS
// =============================================================================

export const propertyTypeSchema = z.enum([
    "KOS",
    "KONTRAKAN",
    "VILLA",
    "HOUSE",
    "LAND",
    "APARTMENT",
]);

export const certificateTypeSchema = z.enum([
    "SHM",
    "HGB",
    "AJB",
    "GIRIK",
    "STRATA",
    "PPJB",
    "OTHER",
]);

export const createPropertySchema = z.object({
    name: z.string().min(3, "Nama properti minimal 3 karakter"),
    type: propertyTypeSchema,
    description: z.string().optional(),
    address: z.string().min(10, "Alamat minimal 10 karakter"),
    province: z.string().min(2),
    city: z.string().min(2),
    district: z.string().optional(),
    subdistrict: z.string().optional(),
    postalCode: z.string().optional(),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    landArea: z.coerce.number().positive().optional(),
    buildingArea: z.coerce.number().positive().optional(),
    totalRooms: z.coerce.number().min(0).default(0),
    totalFloors: z.coerce.number().min(1).default(1),
    yearBuilt: z.coerce.number().min(1900).max(new Date().getFullYear()).optional(),
    certificate: certificateTypeSchema.optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

// =============================================================================
// ROOM SCHEMAS
// =============================================================================

export const roomStatusSchema = z.enum([
    "AVAILABLE",
    "OCCUPIED",
    "RESERVED",
    "MAINTENANCE",
]);

export const createRoomSchema = z.object({
    propertyId: idSchema,
    name: z.string().min(1, "Nama kamar wajib diisi"),
    floor: z.coerce.number().min(1).default(1),
    roomSize: z.coerce.number().positive().optional(),
    priceDaily: z.coerce.number().positive().optional(),
    priceMonthly: z.coerce.number().positive().optional(),
    priceYearly: z.coerce.number().positive().optional(),
    deposit: z.coerce.number().min(0).optional(),
    status: roomStatusSchema.default("AVAILABLE"),
});

export const updateRoomSchema = createRoomSchema.partial().omit({ propertyId: true });

// =============================================================================
// RESIDENT SCHEMAS
// =============================================================================

export const genderSchema = z.enum(["MALE", "FEMALE"]);

export const maritalStatusSchema = z.enum([
    "SINGLE",
    "MARRIED",
    "DIVORCED",
    "WIDOWED",
]);

export const createResidentSchema = z.object({
    propertyId: idSchema,
    roomId: idSchema.optional(),
    userId: idSchema.optional(),

    // Personal Info
    fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    ktpNumber: z.string().length(16, "NIK harus 16 digit"),
    ktpImageUrl: z.string().url().optional(),
    selfieUrl: z.string().url().optional(),
    dateOfBirth: z.coerce.date().optional(),
    placeOfBirth: z.string().optional(),
    gender: genderSchema.optional(),
    religion: z.string().optional(),
    maritalStatus: maritalStatusSchema.optional(),
    occupation: z.string().optional(),
    phone: z.string().min(10, "Nomor HP minimal 10 digit"),
    email: z.string().email().optional(),
    originAddress: z.string().optional(),

    // Emergency Contact
    emergencyName: z.string().optional(),
    emergencyRelation: z.string().optional(),
    emergencyPhone: z.string().optional(),
    emergencyAddress: z.string().optional(),

    // Rental Info
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date().optional(),
    rentalPrice: z.coerce.number().positive("Harga sewa wajib diisi"),
    depositAmount: z.coerce.number().min(0).optional(),
    paymentDueDay: z.coerce.number().min(1).max(31).default(1),
    notes: z.string().optional(),
});

export const updateResidentSchema = createResidentSchema.partial().omit({ propertyId: true });

// =============================================================================
// PAYMENT SCHEMAS
// =============================================================================

export const paymentTypeSchema = z.enum([
    "RENT",
    "DEPOSIT",
    "UTILITY",
    "OTHER",
]);

export const paymentMethodSchema = z.enum([
    "CASH",
    "BANK_TRANSFER",
    "EWALLET",
    "CARD",
    "VIRTUAL_ACCOUNT",
]);

export const paymentStatusSchema = z.enum([
    "PENDING",
    "PAID",
    "OVERDUE",
    "CANCELLED",
    "REFUNDED",
]);

export const createPaymentSchema = z.object({
    residentId: idSchema,
    propertyId: idSchema,
    paymentType: paymentTypeSchema,
    amount: z.coerce.number().positive("Jumlah pembayaran wajib diisi"),
    periodStart: z.coerce.date().optional(),
    periodEnd: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    paymentMethod: paymentMethodSchema.optional(),
    notes: z.string().optional(),
});

export const updatePaymentSchema = z.object({
    status: paymentStatusSchema.optional(),
    paidDate: z.coerce.date().optional(),
    paymentMethod: paymentMethodSchema.optional(),
    paymentProofUrl: z.string().url().optional(),
    notes: z.string().optional(),
});

// =============================================================================
// LISTING SCHEMAS
// =============================================================================

export const listingTypeSchema = z.enum(["RENT", "SALE"]);

export const createListingSchema = z.object({
    propertyId: idSchema.optional(),
    title: z.string().min(10, "Judul minimal 10 karakter"),
    listingType: listingTypeSchema,
    propertyType: propertyTypeSchema,
    description: z.string().optional(),

    // Location
    address: z.string().min(10),
    province: z.string().min(2),
    city: z.string().min(2),
    district: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),

    // Specs
    landArea: z.coerce.number().positive().optional(),
    buildingArea: z.coerce.number().positive().optional(),
    bedrooms: z.coerce.number().min(0).optional(),
    bathrooms: z.coerce.number().min(0).optional(),
    floors: z.coerce.number().min(1).default(1),
    certificate: certificateTypeSchema.optional(),
    condition: z.enum(["NEW", "GOOD", "RENOVATED", "NEEDS_REPAIR"]).optional(),
    furnished: z.enum(["UNFURNISHED", "SEMI", "FULLY"]).optional(),

    // Pricing
    price: z.coerce.number().positive("Harga wajib diisi"),
    pricePeriod: z.enum(["DAILY", "MONTHLY", "YEARLY", "ONCE"]).optional(),
    isNegotiable: z.boolean().default(true),
    depositAmount: z.coerce.number().min(0).optional(),

    // Facilities
    facilities: z.array(z.string()).optional(),
});

export const updateListingSchema = createListingSchema.partial();

// =============================================================================
// BOOKING SCHEMAS
// =============================================================================

export const createBookingSchema = z.object({
    listingId: idSchema,
    roomId: idSchema.optional(),
    bookingType: z.enum(["RENT", "VISIT", "PURCHASE"]),
    checkIn: z.coerce.date().optional(),
    checkOut: z.coerce.date().optional(),
    guests: z.coerce.number().min(1).default(1),
    notes: z.string().optional(),
});

// =============================================================================
// CHAT SCHEMAS
// =============================================================================

export const createChatSchema = z.object({
    participantId: idSchema,
    propertyId: idSchema.optional(),
    listingId: idSchema.optional(),
});

export const sendMessageSchema = z.object({
    chatId: idSchema,
    messageType: z.enum(["TEXT", "IMAGE", "DOCUMENT"]).default("TEXT"),
    content: z.string().optional(),
    mediaUrl: z.string().url().optional(),
}).refine(
    (data) => data.content || data.mediaUrl,
    { message: "Pesan atau media wajib diisi" }
);

// =============================================================================
// REPORT SCHEMAS
// =============================================================================

export const createReportSchema = z.object({
    targetUserId: idSchema.optional(),
    targetListingId: idSchema.optional(),
    targetPropertyId: idSchema.optional(),
    reportType: z.enum([
        "SPAM",
        "FRAUD",
        "INAPPROPRIATE",
        "FAKE_LISTING",
        "FAKE_ACCOUNT",
        "OTHER",
    ]),
    description: z.string().min(20, "Deskripsi minimal 20 karakter"),
    evidence: z.string().optional(),
}).refine(
    (data) => data.targetUserId || data.targetListingId || data.targetPropertyId,
    { message: "Target laporan wajib diisi" }
);

// =============================================================================
// EXPORT TYPES
// =============================================================================

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;
export type RegisterAgentInput = z.infer<typeof registerAgentSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;

export type CreateResidentInput = z.infer<typeof createResidentSchema>;
export type UpdateResidentInput = z.infer<typeof updateResidentSchema>;

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateChatInput = z.infer<typeof createChatSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
