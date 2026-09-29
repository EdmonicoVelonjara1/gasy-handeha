import {
    View,
    Text,
} from 'react-native';
import { SymbolView } from 'expo-symbols';

import { BRAND } from '@/constants/auth';

type Message = {
    tone: 'error' | 'info';
    text: string;
}
export function Banner({ message }: { message: NonNullable<Message> }) {
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
