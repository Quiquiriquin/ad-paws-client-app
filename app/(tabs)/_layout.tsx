import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import SplashScreenController from '~/components/SplashController';
import { useProtectedRoute } from '~/hooks/useProtectedRoute';
import { View } from 'react-native';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { useAuth } from '~/context/AuthContext';

export default function TabsLayout() {
  const { user } = useAuth();
  const { isAuthenticated, loading } = useProtectedRoute();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brandLight dark:bg-brandDark">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // El hook se encarga de la navegación
  }

  console.log('User in tabs layout:', user);

  return (
    <>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Inicio',
            tabBarLabel: 'Inicio',
            headerShown: false,
            tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="mascotas"
          options={{
            title: 'Mascotas',
            tabBarLabel: 'Mascotas',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="dog" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarLabel: user?.name || 'Perfil',
            headerShown: false,
            tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
          }}
        />
      </Tabs>
      <SplashScreenController />
    </>
  );
}
