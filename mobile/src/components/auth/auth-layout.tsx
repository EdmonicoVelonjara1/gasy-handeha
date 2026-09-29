import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

type AuthLayoutProps = {
  /** Form contents — rendered inside the card, below the brand header. */
  children: ReactNode;
};

/**
 * Shared shell for the credentials screens: keyboard-avoiding scroll view,
 * brand header, the card the form lives in, and the legal footer.
 *
 * The spacing is a plain `ScrollView` container style rather than safe-area
 * `View`s so the content stays centred on tablets and web.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={[
          styles.fill,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: insets.bottom + Spacing.four,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">

        <View className="w-full max-w-md self-center">
          <View className="items-center">
            <View className="size-14 items-center justify-center rounded-xl bg-brand shadow-xl web:shadow-sky-100">
              <Image source={require('@/assets/images/logo1.png')} style={styles.logo} contentFit="contain" />
            </View>

            <Text className="mt-5 text-2xl font-extrabold tracking-[-0.05em] text-brand">
              Gasy<Text className="text-ink">Handeha</Text>
            </Text>
          </View>

          <View className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm web:shadow-sky-100/60 sm:p-8">
            {children}
          </View>

          <Text className="mt-8 text-center text-xs leading-5 text-slate-400">
            Accès réservé aux utilisateurs autorisés. La plateforme maritime et routière qui relie
            Madagascar à ses îles.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 45, height: 45 },
});
