import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** true quando há uma conexão de banco configurada (DATABASE_URL). */
export const hasDatabase = Boolean(process.env.DATABASE_URL);

/**
 * Retorna o Prisma Client apenas quando há DATABASE_URL configurada.
 * Sem banco, retorna null e a aplicação usa os dados estáticos de lib/data/.
 * Isso mantém o build e o deploy funcionando mesmo sem banco conectado.
 */
export function getPrisma(): PrismaClient | null {
  if (!hasDatabase) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
