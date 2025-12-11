// =============================================================================
// USER ROLES & STATUS TYPES (aligned with Prisma schema)
// =============================================================================

export type UserRole =
    | "SUPER_ADMIN"
    | "ADMIN"
    | "OWNER"
    | "AGENT"
    | "TENANT"
    | "USER";

export type VerificationStatus =
    | "PENDING"
    | "VERIFIED"
    | "REJECTED"
    | "SUSPENDED";

export type PropertyType =
    | "KOS"
    | "KONTRAKAN"
    | "VILLA"
    | "HOUSE"
    | "LAND"
    | "APARTMENT";

export type ListingType = "RENT" | "SALE";

export type RoomStatus =
    | "AVAILABLE"
    | "OCCUPIED"
    | "RESERVED"
    | "MAINTENANCE";

export type ResidentStatus =
    | "ACTIVE"
    | "ENDED"
    | "SUSPENDED";

export type PaymentStatus =
    | "PENDING"
    | "PAID"
    | "OVERDUE"
    | "CANCELLED"
    | "REFUNDED";

export type PaymentType =
    | "RENT"
    | "DEPOSIT"
    | "UTILITY"
    | "OTHER";

export type PaymentMethod =
    | "CASH"
    | "BANK_TRANSFER"
    | "EWALLET"
    | "CARD"
    | "VIRTUAL_ACCOUNT";

export type BookingStatus =
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED"
    | "REJECTED";

export type CertificateType =
    | "SHM"
    | "HGB"
    | "AJB"
    | "GIRIK"
    | "STRATA"
    | "PPJB"
    | "OTHER";

export type MessageType =
    | "TEXT"
    | "IMAGE"
    | "DOCUMENT"
    | "SYSTEM";

export type ReportType =
    | "SPAM"
    | "FRAUD"
    | "INAPPROPRIATE"
    | "FAKE_LISTING"
    | "FAKE_ACCOUNT"
    | "OTHER";

export type ReportStatus =
    | "PENDING"
    | "INVESTIGATING"
    | "RESOLVED"
    | "DISMISSED";

export type SubscriptionStatus =
    | "ACTIVE"
    | "CANCELLED"
    | "EXPIRED"
    | "SUSPENDED";

export type Gender = "MALE" | "FEMALE";

export type MaritalStatus =
    | "SINGLE"
    | "MARRIED"
    | "DIVORCED"
    | "WIDOWED";

// =============================================================================
// SESSION & PAGINATION TYPES
// =============================================================================

export interface SessionUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    verificationStatus: VerificationStatus;
    trustScore: number;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ListResult<T> {
    items: T[];
    meta: PaginationMeta;
}

export interface ListParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
}
