import { db } from '@/src/prisma/db';
import { ok, fail, handle, ApiFailure, genRef } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const booking = await db.orm.public.Booking
      .include('user', (u) => u.select('id', 'fullName', 'email', 'phone'))
      .include('trip', (t) =>
        t
          .select('id', 'departureTime', 'arrivalTime', 'status', 'pricePerSeat')
          .include('boat', (b) => b.select('id', 'name', 'capacity'))
          .include('route', (r) =>
            r
              .include('originPort', (p) => p.select('id', 'name', 'code', 'city'))
              .include('destinationPort', (p) => p.select('id', 'name', 'code', 'city')),
          ),
      )
      .include('tickets', (t) => t.select('id', 'ticketNumber', 'passengerName', 'status', 'seatNumber'))
      .include('payments', (p) => p.select('id', 'amount', 'provider', 'reference', 'status', 'paidAt'))
      .first({ id });
    if (!booking) return fail('NOT_FOUND', 'Réservation introuvable', 404);
    return ok(booking);
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) throw new ApiFailure('INVALID_JSON', 'Corps JSON invalide', 400);

    const patch: Record<string, unknown> = {};
    if (body.status !== undefined) {
      if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(String(body.status))) {
        throw new ApiFailure('VALIDATION_ERROR', "status invalide", 400);
      }
      patch.status = body.status;
    }
    if (body.paymentStatus !== undefined) {
      if (!['UNPAID', 'PAID', 'REFUNDED'].includes(String(body.paymentStatus))) {
        throw new ApiFailure('VALIDATION_ERROR', "paymentStatus invalide", 400);
      }
      patch.paymentStatus = body.paymentStatus;
    }

    await db.transaction(async (tx) => {
      const booking = await tx.orm.public.Booking.first({ id });
      if (!booking) throw new ApiFailure('NOT_FOUND', 'Réservation introuvable', 404);

      if (body.paymentStatus === 'PAID') {
        const alreadyPaid = await tx.orm.public.Payment.where((p) => p.bookingId.eq(id))
          .where((p) => p.status.eq('PAID'))
          .first();
        if (!alreadyPaid) {
          await tx.orm.public.Payment.create({
            bookingId: id,
            amount: booking.totalAmount,
            provider: 'MANUAL',
            reference: genRef('PAY'),
            status: 'PAID',
            paidAt: new Date().toISOString(),
          });
        }
      }

      if (Object.keys(patch).length > 0) {
        await tx.orm.public.Booking.where({ id }).update(patch);
      }
    });

    const booking = await db.orm.public.Booking
      .include('user', (u) => u.select('id', 'fullName', 'email'))
      .include('payments', (p) => p.select('id', 'amount', 'provider', 'reference', 'status', 'paidAt'))
      .first({ id });
    return ok(booking);
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;

    await db.transaction(async (tx) => {
      const booking = await tx.orm.public.Booking.first({ id });
      if (!booking) throw new ApiFailure('NOT_FOUND', 'Réservation introuvable', 404);

      // Supprime la réservation (tickets + paiements en cascade) puis libère les sièges.
      await tx.orm.public.Booking.where({ id }).delete();

      const trip = await tx.orm.public.Trip.first({ id: booking.tripId });
      if (trip) {
        await tx.orm.public.Trip.where({ id: trip.id }).update({
          availableSeats: trip.availableSeats + booking.seatsCount,
        });
      }
    });

    return ok({ deleted: true });
  });
}