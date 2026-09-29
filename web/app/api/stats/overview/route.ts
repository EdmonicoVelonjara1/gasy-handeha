import { db } from '@/src/prisma/db';
import { ok, handle } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Bornes UTC de la journée / de la semaine (lundi → dimanche). */
function dayBounds(d: Date) {
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 1);
  return { start, end };
}

function weekBounds(d: Date) {
  const { start: dayStart } = dayBounds(d);
  const start = new Date(dayStart);
  start.setUTCDate(dayStart.getUTCDate() - ((dayStart.getUTCDay() + 6) % 7)); // lundi précédent
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 7);
  return { start, end };
}

export async function GET() {
  return handle(async () => {
    const now = new Date();
    const today = dayBounds(now);
    const week = weekBounds(now);
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

    const [tripsAgg, revenueAgg, seatStats, capStats] = await Promise.all([
      db.orm.public.Trip
        .where((t) => t.departureTime.gte(week.start.toISOString()))
        .where((t) => t.departureTime.lt(week.end.toISOString()))
        .aggregate((a) => ({ tripsThisWeek: a.count() })),
      db.orm.public.Booking
        .where((b) => b.paymentStatus.eq('PAID'))
        .where((b) => b.createdAt.gte(monthStart.toISOString()))
        .where((b) => b.createdAt.lt(monthEnd.toISOString()))
        .aggregate((a) => ({ revenueMonth: a.sum('totalAmount') })),
      db.orm.public.Trip.aggregate((a) => ({ totalSeats: a.sum('availableSeats') })),
      db.orm.public.Boat.aggregate((a) => ({ totalCapacity: a.sum('capacity') })),
    ]);

    // Passagers à embarquer aujourd'hui : somme des sièges réservés sur les traversées du jour.
    const tripsToday = await db.orm.public.Trip
      .select('id')
      .where((t) => t.departureTime.gte(today.start.toISOString()))
      .where((t) => t.departureTime.lt(today.end.toISOString()))
      .all();
    const idsToday = tripsToday.map((t) => t.id);
    const passengersToday = idsToday.length
      ? ((await db.orm.public.Booking
          .where((b) => b.tripId.in(idsToday))
          .aggregate((a) => ({ n: a.sum('seatsCount') }))).n ?? 0)
      : 0;

    const capacity = capStats.totalCapacity ?? 0;
    const occupancyRate =
      capacity > 0 ? Math.round((1 - (seatStats.totalSeats ?? 0) / capacity) * 100) : null;

    // Compteurs par table pour la navigation.
    const [companies, boats, ports, routes, trips, users, bookings] = await Promise.all([
      db.orm.public.Company.aggregate((a) => ({ n: a.count() })),
      db.orm.public.Boat.aggregate((a) => ({ n: a.count() })),
      db.orm.public.Port.aggregate((a) => ({ n: a.count() })),
      db.orm.public.Route.aggregate((a) => ({ n: a.count() })),
      db.orm.public.Trip.aggregate((a) => ({ n: a.count() })),
      db.orm.public.User.aggregate((a) => ({ n: a.count() })),
      db.orm.public.Booking.aggregate((a) => ({ n: a.count() })),
    ]);

    return ok({
      tripsThisWeek: tripsAgg.tripsThisWeek,
      revenueMonth: revenueAgg.revenueMonth ?? 0,
      occupancyRate, // % (null si aucun bateau)
      passengersToday,
      counts: {
        companies: companies.n,
        boats: boats.n,
        ports: ports.n,
        routes: routes.n,
        trips: trips.n,
        users: users.n,
        bookings: bookings.n,
      },
    });
  });
}