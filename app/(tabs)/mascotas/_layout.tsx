import { Stack } from 'expo-router';

export default function MascotasLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Mascotas',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detalles de Mascota',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
