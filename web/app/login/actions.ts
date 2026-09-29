'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  areDefaultCredentialsValid,
  createSessionToken,
  getSafeRedirectPath,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth'

export type LoginState = {
  error?: string
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!areDefaultCredentialsValid(email, password)) {
    return {
      error: 'Adresse e-mail ou mot de passe incorrect.',
    }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  redirect(getSafeRedirectPath(formData.get('next')))
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete({ name: SESSION_COOKIE_NAME, path: '/' })
  redirect('/login')
}
