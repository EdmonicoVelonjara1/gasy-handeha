import { db } from '@/src/prisma/db';
import { ok, handle } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return handle(async () => {
    const sp = new URL(req.url).searchParams;
    const bookingId = sp.get('bookingId') ?? undefined;
    const status = sp.get('status') ?? undefined;

    let tickets = db.orm.public.Ticket;
    if (bookingId) tickets = tickets.where((t) => t.bookingId.eq(bookingId));
    if (status) tickets = tickets.where((t) => t.status.eq(status));

    const data = await tickets
      .include('booking', (b) => b.select('id', 'reference', 'status'))
      .orderBy((t) => t.createdAt.desc())
      .all();
    return ok(data);
  });
}