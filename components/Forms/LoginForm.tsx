import { Platform, View } from 'react-native';
import { Text } from '../nativewindui/Text';
import { Form, FormItem, FormSection } from '../nativewindui/Form';
import { TextField } from '../nativewindui/TextField';
import { KeyboardController, KeyboardStickyView } from 'react-native-keyboard-controller';
import { Controller, useFormContext } from 'react-hook-form';
import { Link, useRouter } from 'expo-router';
import { Button } from '../nativewindui/Button';
import { useMutation } from '@apollo/client';
import { SIGN_IN_USER } from '~/lib/mutations/user.mutations';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '~/context/AuthContext';

const LoginForm = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { control, getValues } = useFormContext();
  const { login: loginContext } = useAuth();
  const [login, { data }] = useMutation(SIGN_IN_USER);
  const onSubmit = () => {
    const data = getValues();
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
    <Form className="gap-2">
      <FormSection className="ios:bg-background">
        <FormItem>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <TextField
                className="font-sofia"
                placeholder={Platform.select({ ios: 'Email', default: '' })}
                label={Platform.select({ ios: undefined, default: 'Email' })}
                onSubmitEditing={() => KeyboardController.setFocusTo('next')}
                onChangeText={field.onChange}
                submitBehavior="submit"
                autoFocus
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
                autoCapitalize="none"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem>
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                onChangeText={field.onChange}
                className="font-sofia"
                placeholder={Platform.select({ ios: 'Password', default: '' })}
                label={Platform.select({ ios: undefined, default: 'Password' })}
                secureTextEntry
                returnKeyType="done"
                textContentType="password"
                autoCapitalize="none"
                {...field}
                onSubmitEditing={onSubmit}
              />
            )}
          />
        </FormItem>
      </FormSection>
      <View className="flex-row">
        <Link asChild href="/auth/(login)/forgot-password">
          <Button size="sm" variant="plain" className="px-0.5">
            <Text className="text-sm text-primary">¿Olvidaste tu contraseña?</Text>
          </Button>
        </Link>
      </View>
      <KeyboardStickyView
        offset={{
          closed: 0,
          opened: Platform.select({ ios: insets.bottom + 30, default: insets.bottom }),
        }}>
        {Platform.OS === 'ios' ? (
          <View className=" px-12 py-4">
            <Button size="lg" onPress={onSubmit}>
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
    </Form>
  );
};

export default LoginForm;
