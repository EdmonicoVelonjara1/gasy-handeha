'use client'

import { useRouter } from 'next/navigation'

import { PassengerScreen } from '@/components/screens/passenger-screen'

export default function PassengerPage() {
  const router = useRouter()

  return <PassengerScreen onBack={() => router.push('/onboarding')} />
}
