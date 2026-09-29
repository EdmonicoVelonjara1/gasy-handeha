export type UserRole = 'passenger' | 'company';

/**
 * Single source of truth for the roles a user can hold.
 *
 * The signup form renders its options from this list instead of hard-coding
 * `<Picker.Item>`s. `<Picker>` is generic and infers its value type from
 * `selectedValue`, so a hard-coded option list whose literals disagree with the
 * `UserRole` union type-checks happily while emitting roles that do not exist in
 * the union. Deriving both the options and the handler type from one list makes
 * that whole class of bug impossible.
 *
 * `box-office` used to be a third option here. It is deliberately gone: a role
 * that grants access to bookings and revenue must be granted server-side, never
 * chosen by the person signing up. See `src/lib/auth-context.tsx` for the
 * `requested_role` contract the database is expected to enforce.
 */
export const USER_ROLES = [
  { value: 'passenger', label: 'Passager' },
  { value: 'company', label: 'Compagnie' },
] as const satisfies readonly { value: UserRole; label: string }[];

/** Narrows an arbitrary value coming from storage or a network response. */
export function isUserRole(value: unknown): value is UserRole {
  return USER_ROLES.some((role) => role.value === value);
}

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
 * This is a *preference* used to pre-fill the signup form, never an
 * authorisation source. Replace the module-level variable with a persisted store
 * (expo-secure-store, AsyncStorage, …) when you want it to survive a restart.
 */
export const onboarding = {
  getRole: (): UserRole | null => role,
  complete: (value: UserRole) => {
    role = value;
  },
};
