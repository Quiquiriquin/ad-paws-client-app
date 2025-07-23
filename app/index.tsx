/* eslint-disable react-hooks/exhaustive-deps */
import { LegendList } from '@legendapp/list';
import { cssInterop } from 'nativewind';
import { useEffect } from 'react';
import { useAuth } from '~/context/AuthContext';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import FloatingLogoutButton from '~/components/FloatingLogoutButton';

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

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)/dashboard'); // Redirect to home if logged in
    } else {
      router.replace('/auth'); // Redirect to auth if not logged in
    }
  }, [user]);

  if (!fontsLoaded) return null;
  return (
    <>
      <FloatingLogoutButton />
    </>
  );
}
