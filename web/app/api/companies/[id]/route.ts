import { db } from '@/src/prisma/db';
import { ok, fail, handle } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const company = await db.orm.public.Company
      .include('boats', (b) => b.select('id', 'name', 'capacity', 'status'))
      .include('trips', (t) => t.count())
      .first({ id });
    if (!company) return fail('NOT_FOUND', 'Compagnie introuvable', 404);
    return ok(company);
  });
}