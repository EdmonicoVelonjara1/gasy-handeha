import { Pressable, Text } from "react-native";

type SegmentProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function Segment({ label, active, onPress }: SegmentProps) {
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
