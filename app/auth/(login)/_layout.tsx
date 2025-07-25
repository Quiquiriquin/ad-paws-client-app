import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import FormWrapper from '~/components/Forms/FormWrapper';

export default function LoginLayout() {
  return (
    <FormWrapper>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Iniciar Sesión',
            headerShown: false,
          }}
        />
      </Stack>
    </FormWrapper>
  );
}

const SCREEN_OPTIONS = {
  headerShown: Platform.OS === 'ios',
} as const;
