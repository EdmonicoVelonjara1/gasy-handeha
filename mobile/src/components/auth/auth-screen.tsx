import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Session } from '@supabase/supabase-js';
import { styles } from '@/index.css';

import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Loading } from '../ui/loading';
import { LogoutCard } from './logout-card';
import { LoginForm } from './login-form';
import type { Message } from '@/types';
import { SignupForm } from './signup-form';

export function AuthScreen() {
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<TextInput>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [displayName, setDisplayName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  
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
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                display_name: displayName.trim(),
                phone: phoneNumber.trim(),
              },
            },
          })
        : await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          })

      if (error) throw error

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
    return <Loading />
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
        <LogoutCard session={{ user: { email: session.user.email ?? '' } }} handleSignOut={handleSignOut} />
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

        <View className="w-full max-w-md self-center">
          <View className="items-center">
            <View className="size-14 items-center justify-center rounded-xl bg-brand shadow-xl web:shadow-sky-100">
              <Image source={require('@/assets/images/logo1.png')} style={styles.logo} contentFit="contain" />
            </View>

            <Text className="mt-5 text-2xl font-extrabold tracking-[-0.05em] text-brand">
              Gasy<Text className="text-ink">Handeha</Text>
            </Text>
          </View>

          {isSignUp ? (
            <SignupForm
              isSignUp={isSignUp}
              toggleMode={toggleMode}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              submitting={submitting}
              handleAuth={handleAuth}
              passwordRef={passwordRef}
              displayName={displayName}
              setDisplayName={setDisplayName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              message={message}
            />
          ) : (
            <LoginForm
              isSignUp={isSignUp}
              toggleMode={toggleMode}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              submitting={submitting}
              handleAuth={handleAuth}
              passwordRef={passwordRef}
              message={message}
            />
          )}

          <Text className="mt-8 text-center text-xs leading-5 text-slate-400">
            Accès réservé aux utilisateurs autorisés. La plateforme maritime et routière qui relie
            Madagascar à ses îles.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}


