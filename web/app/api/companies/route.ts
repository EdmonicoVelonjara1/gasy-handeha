import { db } from '@/src/prisma/db';
import { ok, handle } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return handle(async () => {
    const companies = await db.orm.public.Company
      .include('boats', (b) => b.select('id', 'name', 'capacity', 'status').orderBy((x) => x.name.asc()))
      .orderBy((c) => c.name.asc())
      .all();
    return ok(companies);
  });
}