import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#673ab7', headerShown: false }}>
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Inicio', tabBarLabel: 'Inicio', headerShown: false }}
      />
      {/* <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} /> */}
    </Tabs>
  );
}
