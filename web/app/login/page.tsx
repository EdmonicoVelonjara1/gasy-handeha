import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  DEFAULT_CREDENTIALS,
  getSafeRedirectPath,
  isValidSessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/auth'
import { LoginForm } from './login-form'

export const metadata = {
  title: 'Connexion — GasyHandeha',
  description: 'Accédez à votre espace GasyHandeha.',
}

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[]
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const nextValue = Array.isArray(params.next) ? params.next[0] : params.next
  const nextPath = getSafeRedirectPath(nextValue)
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (isValidSessionToken(session) && nextPath !== '/login') {
    redirect(nextPath)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 size-[28rem] rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between p-10 lg:flex xl:p-14">
          <div>
            <div className="flex items-center gap-3 text-lg font-semibold tracking-tight">
              <span className="grid size-10 place-items-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                GH
              </span>
              GasyHandeha
            </div>
            <div className="mt-24 max-w-md">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-400">
                Espace privé
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                Gérez vos traversées en toute simplicité.
              </h1>
              <p className="mt-6 text-base leading-7 text-slate-300">
                Retrouvez vos trajets, vos réservations et toutes les
                informations de votre activité au même endroit.
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} GasyHandeha
          </p>
        </section>

        <section className="bg-white p-7 text-slate-950 sm:p-10 xl:p-14">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3 font-semibold">
                <span className="grid size-9 place-items-center rounded-lg bg-sky-600 text-sm text-white">
                  GH
                </span>
                GasyHandeha
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-sky-600">Bienvenue</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Connexion à votre compte
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Saisissez vos identifiants pour accéder à votre espace.
              </p>
            </div>

            <div className="mt-8">
              <LoginForm
                nextPath={nextPath}
                defaultEmail={DEFAULT_CREDENTIALS.email}
              />
            </div>

            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              Accès réservé aux utilisateurs autorisés.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
