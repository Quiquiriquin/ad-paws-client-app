import {
  KeyboardTypeOptions,
  Platform,
  TextInputIOSProps,
  TextInputProps,
  View,
} from 'react-native';
import { Text } from '../nativewindui/Text';
import { Form, FormItem, FormSection } from '../nativewindui/Form';
import { TextField } from '../nativewindui/TextField';
import { KeyboardController } from 'react-native-keyboard-controller';
import { Controller, useFormContext } from 'react-hook-form';
import { Link } from 'expo-router';
import { Button } from '../nativewindui/Button';

const inputConfigs = [
  {
    name: 'name',
    label: 'Nombre',
    placeholder: Platform.select({ ios: 'Nombre', default: '' }),
    autoCapitalize: 'words',
    textContentType: 'givenName',
    autoFocus: true,
    returnKeyType: 'next',
    keyboardType: 'default',
    secureTextEntry: false,
    submitBehavior: 'next',
    rules: {
      required: 'El nombre es requerido',
      pattern: {
        value: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s'-]{2,}$/i,
        message: 'Ingrese un nombre válido',
      },
      minLength: {
        value: 2,
        message: 'El nombre debe tener al menos 2 caracteres',
      },
    },
  },
  {
    name: 'lastname',
    label: 'Apellido',
    placeholder: Platform.select({ ios: 'Apellido', default: '' }),
    autoCapitalize: 'words',
    textContentType: 'familyName',
    autoFocus: false,
    returnKeyType: 'next',
    keyboardType: 'default',
    secureTextEntry: false,
    submitBehavior: 'next',
    rules: {
      required: 'El apellido es requerido',
      pattern: {
        value: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s'-]{2,}$/i,
        message: 'Ingrese un apellido válido',
      },
      minLength: {
        value: 2,
        message: 'El apellido debe tener al menos 2 caracteres',
      },
    },
  },
  {
    name: 'email',
    label: 'Correo electrónico',
    placeholder: Platform.select({ ios: 'Correo electrónico', default: '' }),
    autoCapitalize: 'none',
    textContentType: 'emailAddress',
    autoFocus: false,
    returnKeyType: 'next',
    keyboardType: 'email-address',
    secureTextEntry: false,
    submitBehavior: 'next',
    rules: {
      required: 'El correo electrónico es requerido',
      pattern: {
        value:
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i,
        message: 'Ingrese un correo electrónico válido',
      },
    },
  },
  {
    name: 'phone',
    label: 'Teléfono',
    placeholder: Platform.select({ ios: 'Teléfono', default: '' }),
    autoCapitalize: 'none',
    textContentType: 'telephoneNumber',
    autoFocus: false,
    returnKeyType: 'done',
    keyboardType: 'phone-pad',
    secureTextEntry: false,
    submitBehavior: 'submit',
    rules: {
      required: 'El teléfono es requerido',
      minLength: {
        value: 7,
        message: 'El número telefónico debe tener al menos 7 dígitos',
      },
      maxLength: {
        value: 15,
        message: 'El número telefónico debe tener máximo 15 dígitos',
      },
      pattern: {
        value: /^[0-9+\s()-]+$/,
        message: 'Ingrese un teléfono válido',
      },
    },
  },
  {
    name: 'password',
    label: 'Contraseña',
    placeholder: Platform.select({ ios: 'Contraseña', default: '' }),
    autoCapitalize: 'none',
    textContentType: 'password',
    autoFocus: false,
    returnKeyType: 'done',
    keyboardType: 'default',
    secureTextEntry: true,
    submitBehavior: 'submit',
    rules: {
      required: 'La contraseña es requerida',
      minLength: {
        value: 6,
        message: 'La contraseña debe tener al menos 6 caracteres',
      },
      maxLength: {
        value: 50,
        message: 'La contraseña no puede ser mayor a 50 caracteres',
      },
    },
  },
];

const SignupForm = () => {
  const { control } = useFormContext();

  const handleSubmitEditing = (index: number) => {
    if (index < inputConfigs.length - 1) {
      KeyboardController.setFocusTo('next');
    } else {
      KeyboardController.dismiss();
    }
  };

  return (
    <View className="flex-1 justify-between">
      <Form className="flex-1 gap-2">
        <FormSection className="ios:bg-background">
          {inputConfigs.map((config, idx) => (
            <Controller
              key={config.name}
              control={control}
              name={config.name}
              rules={config.rules}
              render={({ field, fieldState }) => (
                <FormItem>
                  <TextField
                    className="font-sofia"
                    placeholder={config.placeholder}
                    label={config.label}
                    autoFocus={config.autoFocus}
                    keyboardType={config.keyboardType as KeyboardTypeOptions}
                    textContentType={config.textContentType as TextInputIOSProps['textContentType']}
                    returnKeyType={config.returnKeyType as TextInputProps['returnKeyType']}
                    autoCapitalize={config.autoCapitalize as any}
                    secureTextEntry={config.secureTextEntry}
                    onChangeText={field.onChange}
                    value={field.value}
                    onSubmitEditing={() => handleSubmitEditing(idx)}
                    errorMessage={fieldState.error?.message}
                  />
                </FormItem>
              )}
            />
          ))}
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

export default SignupForm;
