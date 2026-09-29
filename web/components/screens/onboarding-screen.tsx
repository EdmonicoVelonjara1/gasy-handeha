'use client'

import { useRouter } from 'next/navigation'

import { WelcomeScreen } from '@/components/screens/welcome-screen'
import type { UserRole } from '@/types'

export function OnboardingScreen() {
  const router = useRouter()

  const handleRoleSelection = (role: UserRole) => {
    const destination = role === 'company' ? '/dashboard' : '/passenger'
    router.push(`/login?next=${encodeURIComponent(destination)}`)
  }

  return <WelcomeScreen onSelectRole={handleRoleSelection} />
}
