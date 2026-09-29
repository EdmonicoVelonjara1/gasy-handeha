import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import '@/global.css';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/lib/auth-context';

// Keep the native splash up until the persisted session is known. Restoring a
// session can mean a network round-trip to refresh an expired token, and
// without this the login form would flash at a returning user.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useAuth();

  // Render nothing until the session is resolved: the native splash is still on
  // screen, and mounting the JS overlay later lets it hand over to the app in
  // one step instead of revealing an empty screen.
  if (isLoading) {
    return null;
  }

  const isSignedIn = Boolean(session);

  return (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        {/* The tabs hold the app's data, so they are what genuinely requires a
            session. A guard that flips to false drops that screen's history and
            redirects to the anchor, so signing out cannot leave an
            authenticated screen on the stack. */}
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>

        {/* `/auth` is deliberately NOT guarded: `AuthScreen` doubles as the
            account screen once a session exists, and that is where sign-out
            lives, so guarding it left that branch unreachable. Signing in then
            has to navigate into the tabs itself — see `login-screen.tsx`. */}
        <Stack.Screen name="auth" />
      </Stack>
    </>
  );
}
