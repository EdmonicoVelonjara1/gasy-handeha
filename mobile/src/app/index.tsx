import { Redirect, router } from 'expo-router';

import { WelcomeScreen } from '@/components/onboarding/welcome-screen';
import { onboarding, type UserRole } from '@/constants/onboarding';
import { useAuth } from '@/lib/auth-context';

export default function OnboardingScreen() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // A live session wins over the onboarding preference: this screen is the
  // anchor route both branches of the auth guard fall back to, so it has to
  // forward signed-in users to the tabs rather than show the welcome cards.
  if (session) {
    return <Redirect href="/home" />;
  }

  if (onboarding.getRole()) {
    return <Redirect href="/auth" />;
  }

  function onSelectRole(role: UserRole) {
    onboarding.complete(role);
    // /auth is the only route reachable while signed out, and it pre-fills the
    // role picker from `onboarding.getRole()`.
    router.replace('/auth');
  }

  return <WelcomeScreen onSelectRole={onSelectRole} />;
}
