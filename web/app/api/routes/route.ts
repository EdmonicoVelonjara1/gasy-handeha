import { db } from '@/src/prisma/db';
import { ok, handle } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return handle(async () => {
    const routes = await db.orm.public.Route
      .include('originPort', (p) => p.select('id', 'name', 'code', 'city'))
      .include('destinationPort', (p) => p.select('id', 'name', 'code', 'city'))
      .orderBy([(r) => r.originPortId.asc(), (r) => r.destinationPortId.asc()])
      .all();
    return ok(routes);
  });
}