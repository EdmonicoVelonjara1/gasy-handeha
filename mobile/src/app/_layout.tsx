import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import '@/global.css';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {/* A Stack is required here: the native tabs layout only renders routes
          declared as a trigger, so a root Stack is what makes `/` (onboarding,
          outside the tabs) reachable at all. */}
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
