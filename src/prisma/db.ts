import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

const url = process.env['DATABASE_URL']!;

// Singleton module-level (HMR-safe) : le serveur de dev Next.js recharge le module à
// chaque édition ; sans ce garde, un nouveau pool Postgres serait créé à chaque rechargement.
//
// Note rc.11 : la contrainte `Contract<SqlStorage>` du runtime exige `nullable` sur chaque
// relation, champ que l'émetteur (`prisma contract emit`) n'écrit pas — les deux semblent
// désynchronisés sur ce point. `@ts-expect-error` supprime le diagnostic tout en conservant
// le type argument concret, de sorte que toute la surface de requêtes (where/include/…)
// reste pleinement typée.
// @ts-expect-error — incompatibilité émetteur/runtime rc.11 (nullable manquant)
const createDb = () => postgres<Contract>({ contractJson, url });

type Db = ReturnType<typeof createDb>;
const globalForDb = globalThis as unknown as { __gasyHandehaDb?: ReturnType<typeof createDb> };

export const db: Db =
  globalForDb.__gasyHandehaDb ?? (globalForDb.__gasyHandehaDb = createDb());