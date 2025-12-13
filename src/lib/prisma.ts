import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  // Check if we have Accelerate URL (for production/Vercel)
  const accelerateUrl = process.env.PRISMA_DATABASE_URL;
  
  if (accelerateUrl) {
    // Use Prisma Accelerate for serverless
    return new PrismaClient({
      accelerateUrl,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  
  // Use direct PostgreSQL connection with pg adapter for local development
  const connectionString = process.env.DATABASE_URL!;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
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
