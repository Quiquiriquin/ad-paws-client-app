import { LegendList } from '@legendapp/list';
import { cssInterop } from 'nativewind';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { Text } from '~/components/nativewindui/Text';

cssInterop(LegendList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});

export default function Screen() {
  const [fontsLoaded] = useFonts({
    Sofia: require('../assets/fonts/sofia-regular.otf'),
    SofiaBold: require('../assets/fonts/sofia-semi-bold.otf'),
    SofiaLight: require('../assets/fonts/sofia-light.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-brandLight dark:bg-brandDark">
        <ActivityIndicator size="large" />
        <Text className="mt-4 font-sofia">Cargando...</Text>
      </View>
    );
  }

  // Solo mostrar loading, el AuthContext maneja toda la navegación
  return (
    <View className="flex-1 items-center justify-center bg-brandLight dark:bg-brandDark">
      <ActivityIndicator size="large" />
    </View>
  );
}
