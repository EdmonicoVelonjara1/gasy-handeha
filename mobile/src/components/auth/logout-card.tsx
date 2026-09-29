import { 
  View,
  Text, 
  Pressable 
} from "react-native";

import { SymbolView } from "expo-symbols";
import { BRAND } from "@/constants/auth";

type LogoutCardProps = {
  session: {
    user: {
      email: string;
    };
  };
  handleSignOut: () => void;
};

export function LogoutCard({ session, handleSignOut }: LogoutCardProps) {
  return (
        <View className="w-full h-full items-center justify-center gap-8 p-5 bg-gray-100">
          <View className="w-full items-center self-center border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <View className="size-16 items-center justify-center rounded-2xl bg-mist">
              <SymbolView
                name={{ ios: 'person.crop.circle.fill', android: 'person' }}
                tintColor={BRAND}
                size={34}
              />
            </View>

            <Text className="mt-6 text-3xl font-extrabold tracking-[-0.04em] text-ink">
              Vous êtes connecté
            </Text>
            <Text className="mt-2 text-center text-base text-slate-500">{session.user.email}</Text>

            <Pressable
              className="mt-8 h-14 w-full max-w-xs items-center justify-center rounded-2xl border border-slate-200 bg-white transition active:scale-[0.98]"
              onPress={handleSignOut}>
              <Text className="text-base font-extrabold text-ink">Se déconnecter</Text>
            </Pressable>
          </View>
        </View>
  )
}