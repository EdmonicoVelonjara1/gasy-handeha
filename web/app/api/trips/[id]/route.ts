import { db } from '@/src/prisma/db';
import { ok, fail, handle, ApiFailure, isIsoDate } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Requête détail d'une traversée : réservations + utilisateurs + relations route/bateau/compagnie. */
function tripDetail(id: string) {
  return db.orm.public.Trip
    .include('company', (c) => c.select('id', 'name', 'slug'))
    .include('boat', (b) => b.select('id', 'name', 'capacity'))
    .include('route', (r) =>
      r
        .include('originPort', (p) => p.select('id', 'name', 'code', 'city'))
        .include('destinationPort', (p) => p.select('id', 'name', 'code', 'city')),
    )
    .include('bookings', (b) =>
      b
        .select('id', 'reference', 'seatsCount', 'totalAmount', 'status', 'paymentStatus', 'createdAt')
        .include('user', (u) => u.select('id', 'fullName', 'email', 'phone'))
        .orderBy((x) => x.createdAt.desc()),
    )
    .first({ id });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const trip = await tripDetail(id);
    if (!trip) return fail('NOT_FOUND', 'Traversée introuvable', 404);
    return ok(trip);
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const existing = await db.orm.public.Trip.first({ id });
    if (!existing) return fail('NOT_FOUND', 'Traversée introuvable', 404);

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) throw new ApiFailure('INVALID_JSON', 'Corps JSON invalide', 400);

    const patch: Record<string, unknown> = {};
    for (const key of ['status', 'code'] as const) {
      if (body[key] !== undefined) patch[key] = body[key];
    }
    if (body.pricePerSeat !== undefined) {
      const price = Number(body.pricePerSeat);
      if (!Number.isInteger(price) || price <= 0) {
        throw new ApiFailure('VALIDATION_ERROR', 'pricePerSeat doit être un entier positif (Ar)', 400);
      }
      patch.pricePerSeat = price;
    }
    if (body.availableSeats !== undefined) {
      const seats = Number(body.availableSeats);
      if (!Number.isInteger(seats) || seats < 0) {
        throw new ApiFailure('VALIDATION_ERROR', 'availableSeats doit être un entier >= 0', 400);
      }
      patch.availableSeats = seats;
    }
    if (body.departureTime !== undefined) {
      if (!isIsoDate(body.departureTime)) {
        throw new ApiFailure('VALIDATION_ERROR', 'departureTime doit être une date ISO 8601', 400);
      }
      patch.departureTime = new Date(body.departureTime as string).toISOString();
    }
    if (body.arrivalTime !== undefined) {
      if (body.arrivalTime === null) {
        patch.arrivalTime = null;
      } else if (isIsoDate(body.arrivalTime)) {
        patch.arrivalTime = new Date(body.arrivalTime as string).toISOString();
      } else {
        throw new ApiFailure('VALIDATION_ERROR', 'arrivalTime doit être une date ISO 8601 ou null', 400);
      }
    }

    if (Object.keys(patch).length > 0) {
      await db.orm.public.Trip.where({ id }).update(patch);
    }
    const trip = await tripDetail(id);
    return ok(trip);
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const trip = await db.orm.public.Trip.first({ id });
    if (!trip) return fail('NOT_FOUND', 'Traversée introuvable', 404);

    const bookingCount = await db.orm.public.Booking
      .where((b) => b.tripId.eq(id))
      .aggregate((a) => ({ n: a.count() }));
    if (bookingCount.n > 0) {
      throw new ApiFailure('HAS_CHILDREN', 'Suppression impossible : des réservations sont rattachées à cette traversée', 409);
    }

    await db.orm.public.Trip.where({ id }).delete();
    return ok({ deleted: true });
  });
}