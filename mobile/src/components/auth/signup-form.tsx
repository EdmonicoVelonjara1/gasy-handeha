import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SymbolView } from 'expo-symbols';

import { AuthField } from '@/components/auth/auth-field';
import { BRAND, SLATE_400 } from '@/constants/auth';
import { Banner } from '@/components/ui/banner';

interface SignupFormProps {
  isSignUp: boolean;
  toggleMode: () => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  submitting: boolean;
  handleAuth: () => void;
  passwordRef: React.RefObject<any>;
  message: { tone: 'error' | 'info'; text: string } | null;
  displayName: string;
  setDisplayName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
}

export function SignupForm({ 
  isSignUp,
  toggleMode, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  showPassword, 
  setShowPassword, 
  submitting, 
  handleAuth, 
  passwordRef,
  message,
  displayName,
  setDisplayName,
  phoneNumber,
  setPhoneNumber
}: SignupFormProps) {

  return (
    <View className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm web:shadow-sky-100/60 sm:p-8">
      <View className="flex-1 items-center rounded-xl py-2.5 transition bg-white shadow-sm">
        <View >
          <Text className="text-sm font-extrabold text-brand">
            {'Inscription'}
          </Text>
        </View>
      </View>
  
      <View className="mt-7">
        <Text className="text-sm font-extrabold text-brand">
          {'Bienvenue sur à bord !'}
        </Text>
        <Text className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-ink">
          {'Créez votre compte'}
        </Text>
        <Text className="mt-2 text-sm leading-6 text-slate-500">
          {'Retrouvez vos trajets, vos billets et vos réservations au même endroit.'}
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
          label="Nom complet"
          icon={
            <SymbolView
              name={{ ios: 'person', android: 'person', web: 'person' }}
              tintColor={BRAND}
              size={18}
            />
          }
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Votre nom complet"
          autoCapitalize="words"
          autoCorrect={false}
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
        />

        <AuthField
          label="Numéro de téléphone"
          icon={
            <SymbolView
              name={{ ios: 'phone', android: 'phone', web: 'phone' }}
              tintColor={BRAND}
              size={18}
            />
          }
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Votre numéro de téléphone"
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="tel"
          textContentType="telephoneNumber"
          returnKeyType="next"
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
              onPress={() => setShowPassword(!showPassword)}>
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
          placeholder={'Nouveau mot de passe'}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete={'new-password'}
          textContentType={'password'}
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
              {'S\'inscrire'}
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
          {'Déjà un compte ? '}
          <Text className="font-extrabold text-brand">
            {'Se connecter'}
          </Text>
        </Text>
      </Pressable>
    </View>
  )
}