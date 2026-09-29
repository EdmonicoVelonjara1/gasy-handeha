import { db } from '@/src/prisma/db';
import { ok, handle } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return handle(async () => {
    const sp = new URL(req.url).searchParams;
    const bookingId = sp.get('bookingId') ?? undefined;
    const status = sp.get('status') ?? undefined;

    let payments = db.orm.public.Payment;
    if (bookingId) payments = payments.where((p) => p.bookingId.eq(bookingId));
    if (status) payments = payments.where((p) => p.status.eq(status));

    const data = await payments
      .include('booking', (b) => b.select('id', 'reference', 'totalAmount', 'status'))
      .orderBy((p) => p.createdAt.desc())
      .all();
    return ok(data);
  });
}