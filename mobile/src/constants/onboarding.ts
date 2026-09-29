export type UserRole = 'passenger' | 'company';

let role: UserRole | null = null;

/**
 * Onboarding completion state.
 *
 * Deliberately in-memory only: the selected role is lost on app restart, so the
 * welcome screen shows again on the next launch. No hook is needed either —
 * `src/app/index.tsx` can only remount *after* `complete()` has been called
 * (completing navigates away, unmounting it), so reading this at render time is
 * always current.
 *
 * Replace the module-level variable with a persisted store (expo-secure-store,
 * AsyncStorage, …) when real authentication lands.
 */
export const onboarding = {
  getRole: (): UserRole | null => role,
  complete: (value: UserRole) => {
    role = value;
  },
};
