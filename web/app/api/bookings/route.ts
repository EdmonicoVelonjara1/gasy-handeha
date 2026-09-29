import { db } from '@/src/prisma/db';
import { ok, handle, ApiFailure, genRef } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface BookingInput {
  userId?: string;
  tripId?: string;
  seatsCount?: number;
  passengerNames?: string[];
}

export async function GET(req: Request) {
  return handle(async () => {
    const sp = new URL(req.url).searchParams;
    const userId = sp.get('userId') ?? undefined;
    const tripId = sp.get('tripId') ?? undefined;
    const status = sp.get('status') ?? undefined;
    const paymentStatus = sp.get('paymentStatus') ?? undefined;

    let bookings = db.orm.public.Booking;
    if (userId) bookings = bookings.where((b) => b.userId.eq(userId));
    if (tripId) bookings = bookings.where((b) => b.tripId.eq(tripId));
    if (status) bookings = bookings.where((b) => b.status.eq(status));
    if (paymentStatus) bookings = bookings.where((b) => b.paymentStatus.eq(paymentStatus));

    const data = await bookings
      .include('user', (u) => u.select('id', 'fullName', 'email', 'phone'))
      .include('trip', (t) =>
        t
          .select('id', 'departureTime', 'status', 'pricePerSeat')
          .include('route', (r) =>
            r
              .include('originPort', (p) => p.select('id', 'name', 'code', 'city'))
              .include('destinationPort', (p) => p.select('id', 'name', 'code', 'city')),
          ),
      )
      .include('payments', (p) => p.select('id', 'amount', 'provider', 'status', 'paidAt'))
      .include('tickets', (t) => t.select('id', 'ticketNumber', 'passengerName', 'status'))
      .orderBy((b) => b.createdAt.desc())
      .all();
    return ok(data);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const body = (await req.json().catch(() => null)) as BookingInput | null;
    if (!body) throw new ApiFailure('INVALID_JSON', 'Corps JSON invalide', 400);

    const { userId, tripId, seatsCount = 1, passengerNames } = body;
    if (!userId || !tripId) {
      throw new ApiFailure('VALIDATION_ERROR', 'userId et tripId sont requis', 400);
    }
    if (!Number.isInteger(seatsCount) || seatsCount < 1) {
      throw new ApiFailure('VALIDATION_ERROR', 'seatsCount doit être un entier >= 1', 400);
    }

    const result = await db.transaction(async (tx) => {
      const trip = await tx.orm.public.Trip.first({ id: tripId });
      if (!trip) throw new ApiFailure('NOT_FOUND', 'Traversée introuvable', 404);
      if (trip.availableSeats < seatsCount) {
        throw new ApiFailure('CAPACITY_EXCEEDED', `Plus que ${trip.availableSeats} place(s) disponible(s)`, 409);
      }

      const user = await tx.orm.public.User.first({ id: userId });
      if (!user) throw new ApiFailure('NOT_FOUND', 'Utilisateur introuvable', 404);

      const booking = await tx.orm.public.Booking.create({
        reference: genRef('BK'),
        userId,
        tripId,
        seatsCount,
        totalAmount: trip.pricePerSeat * seatsCount,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      });

      const tickets = [];
      for (let i = 0; i < seatsCount; i++) {
        tickets.push(
          await tx.orm.public.Ticket.create({
            ticketNumber: genRef('TKT'),
            bookingId: booking.id,
            passengerName: passengerNames?.[i]?.trim() || user.fullName,
            status: 'VALID',
          }),
        );
      }

      await tx.orm.public.Trip.where({ id: tripId }).update({
        availableSeats: trip.availableSeats - seatsCount,
      });

      return { booking, tickets };
    });

    return ok(result, 201);
  });
}