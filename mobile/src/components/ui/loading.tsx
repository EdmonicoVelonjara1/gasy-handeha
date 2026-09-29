import { StatusBar } from 'expo-status-bar';
import { View,  ActivityIndicator } from "react-native";
import { styles } from '@/index.css';
import { Image } from 'expo-image';
import { BRAND } from '@/constants/auth';

export function Loading() {
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