import { db } from '@/src/prisma/db';
import { ok, handle } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return handle(async () => {
    const ports = await db.orm.public.Port.orderBy((p) => p.name.asc()).all();
    return ok(ports);
  });
}