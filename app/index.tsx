/* eslint-disable react-hooks/exhaustive-deps */
import { LegendList } from '@legendapp/list';
import { cssInterop } from 'nativewind';
import { useEffect } from 'react';
import { useAuth } from '~/context/AuthContext';
import { useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';

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

  const { tokens, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!fontsLoaded || loading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (tokens && inAuthGroup) {
      // Usuario autenticado pero en páginas de auth, redirigir a dashboard
      router.replace('/(tabs)/dashboard');
    } else if (!tokens && !inAuthGroup) {
      // Usuario no autenticado pero no en páginas de auth, redirigir a auth
      router.replace('/auth');
    }
  }, [tokens, loading, fontsLoaded, segments]);

  // Mostrar loading mientras se cargan las fuentes o se verifica la autenticación
  if (!fontsLoaded || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brandLight dark:bg-brandDark">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Este componente no debería renderizar nada más, la navegación se maneja arriba
  return null;
}
