// scripts/seed.ts — Point d'entrée pour remplir la base depuis src/prisma/seed.ts.
// Usage : pnpm db:seed   (équivaut à : pnpm exec tsx scripts/seed.ts)
import { db } from '../src/prisma/db';
import { seedDatabase } from '../src/prisma/seed';

try {
  await seedDatabase();
} finally {
  // Fermeture du pool pour que le script se termine (sinon le process reste bloqué).
  await db.close();
}