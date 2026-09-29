#!/usr/bin/env node
// after-edit.mjs — Script à lancer après chaque modification du contrat Prisma.
//
// Usage :
//   pnpm after:edit                      -> emit + plan (par défaut)
//   pnpm after:edit -- mon_changement    -> plan nommé "mon_changement"
//   pnpm after:edit --apply              -> emit + plan + db migrate + ref db
//
// Flux :
//   1. prisma contract emit      — régénère contract.json / contract.d.ts
//   2. prisma migration plan     — écrit le package de migration (chaîné depuis la ref db)
//   3. (--apply) db migrate      — applique la migration, puis met à jour la ref db
//      Attention : sur Supabase, toute migration qui CRÉE une table échouera à la
//      vérification (RLS auto-activée) tant que migration.ts ne contient pas les
//      étapes rawSql de désactivation RLS — révisez le package avant de lancer --apply.

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const slug =
  args.find((a) => !a.startsWith('--')) ??
  `change_${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '').replace(/(\d{8})(\d{6})/, '$1_$2')}`;

const fail = (msg, code = 1) => {
  console.error(`\n[X] ${msg}`);
  process.exit(code);
};

const prisma = (sub) => ['exec', 'prisma', ...sub];

function run(cmdArgs) {
  const r = spawnSync(bin, cmdArgs, { cwd: root, encoding: 'utf8' });
  if (r.error) fail(r.error.message);
  if (r.status !== 0) fail(`Échec (code ${r.status}) : ${bin} ${cmdArgs.join(' ')}\n${r.stderr?.trim() ?? ''}`);
  return r.stdout ?? '';
}

// Extrait le dernier enveloppe "result" du flux JSON des commandes Prisma.
function lastEnvelope(stdout) {
  let env = null;
  for (const line of stdout.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    try {
      const j = JSON.parse(t);
      if (j.kind === 'result') env = j.envelope;
    } catch {
      /* ligne non-JSON (bannière etc.) */
    }
  }
  return env;
}

const banner = (s) => console.log(`\n=== ${s} ===`);

// ── 1. Émission du contrat ────────────────────────────────────────────────
banner('1/3 · contract emit');
run(prisma(['contract', 'emit']));
console.log('  contract.json / contract.d.ts à jour.');

// ── 2. Plan de migration ──────────────────────────────────────────────────
banner(`2/3 · migration plan --name ${slug}`);
const planOut = run(prisma(['migration', 'plan', '--name', slug]));
const plan = lastEnvelope(planOut);

if (!plan || plan.ok !== true) {
  fail('migration plan a échoué — consultez la sortie ci-dessus.');
}

if (plan.result?.noOp) {
  console.log('  Aucun changement détecté entre les contrats — rien à migrer.');
  console.log(`\n[OK] Contrat synchronisé. Rien d'autre à faire.`);
  process.exit(0);
}

const dir = plan.result?.dir;
const ops = plan.result?.operations ?? [];
const createTables = ops.filter((o) => /^create table/i.test(o.label ?? ''));
console.log(`  Package écrit : ${dir}`);
console.log(`  Opérations    : ${ops.length} (dont ${createTables.length} création(s) de table)`);

if (createTables.length > 0) {
  console.warn(
    `\n[!] Supabase active la RLS sur toute table créée dans "public" (trigger ensure_rls).\n` +
      `    Le contrat attend rlsEnabled=false : ajoutez les étapes rawSql de désactivation RLS\n` +
      `    dans ${dir}/migration.ts puis self-émettez  (node ${dir}/migration.ts)\n` +
      `    avant d'appliquer, sinon la vérification échouera (MIGRATION.SCHEMA_VERIFY_FAILED).`,
  );
}

if (!apply) {
  console.log(`
  Étapes suivantes :
    ! Réviser le package : ${dir}/migration.ts (transformations, désactivation RLS si tables créées)
    ! Si modifié        : node ${dir}/migration.ts          (self-emit)
    ! Appliquer         : pnpm exec prisma db migrate
    ! Ref db            : pnpm exec prisma migration ref set db <to-hash>
    Ou tout-en-un       : pnpm after:edit --apply -- ${slug}`);
  process.exit(0);
}

// ── 3. Application (mode --apply) ─────────────────────────────────────────
banner('3/3 · db migrate + ref db');
const migrateOut = run(prisma(['db', 'migrate']));
const mig = lastEnvelope(migrateOut);

if (!mig || mig.ok !== true) {
  fail(`db migrate a échoué (${mig?.error?.code ?? 'inconnu'}) : ${mig?.error?.summary ?? ''}`);
}

const applied = mig.result?.migrationsApplied ?? 0;
const marker = mig.result?.markerHash;
console.log(`  Migrations appliquées : ${applied}`);

if (applied > 0 && marker) {
  const refOut = run(prisma(['migration', 'ref', 'set', 'db', marker]));
  const ref = lastEnvelope(refOut);
  console.log(`  Ref "db" avancée      : ${ref?.result?.ref ?? 'db'} -> ${marker}`);
}

console.log(`\n[OK] Contrat émis, migration appliquée et ref db à jour.`);