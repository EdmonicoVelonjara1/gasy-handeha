// Helpers JSON partagés par les route handlers de l'API.
// Conventions :
//   - succès :  { data }
//   - erreur :  { error: { code, summary } }
//   - dates :   toujours des chaînes ISO 8601 UTC (via Date.toISOString())
import { NextResponse } from 'next/server';

/** Réponse JSON de succès. */
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

/** Réponse JSON d'erreur. */
export function fail(code: string, summary: string, status = 400) {
  return NextResponse.json({ error: { code, summary } }, { status });
}

/** Erreur applicative jetable dans un handler ; interceptée par handle(). */
export class ApiFailure extends Error {
  readonly status: number;
  readonly code: string;

  constructor(code: string, summary: string, status = 400) {
    super(summary);
    this.name = 'ApiFailure';
    this.code = code;
    this.status = status;
  }
}

/** Enveloppe un handler : traduit toute erreur en réponse JSON propre. */
export async function handle(handler: () => Promise<Response>): Promise<Response> {
  try {
    return await handler();
  } catch (err) {
    if (err instanceof ApiFailure) {
      return fail(err.code, err.message, err.status);
    }
    const e = err as { code?: string; summary?: string; message?: string };
    const code = e?.code ?? 'INTERNAL_ERROR';
    const summary = e?.summary ?? e?.message ?? 'Erreur interne du serveur';
    const status = /UNIQUE|CONSTRAINT/.test(code) ? 409 : /^(DB|RUNTIME)\./.test(code) ? 400 : 500;
    console.error('[api]', code, summary);
    return fail(code, summary, status);
  }
}

/** Génère une référence lisible (BK-XXXX, TKT-XXXX, …) — unique en pratique. */
export function genRef(prefix: string) {
  const time = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${time}${rand}`;
}

/** Vérifie une date ISO 8601 (chaîne analysable par Date.parse). */
export function isIsoDate(v: unknown): v is string {
  return typeof v === 'string' && !Number.isNaN(Date.parse(v));
}

/** Lit un paramètre d'URL en entier optionnel. */
export function intParam(searchParams: URLSearchParams, key: string): number | undefined {
  const raw = searchParams.get(key);
  if (raw == null || raw === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}