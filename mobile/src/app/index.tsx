import { Redirect, router } from 'expo-router';

import { WelcomeScreen } from '@/components/onboarding/welcome-screen';
import { onboarding, type UserRole } from '@/constants/onboarding';

export default function OnboardingScreen() {
  if (onboarding.getRole()) {
    return <Redirect href="/home" />;
  }

  function onSelectRole(role: UserRole) {
    onboarding.complete(role);
    router.replace('/home');
  }

  return <WelcomeScreen onSelectRole={onSelectRole} />;
}
