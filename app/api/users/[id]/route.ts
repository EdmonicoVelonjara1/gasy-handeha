import { db } from '@/src/prisma/db';
import { ok, fail, handle, ApiFailure } from '../../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const user = await db.orm.public.User
      .include('bookings', (b) =>
        b
          .select('id', 'reference', 'seatsCount', 'totalAmount', 'status', 'paymentStatus', 'createdAt')
          .include('trip', (t) =>
            t
              .select('id', 'departureTime', 'status', 'pricePerSeat')
              .include('route', (r) =>
                r
                  .include('originPort', (p) => p.select('id', 'name', 'code', 'city'))
                  .include('destinationPort', (p) => p.select('id', 'name', 'code', 'city')),
              ),
          )
          .orderBy((x) => x.createdAt.desc()),
      )
      .first({ id });
    if (!user) return fail('NOT_FOUND', 'Utilisateur introuvable', 404);
    return ok(user);
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const existing = await db.orm.public.User.first({ id });
    if (!existing) return fail('NOT_FOUND', 'Utilisateur introuvable', 404);

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) throw new ApiFailure('INVALID_JSON', 'Corps JSON invalide', 400);

    const patch: Record<string, unknown> = {};
    if (body.fullName !== undefined) {
      if (typeof body.fullName !== 'string' || !body.fullName.trim()) {
        throw new ApiFailure('VALIDATION_ERROR', 'fullName invalide', 400);
      }
      patch.fullName = body.fullName.trim();
    }
    if (body.email !== undefined) {
      if (typeof body.email !== 'string' || !body.email.includes('@')) {
        throw new ApiFailure('VALIDATION_ERROR', 'email invalide', 400);
      }
      patch.email = body.email.trim().toLowerCase();
    }
    if (body.phone !== undefined && typeof body.phone === 'string') patch.phone = body.phone.trim();
    if (body.role !== undefined) {
      if (!['passenger', 'company'].includes(String(body.role))) {
        throw new ApiFailure('VALIDATION_ERROR', "role doit être 'passenger' ou 'company'", 400);
      }
      patch.role = body.role;
    }
    if (body.companyId !== undefined) {
      patch.companyId = body.companyId === null ? null : String(body.companyId);
    }

    if (Object.keys(patch).length > 0) {
      await db.orm.public.User.where({ id }).update(patch);
    }
    const user = await db.orm.public.User.first({ id });
    return ok(user);
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const user = await db.orm.public.User.first({ id });
    if (!user) return fail('NOT_FOUND', 'Utilisateur introuvable', 404);

    const bookingCount = await db.orm.public.Booking
      .where((b) => b.userId.eq(id))
      .aggregate((a) => ({ n: a.count() }));
    if (bookingCount.n > 0) {
      throw new ApiFailure('HAS_CHILDREN', 'Suppression impossible : cet utilisateur a des réservations', 409);
    }

    await db.orm.public.User.where({ id }).delete();
    return ok({ deleted: true });
  });
}