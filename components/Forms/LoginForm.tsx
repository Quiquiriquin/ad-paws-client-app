import { Platform, View } from 'react-native';
import { Text } from '../nativewindui/Text';
import { Form, FormItem, FormSection } from '../nativewindui/Form';
import { TextField } from '../nativewindui/TextField';
import { KeyboardController } from 'react-native-keyboard-controller';
import { Controller, useFormContext } from 'react-hook-form';
import { Link } from 'expo-router';
import { Button } from '../nativewindui/Button';

const LoginForm = () => {
  const { control } = useFormContext();

  return (
    <View className="flex-1 justify-between">
      <Form className="flex-1 gap-2">
        <FormSection className="ios:bg-background">
          <FormItem>
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <TextField
                  className="font-sofia"
                  placeholder={Platform.select({ ios: 'Email', default: '' })}
                  label={Platform.select({ ios: 'Correo electrónico', default: 'Email' })}
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
                  label={Platform.select({ ios: 'Contraseña', default: 'Password' })}
                  secureTextEntry
                  returnKeyType="done"
                  textContentType="password"
                  autoCapitalize="none"
                  {...field}
                  onSubmitEditing={() => KeyboardController.dismiss()}
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
      </Form>
    </View>
  );
};

export default LoginForm;
