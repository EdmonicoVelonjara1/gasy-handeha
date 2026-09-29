import { db } from '@/src/prisma/db';
import { ok, fail, handle } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return handle(async () => {
    const sp = new URL(req.url).searchParams;
    const companyId = sp.get('companyId') ?? undefined;
    const status = sp.get('status') ?? undefined;

    let boats = db.orm.public.Boat;
    if (companyId) boats = boats.where((b) => b.companyId.eq(companyId));
    if (status) boats = boats.where((b) => b.status.eq(status));

    const data = await boats
      .include('company', (c) => c.select('id', 'name', 'slug'))
      .orderBy((b) => b.name.asc())
      .all();
    return ok(data);
  });
}