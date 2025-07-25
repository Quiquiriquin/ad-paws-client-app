import { router } from 'expo-router';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Image, Platform, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginForm from '~/components/Forms/LoginForm';
import { SIGN_IN_USER } from '~/lib/mutations/user.mutations';
import * as SecureStore from 'expo-secure-store';
import { Button } from '~/components/nativewindui/Button';

import { Text } from '~/components/nativewindui/Text';
import { useAuth } from '~/context/AuthContext';
import { useMutation } from '@apollo/client';

const LOGO_SOURCE = {
  uri: 'https://nativewindui.com/_next/image?url=/_next/static/media/logo.28276aeb.png&w=2048&q=75',
};

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { handleSubmit } = useFormContext();
  const { login: loginContext } = useAuth();
  const [login, { data }] = useMutation(SIGN_IN_USER);
  const submitLoginForm = (values: any) => {
    const data = values;
    login({ variables: { input: { email: data.email, password: data.password } } });
  };

  useEffect(() => {
    const storeTokens = async (accessToken: string, refreshToken: string) => {
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      loginContext(accessToken);
    };
    if (data) {
      const { accessToken, refreshToken } = data.signUser;
      storeTokens(accessToken, refreshToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <View className="ios:bg-card bg-brandLight! flex-1" style={{ paddingBottom: insets.bottom }}>
      {/* <Stack.Screen
        options={{
          title: 'Log in',
          headerShadowVisible: false,
          headerLeft() {
            return (
              <Link asChild href="/auth">
                <Button variant="plain" className="ios:px-0">
                  <Text className="text-primary">Cancel</Text>
                </Button>
              </Link>
            );
          },
        }}
      /> */}

      <KeyboardAwareScrollView
        bottomOffset={Platform.select({ ios: 175 })}
        bounces={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="ios:pt-12 pt-20">
        <View className="ios:px-12 flex-1 px-8">
          <View className="items-center pb-1">
            <Image
              source={LOGO_SOURCE}
              className="ios:h-12 ios:w-12 h-8 w-8"
              resizeMode="contain"
            />
            <Text variant="title1" className="ios:font-bold pb-1 pt-4 text-center">
              {Platform.select({ ios: '¡Bienvenido!', default: 'Log in' })}
            </Text>
            {Platform.OS !== 'ios' && (
              <Text className="ios:text-sm text-center text-muted-foreground">Welcome back!</Text>
            )}
          </View>
          <View className="ios:pt-4 flex-1 pt-6">
            <LoginForm />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <KeyboardStickyView
        offset={{
          closed: 0,
          opened: Platform.select({ ios: insets.bottom + 30, default: insets.bottom }),
        }}>
        {Platform.OS === 'ios' ? (
          <View className="px-12 py-4">
            <Button size="lg" onPress={handleSubmit(submitLoginForm)}>
              <Text>Continue</Text>
            </Button>
          </View>
        ) : (
          <View className="flex-row justify-between py-4 pl-6 pr-8">
            <Button
              variant="plain"
              className="px-2"
              onPress={() => {
                router.replace('/auth/(create-account)');
              }}>
              <Text className="px-0.5 text-sm text-primary">Create Account</Text>
            </Button>
            <Button
              onPress={() => {
                router.replace('/');
              }}>
              <Text className="text-sm">{'Submit'}</Text>
            </Button>
          </View>
        )}
      </KeyboardStickyView>
      {Platform.OS === 'ios' && (
        <Button
          variant="plain"
          onPress={() => {
            router.replace('/auth/(create-account)');
          }}>
          <Text className="text-sm text-primary">Create Account</Text>
        </Button>
      )}
    </View>
  );
}
