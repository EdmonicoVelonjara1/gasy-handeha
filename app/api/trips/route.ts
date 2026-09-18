import { NextRequest } from 'next/server';
import { db } from '@/src/prisma/db';
import { ok, fail, handle, ApiFailure, genRef, isIsoDate } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TripInput {
  companyId?: string;
  boatId?: string;
  routeId?: string;
  code?: string;
  departureTime?: string;
  pricePerSeat?: number;
  availableSeats?: number;
  status?: string;
}

export async function GET(req: NextRequest) {
  return handle(async () => {
    const sp = req.nextUrl.searchParams;
    const status = sp.get('status') ?? undefined;
    const companyId = sp.get('companyId') ?? undefined;
    const boatId = sp.get('boatId') ?? undefined;
    const routeId = sp.get('routeId') ?? undefined;
    const upcoming = sp.get('upcoming') === 'true';
    const limit = Number(sp.get('limit') ?? '0') || undefined;

    let trips = db.orm.public.Trip;
    if (status) trips = trips.where((t) => t.status.eq(status));
    if (companyId) trips = trips.where((t) => t.companyId.eq(companyId));
    if (boatId) trips = trips.where((t) => t.boatId.eq(boatId));
    if (routeId) trips = trips.where((t) => t.routeId.eq(routeId));

    if (upcoming) {
      trips = trips.where((t) => t.departureTime.gte(new Date().toISOString()));
      trips = trips.orderBy((t) => t.departureTime.asc());
    } else {
      trips = trips.orderBy((t) => t.departureTime.desc());
    }

    if (limit) trips = trips.limit(limit);

    const data = await trips
      .include('company', (c) => c.select('id', 'name', 'slug'))
      .include('boat', (b) => b.select('id', 'name', 'capacity'))
      .include('route', (r) =>
        r
          .include('originPort', (p) => p.select('id', 'name', 'code', 'city'))
          .include('destinationPort', (p) => p.select('id', 'name', 'code', 'city')),
      )
      .all();
    return ok(data);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const body = (await req.json().catch(() => null)) as TripInput | null;
    if (!body) throw new ApiFailure('INVALID_JSON', 'Corps JSON invalide', 400);

    const { companyId, boatId, routeId, code, departureTime, pricePerSeat, availableSeats, status } = body;

    if (!companyId || !boatId || !routeId) {
      throw new ApiFailure('VALIDATION_ERROR', 'companyId, boatId et routeId sont requis', 400);
    }
    if (!isIsoDate(departureTime)) {
      throw new ApiFailure('VALIDATION_ERROR', 'departureTime doit être une date ISO 8601', 400);
    }
    if (typeof pricePerSeat !== 'number' || !Number.isInteger(pricePerSeat) || pricePerSeat <= 0) {
      throw new ApiFailure('VALIDATION_ERROR', 'pricePerSeat doit être un entier positif (Ar)', 400);
    }

    const [company, boat, route] = await Promise.all([
      db.orm.public.Company.first({ id: companyId }),
      db.orm.public.Boat.first({ id: boatId }),
      db.orm.public.Route.first({ id: routeId }),
    ]);
    if (!company) return fail('NOT_FOUND', 'Compagnie introuvable', 404);
    if (!boat) return fail('NOT_FOUND', 'Bateau introuvable', 404);
    if (!route) return fail('NOT_FOUND', 'Route introuvable', 404);

    const seats = availableSeats ?? boat.capacity;
    if (!Number.isInteger(seats) || seats < 1 || seats > boat.capacity) {
      throw new ApiFailure(
        'VALIDATION_ERROR',
        `availableSeats (${seats}) doit être entre 1 et la capacité du bateau (${boat.capacity})`,
        400,
      );
    }

    const trip = await db.orm.public.Trip.create({
      code: code ?? genRef('T'),
      companyId,
      boatId,
      routeId,
      departureTime: new Date(departureTime).toISOString(),
      pricePerSeat,
      availableSeats: seats,
      status: status ?? 'SCHEDULED',
    });
    return ok(trip, 201);
  });
}