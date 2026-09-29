import { Image } from 'expo-image';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RoleCard } from '@/components/onboarding/role-card';
import type { UserRole } from '@/constants/onboarding';

type WelcomeScreenProps = {
  onSelectRole: (role: UserRole) => void;
};

/**
 * Port of `web/components/screens/welcome-screen.tsx`.
 *
 * The web version builds its two-column card row and its centred logo badge on
 * a two-dimensional layout that NativeWind v5 marks as web-only. This port
 * therefore uses flexbox throughout and promotes the card row to two columns
 * at the medium-width breakpoint. Shadow tints are web-only as well, hence the
 * `web` variant used below.
 *
 * The decorative ambient halos are web-only too: a 64px blur radius is well
 * past what React Native's filter blur renders usefully.
 *
 * Caution: Tailwind extracts candidate class names from raw file text,
 * including inside comments, so this file deliberately avoids naming any
 * utility that is not actually used here.
 */
export function WelcomeScreen({ onSelectRole }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-canvas m-2"
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top + 40,
        paddingBottom: insets.bottom + 40,
      }}>
      <View pointerEvents="none" className="web:absolute">
        <View className="web:-left-24 web:-top-24 web:size-80 web:rounded-full web:bg-halo-cyan web:blur-3xl" />
        <View className="web:-bottom-32 web:-right-20 web:size-96 web:rounded-full web:bg-halo-peach web:blur-3xl" />
      </View>

      <View className="flex-1 items-center justify-center px-5">
        <View className="w-full max-w-5xl">
          <View className="mx-auto max-w-xl items-center">
            <View className="size-14 items-center justify-center rounded-xl bg-brand shadow-xl web:shadow-sky-100">
              <Image
                source={require('@/assets/images/logo1.png')}
                style={{ width: 45, height: 45 }}
                contentFit="contain"
              />
            </View>

            <Text className="mt-5 text-2xl font-extrabold tracking-[-0.05em] text-brand">
              Gasy<Text className="text-ink">Handeha</Text>
            </Text>

            <Text className="mt-8 text-sm font-bold text-brand">Bienvenue à bord</Text>

            <Text className="mt-2 text-center text-4xl font-extrabold tracking-[-0.06em] text-ink web:text-5xl">
              Que souhaitez-vous faire ?
            </Text>

            <Text className="mt-4 text-center text-base leading-7 text-slate-500">
              Choisissez votre espace pour accéder à une expérience adaptée à vos besoins.
            </Text>
          </View>

          <View className="mt-10 w-full flex-col gap-5 md:flex-row">
            <RoleCard
              role="passenger"
              title="Je suis passager"
              description="Recherchez une traversée, réservez vos billets et suivez votre voyage."
              cta="Accéder à l’espace passager"
              onPress={() => onSelectRole('passenger')}
            />
            <RoleCard
              role="company"
              title="Je suis une compagnie"
              description="Gérez vos traversées, vos réservations, vos passagers et vos revenus."
              cta="Accéder à l’espace compagnie"
              onPress={() => onSelectRole('company')}
            />
          </View>

          <Text className="mt-8 text-center text-xs text-slate-400">
            La plateforme maritime et routière qui relie Madagascar à ses îles.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
