import { db } from '@/src/prisma/db';
import { ok, handle, ApiFailure } from '../_lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface UserInput {
  email?: string;
  fullName?: string;
  phone?: string;
  role?: string;
  companyId?: string;
}

export async function GET(req: Request) {
  return handle(async () => {
    const sp = new URL(req.url).searchParams;
    const role = sp.get('role') ?? undefined;

    let users = db.orm.public.User;
    if (role) users = users.where((u) => u.role.eq(role));

    const data = await users.orderBy((u) => u.createdAt.desc()).all();
    return ok(data);
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const body = (await req.json().catch(() => null)) as UserInput | null;
    if (!body) throw new ApiFailure('INVALID_JSON', 'Corps JSON invalide', 400);

    const { email, fullName, phone, role, companyId } = body;
    if (!email || !fullName) {
      throw new ApiFailure('VALIDATION_ERROR', 'email et fullName sont requis', 400);
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new ApiFailure('VALIDATION_ERROR', "email invalide", 400);
    }
    if (role && !['passenger', 'company'].includes(role)) {
      throw new ApiFailure('VALIDATION_ERROR', "role doit être 'passenger' ou 'company'", 400);
    }

    const user = await db.orm.public.User.create({
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      role: role ?? 'passenger',
      ...(phone ? { phone: phone.trim() } : {}),
      ...(companyId ? { companyId } : {}),
    });
    return ok(user, 201);
  });
}