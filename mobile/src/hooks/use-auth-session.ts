import { useAuth } from '@/lib/auth-context';

/**
 * Session view for the auth screens.
 *
 * This used to own the state itself — a `getSession()` read plus its own
 * `onAuthStateChange` subscription per mounted screen. That duplicated the work
 * already done by `AuthProvider` and left the screens holding a *different*
 * session than the route guard in `app/_layout.tsx`, so a sign-in could be
 * visible in one and invisible in the other.
 *
 * It is now a thin adapter over the provider: the whole app keeps one
 * subscription and one session, and this hook keeps the shape the auth screens
 * already destructure.
 */
export function useAuthSession() {
  const { session, isLoading, isConfigured, signOut } = useAuth();

  return { session, loading: isLoading, isConfigured, signOut };
}
