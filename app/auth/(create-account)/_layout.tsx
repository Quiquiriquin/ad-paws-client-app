import { Stack } from 'expo-router';
import CustomToast from '~/components/CustomToast';

export default function CreateAccountLayout() {
  return (
    <>
      <Stack.Screen options={{ title: 'Create Account' }} />
      <Stack screenOptions={SCREEN_OPTIONS} />
      <CustomToast
        insets={{
          top: 10,
        }}
      />
    </>
  );
}

const SCREEN_OPTIONS = {
  headerShown: false,
} as const;
