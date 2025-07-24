import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import SplashScreenController from '~/components/SplashController';

export default function TabsLayout() {
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
            tabBarLabel: 'Perfil',
            headerShown: false,
            tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
          }}
        />
      </Tabs>
      <SplashScreenController />
    </>
  );
}
