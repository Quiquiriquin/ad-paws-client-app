import { Stack } from 'expo-router';
import { LOGIN_MODAL_OPTIONS } from '~/app/auth/_layout';

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
      <Stack.Screen
        name="create"
        options={{
          title: 'Crear Mascota',
          ...LOGIN_MODAL_OPTIONS,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
