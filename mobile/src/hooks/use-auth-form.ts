import { useState } from 'react';

export type AuthMessage = { tone: 'error' | 'info'; text: string };

/** Everything `AuthForm` needs to render, as returned by `useAuthForm`. */
export type AuthFormState = ReturnType<typeof useAuthForm>;

type UseAuthFormOptions = {
  /** Receives the trimmed e-mail and the raw password. Rejects to show an error. */
  onSubmit: (email: string, password: string) => Promise<void>;
};

/**
 * Credentials state shared by the login and sign-up forms: the fields
 * themselves, validation, the submitting flag and the error banner.
 *
 * The Supabase call is injected, so this hook stays unaware of which endpoint
 * it is driving and each screen keeps ownership of its own copy.
 */
export function useAuthForm({ onSubmit }: UseAuthFormOptions) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<AuthMessage | null>(null);

  async function submit() {
    if (!email.trim() || !password) {
      setMessage({ tone: 'error', text: 'Renseignez votre e-mail et votre mot de passe.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await onSubmit(email.trim(), password);
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Une erreur est survenue.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((value) => !value),
    submitting,
    message,
    submit,
  };
}
