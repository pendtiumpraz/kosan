import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Simple Prisma Client - works with Prisma Accelerate via DATABASE_URL
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

// =============================================================================
// SOFT DELETE HELPER - Use in all queries
// =============================================================================

// Add this to where clause for all queries on soft-deletable models
export const notDeleted = { deletedAt: null };
