import type { AndroidSymbol, SFSymbol } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import type { UserRole } from '@/constants/onboarding';

type RoleCardProps = {
  role: UserRole;
  title: string;
  description: string;
  cta: string;
  onPress: () => void;
};

/* Class names are written out in full rather than composed from a palette
 * object: Tailwind extracts them by scanning source text, so a utility built at
 * runtime would silently vanish from the build. */
const SURFACE: Record<UserRole, { card: string; tile: string; description: string }> = {
  passenger: {
    card: 'border-slate-200 bg-white web:hover:border-line',
    tile: 'bg-mist group-hover/card:bg-line',
    description: 'text-slate-500',
  },
  company: {
    card: 'border-line-soft bg-tint web:hover:border-brand',
    tile: 'bg-brand shadow-lg web:shadow-sky-100 group-hover/card:bg-ink',
    description: 'text-slate-600',
  },
};

const ICON: Record<UserRole, { ios: SFSymbol; android: AndroidSymbol; tint: string }> = {
  passenger: { ios: 'ticket', android: 'confirmation_number', tint: '#0077b6' },
  company: { ios: 'ferry', android: 'directions_boat', tint: '#ffffff' },
};

export function RoleCard({ role, title, description, cta, onPress }: RoleCardProps) {
  return (
    <Pressable
      // `hover:` maps to onHoverIn/onHoverOut, which Pressable accepts but View
      // and Text do not — hence a Pressable root rather than a styled View.
      className={`group/card w-full flex-1 rounded-3xl border p-7 shadow-sm transition active:scale-[0.98] sm:p-9 web:hover:-translate-y-1 web:hover:shadow-xl web:hover:shadow-sky-100/60 ${SURFACE[role].card}`}
      onPress={onPress}>
      <View
        className={`size-14 items-center justify-center rounded-2xl transition ${SURFACE[role].tile}`}>
        <SymbolView
          name={{
            ios: ICON[role].ios,
            android: ICON[role].android,
            web: ICON[role].android,
          }}
          tintColor={ICON[role].tint}
          size={28}
        />
      </View>

      <Text className="mt-7 text-2xl font-extrabold tracking-[-0.04em] text-ink">{title}</Text>

      <Text className={`mt-3 text-sm leading-6 ${SURFACE[role].description}`}>{description}</Text>

      <View className="mt-8 flex-row items-center gap-2">
        <Text className="text-sm font-extrabold text-brand">{cta}</Text>
        <SymbolView
          name={{ ios: 'arrow.up.right', android: 'north_east', web: 'north_east' }}
          tintColor="#0077b6"
          size={16}
        />
      </View>
    </Pressable>
  );
}
