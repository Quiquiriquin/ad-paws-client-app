import { useMutation } from '@apollo/client';
import { router } from 'expo-router';
import { setItemAsync } from 'expo-secure-store';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Image, Platform, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import SignupForm from '~/components/Forms/SignupForm';

import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import { useAuth } from '~/context/AuthContext';
import { CREATE_USER } from '~/lib/mutations/user.mutations';

const LOGO_SOURCE = {
  uri: 'https://nativewindui.com/_next/image?url=/_next/static/media/logo.28276aeb.png&w=2048&q=75',
};

export default function InfoScreen() {
  const form = useForm({
    mode: 'all',
  });
  const insets = useSafeAreaInsets();
  const { login: loginContext } = useAuth();
  const [createUser, { data: createUserData, loading: createUserLoading, error: createUserError }] =
    useMutation(CREATE_USER);
  const submitSignupForm = async (values: any) => {
    const data = values;
    await createUser({
      variables: {
        input: {
          name: data.name,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
          role: 'CLIENT',
        },
      },
    });
  };

  useEffect(() => {
    const storeTokens = async (accessToken: string, refreshToken: string) => {
      await setItemAsync('accessToken', accessToken);
      await setItemAsync('refreshToken', refreshToken);
      loginContext(accessToken);
    };

    if (createUserData) {
      console.log('User created successfully:', createUserData);
      const { tokens } = createUserData.createUser;
      storeTokens(tokens.accessToken, tokens.refreshToken);
      // Navigate to the next screen or show a success message
    }
    if (createUserError) {
      console.error('Error creating user:', JSON.stringify(createUserError, null, 2));
      // Handle error, e.g., show an error message
      Toast.show({
        type: 'error',
        text1: 'Ocurrió un error al crear la cuenta',
        text2: 'Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }, [createUserData, createUserError, loginContext]);

  return (
    <FormProvider {...form}>
      <View className="ios:bg-card bg-brandLight! flex-1" style={{ paddingBottom: insets.bottom }}>
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
                {Platform.select({ ios: '¡Crea tu cuenta!', default: 'Log in' })}
              </Text>
              {Platform.OS !== 'ios' && (
                <Text className="ios:text-sm text-center text-muted-foreground">Welcome back!</Text>
              )}
            </View>
            <View className="ios:pt-4 flex-1 pt-6">
              <SignupForm />
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
              <Button
                disabled={!form.formState.isValid || createUserLoading}
                size="lg"
                onPress={form.handleSubmit(submitSignupForm)}>
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
    </FormProvider>
  );
}
