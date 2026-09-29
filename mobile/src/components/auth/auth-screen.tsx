import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Session } from '@supabase/supabase-js';

import { AuthField } from '@/components/auth/auth-field';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

type Message = { tone: 'error' | 'info'; text: string } | null;

/** Mirrors `--color-brand` from `src/global.css`. */
const BRAND = '#0077b6';
const SLATE_400 = '#94a3b8';

export function AuthScreen() {
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<TextInput>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) Alert.alert('Error', error.message)
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  function toggleMode() {
    setIsSignUp((value) => !value)
    setMessage(null)
    setPassword('')
    setShowPassword(false)
  }

  async function handleAuth() {
    if (!email.trim() || !password) {
      setMessage({ tone: 'error', text: 'Renseignez votre e-mail et votre mot de passe.' })
      return
    }

    setSubmitting(true)
    setMessage(null)

    try {
      const { data, error } = isSignUp
        ? await supabase.auth.signUp({ email: email.trim(), password })
        : await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          })

      if (error) throw error

      // If email confirmation is enabled, sign-up may not create a session yet.
      if (isSignUp && !data.session) {
        setMessage({
          tone: 'info',
          text: 'Compte créé. Confirmez votre adresse e-mail, puis connectez-vous.',
        })
        setIsSignUp(false)
      }
    } catch (error) {
      setMessage({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Une erreur est survenue.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()
    if (error) Alert.alert('Sign out error', error.message)
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center gap-8 bg-canvas">
        <StatusBar style="dark" />
        <View className="size-20 items-center justify-center rounded-2xl bg-brand shadow-xl web:shadow-sky-100">
          <Image
            source={require('@/assets/images/logo1.png')}
            style={styles.largeLogo}
            contentFit="contain"
          />
        </View>
        <ActivityIndicator color={BRAND} />
      </View>
    )
  }

  if (session) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.fill,
          {
            paddingTop: insets.top + Spacing.five,
            paddingBottom: insets.bottom + Spacing.five,
          },
        ]}>
        <StatusBar style="dark" />

        <View className="w-full max-w-md items-center self-center">
          <View className="size-16 items-center justify-center rounded-2xl bg-mist">
            <SymbolView
              name={{ ios: 'person.crop.circle.fill', android: 'person', web: 'person' }}
              tintColor={BRAND}
              size={34}
            />
          </View>

          <Text className="mt-6 text-3xl font-extrabold tracking-[-0.04em] text-ink">
            Vous êtes connecté
          </Text>
          <Text className="mt-2 text-center text-base text-slate-500">{session.user.email}</Text>

          <Pressable
            className="mt-8 h-14 w-full max-w-xs items-center justify-center rounded-2xl border border-slate-200 bg-white transition active:scale-[0.98] web:hover:border-line"
            onPress={handleSignOut}>
            <Text className="text-base font-extrabold text-ink">Se déconnecter</Text>
          </Pressable>
        </View>
      </ScrollView>
    )
  }

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
        {/* Ambient halos: web-only, a 64px blur renders poorly in React Native. */}
        <View pointerEvents="none" className="web:absolute">
          <View className="web:-left-24 web:-top-24 web:size-80 web:rounded-full web:bg-halo-cyan web:blur-3xl" />
          <View className="web:-bottom-32 web:-right-20 web:size-96 web:rounded-full web:bg-halo-peach web:blur-3xl" />
        </View>

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
            <View className="flex-row rounded-2xl bg-mist p-1">
              <Segment
                label="Connexion"
                active={!isSignUp}
                onPress={() => {
                  if (isSignUp) toggleMode()
                }}
              />
              <Segment
                label="Inscription"
                active={isSignUp}
                onPress={() => {
                  if (!isSignUp) toggleMode()
                }}
              />
            </View>

            <View className="mt-7">
              <Text className="text-sm font-extrabold text-brand">
                {isSignUp ? 'Bienvenue à bord' : 'Content de vous revoir'}
              </Text>
              <Text className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-ink">
                {isSignUp ? 'Créez votre compte' : 'Connectez-vous à votre compte'}
              </Text>
              <Text className="mt-2 text-sm leading-6 text-slate-500">
                {isSignUp
                  ? 'Réservez vos traversées et suivez vos voyages en quelques secondes.'
                  : 'Retrouvez vos trajets, vos billets et vos réservations au même endroit.'}
              </Text>
            </View>

            <View className="mt-7 gap-5">
              <AuthField
                label="Adresse e-mail"
                icon={
                  <SymbolView
                    name={{ ios: 'envelope', android: 'mail', web: 'mail' }}
                    tintColor={BRAND}
                    size={18}
                  />
                }
                value={email}
                onChangeText={setEmail}
                placeholder="vous@exemple.mg"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <AuthField
                label="Mot de passe"
                inputRef={passwordRef}
                icon={
                  <SymbolView
                    name={{ ios: 'lock', android: 'lock', web: 'lock' }}
                    tintColor={BRAND}
                    size={18}
                  />
                }
                trailing={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                    }
                    hitSlop={8}
                    onPress={() => setShowPassword((value) => !value)}>
                    <SymbolView
                      name={{
                        ios: showPassword ? 'eye.slash' : 'eye',
                        android: showPassword ? 'visibility_off' : 'visibility',
                        web: showPassword ? 'visibility_off' : 'visibility',
                      }}
                      tintColor={SLATE_400}
                      size={18}
                    />
                  </Pressable>
                }
                value={password}
                onChangeText={setPassword}
                placeholder={isSignUp ? 'Au moins 6 caractères' : 'Votre mot de passe'}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                textContentType={isSignUp ? 'newPassword' : 'password'}
                returnKeyType="go"
                onSubmitEditing={handleAuth}
              />
            </View>

            {message && <Banner message={message} />}

            <Pressable
              className="mt-7 h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-brand transition active:scale-[0.98] active:opacity-90 web:hover:bg-ink disabled:opacity-50"
              accessibilityRole="button"
              disabled={submitting}
              onPress={handleAuth}>
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text className="text-base font-extrabold text-white">
                    {isSignUp ? 'Créer mon compte' : 'Se connecter'}
                  </Text>
                  <SymbolView
                    name={{ ios: 'arrow.up.right', android: 'north_east', web: 'north_east' }}
                    tintColor="#ffffff"
                    size={16}
                  />
                </>
              )}
            </Pressable>

            <Pressable
              className="mt-4 items-center py-2"
              accessibilityRole="button"
              disabled={submitting}
              onPress={toggleMode}>
              <Text className="text-sm text-slate-500">
                {isSignUp ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
                <Text className="font-extrabold text-brand">
                  {isSignUp ? 'Se connecter' : 'Créer un compte'}
                </Text>
              </Text>
            </Pressable>
          </View>

          <Text className="mt-8 text-center text-xs leading-5 text-slate-400">
            Accès réservé aux utilisateurs autorisés. La plateforme maritime et routière qui relie
            Madagascar à ses îles.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

type SegmentProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function Segment({ label, active, onPress }: SegmentProps) {
  return (
    <Pressable
      className={`flex-1 items-center rounded-xl py-2.5 transition ${
        active ? 'bg-white shadow-sm web:shadow-sky-100' : ''
      }`}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}>
      <Text className={`text-sm font-extrabold ${active ? 'text-brand' : 'text-slate-500'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

function Banner({ message }: { message: NonNullable<Message> }) {
  const isError = message.tone === 'error';

  return (
    <View
      accessibilityRole="alert"
      className={`mt-6 flex-row items-start gap-3 rounded-2xl border p-4 ${
        isError ? 'border-red-200 bg-red-50' : 'border-line-soft bg-tint'
      }`}>
      <SymbolView
        name={{
          ios: isError ? 'exclamationmark.triangle.fill' : 'checkmark.circle.fill',
          android: isError ? 'error_outline' : 'check_circle',
          web: isError ? 'error_outline' : 'check_circle',
        }}
        tintColor={isError ? '#b91c1c' : BRAND}
        size={18}
      />
      <Text className={`flex-1 text-sm leading-6 ${isError ? 'text-red-700' : 'text-ink'}`}>
        {message.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 45, height: 45 },
  largeLogo: { width: 60, height: 60 },
})
