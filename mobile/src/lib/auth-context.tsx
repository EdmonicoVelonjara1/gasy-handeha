import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import type { UserRole } from '@/constants/onboarding';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type SignUpInput = {
  email: string;
  password: string;
  /**
   * The space picked on the welcome screen. This is a *request* for the
   * database to validate, never a role the client gets to grant itself.
   */
  requestedRole: UserRole;
  /** Optional: no screen collects a name yet, so callers usually omit it. */
  fullName?: string;
};

type SignUpResult = {
  /** Human-readable message, or null on success. */
  error: string | null;
  /**
   * True when the project requires email confirmation, i.e. no session was
   * returned and the user has to sign in first.
   */
  needsEmailConfirmation: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  /** True until the persisted session has been read back from storage. */
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (input: SignUpInput) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the persisted session on boot so a returning user lands inside the
  // app rather than on the login form. `getSession` reads the storage adapter
  // in `src/lib/supabase.ts`; it does not hit the network.
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.warn('[auth] could not restore session:', error.message);
      }
      setSession(data.session ?? null);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Deliberately synchronous: awaiting any other supabase call from inside
      // this callback deadlocks the auth client.
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    return error ? error.message : null;
  }, []);

  const signUp = useCallback(async ({ email, password, fullName, requestedRole }: SignUpInput) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          ...(fullName?.trim() ? { full_name: fullName.trim() } : {}),

          /**
           * NOT an authorisation claim, despite living in `raw_user_meta_data`.
           * That column is user-writable and surfaces in `auth.jwt()`, so the
           * database must treat this as a *request to validate* and grant the
           * real role server-side: write it to `raw_app_meta_data` or a
           * `profiles` table from a trigger, and never build an RLS policy on
           * `raw_user_meta_data`.
           */
          requested_role: requestedRole,
        },
      },
    });

    if (error) {
      return { error: error.message, needsEmailConfirmation: false };
    }

    // A null session means the project asks the user to confirm their email.
    return { error: null, needsEmailConfirmation: data.session === null };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // Deliberately not rethrown: the screens that call this (`LogoutCard`)
      // only reset their own UI in a `finally`, and session state is the single
      // source of truth — a failed sign-out leaves the session in place, so the
      // UI keeps showing the account screen on its own.
      console.warn('[auth] sign out failed:', error.message);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      isConfigured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
    }),
    [session, isLoading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Access the auth session. Throws if used outside <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const value = use(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }

  return value;
}
