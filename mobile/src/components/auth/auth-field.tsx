import { useState, type ReactNode, type Ref } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type AuthFieldProps = Pick<
  TextInputProps,
  | 'autoCapitalize'
  | 'autoComplete'
  | 'autoCorrect'
  | 'autoFocus'
  | 'keyboardType'
  | 'maxLength'
  | 'onChangeText'
  | 'onSubmitEditing'
  | 'placeholder'
  | 'returnKeyType'
  | 'secureTextEntry'
  | 'textContentType'
  | 'value'
> & {
  label: string;
  /** Rendered at the leading edge of the field. */
  icon: ReactNode;
  /** Rendered at the trailing edge — used for the password visibility toggle. */
  trailing?: ReactNode;
  inputRef?: Ref<TextInput>;
};

/**
 * Labelled text field for the auth forms.
 *
 * The border colour comes from local focus state rather than a `focus:`
 * variant: the border lives on this wrapper while the focus events are emitted
 * by the nested `TextInput`, and a pseudo-class would only style the element
 * that actually receives them.
 */
export function AuthField({
  label,
  icon,
  trailing,
  inputRef,
  ...inputProps
}: AuthFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <Text className="mb-2 text-sm font-bold text-slate-700">{label}</Text>

      <View
        className={`h-14 flex-row items-center gap-3 rounded-2xl border bg-white px-4 ${
          focused ? 'border-brand' : 'border-slate-200'
        }`}>
        <View className={focused ? 'opacity-100' : 'opacity-60'}>{icon}</View>

        <TextInput
          ref={inputRef}
          className="h-full flex-1 text-base text-ink placeholder:text-slate-400"
          selectionColor="#0077b6"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...inputProps}
        />

        {trailing}
      </View>
    </View>
  );
}
