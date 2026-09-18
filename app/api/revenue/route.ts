import { db } from '@/src/prisma/db';
import { ok, handle } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Série de revenus (Ar) sur les 7 derniers jours, à partir des réservations payées. */
export async function GET() {
  return handle(async () => {
    const paid = await db.orm.public.Booking
      .select('id', 'totalAmount', 'createdAt')
      .where((b) => b.paymentStatus.eq('PAID'))
      .all();

    const today = new Date();
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      days.push(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i)).toISOString().slice(0, 10));
    }

    const byDay = new Map<string, number>(days.map((d) => [d, 0]));
    for (const b of paid) {
      const day = b.createdAt.slice(0, 10);
      if (byDay.has(day)) byDay.set(day, byDay.get(day)! + b.totalAmount);
    }

    return ok(days.map((day) => ({ day, value: byDay.get(day)! })));
  });
}