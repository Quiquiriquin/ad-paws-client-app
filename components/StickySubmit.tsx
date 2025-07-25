import { View, Platform } from 'react-native';
import React from 'react';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useFormContext } from 'react-hook-form';
import { Button } from './nativewindui/Button';
import { Text } from './nativewindui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface StickySubmitButtonProps {
  onSubmit: (data: any) => Promise<void> | void;
  buttonLabel?: string;
  showToastOnSuccess?: boolean;
  toastMessage?: string;
  disabled?: boolean;
  loading?: boolean;
  toastMessageSubtitle?: string;
}

export default function StickySubmitButton({
  onSubmit,
  buttonLabel = 'Guardar',
  showToastOnSuccess = true,
  toastMessage = 'Cambios guardados',
  toastMessageSubtitle = '',
  disabled,
  loading,
}: StickySubmitButtonProps) {
  const { formState, handleSubmit } = useFormContext();
  const insets = useSafeAreaInsets();

  const handlePress = async (data: any) => {
    try {
      await onSubmit(data);
      if (showToastOnSuccess) {
        Toast.show({
          type: 'success',
          text1: toastMessage,
          text2: toastMessageSubtitle,
        });
      }
    } catch (err) {
      console.error('StickySubmitButton Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo completar la acción. Inténtalo de nuevo.',
      });
    }
  };

  const isDisabled = disabled ?? (!formState.isDirty || loading);

  return (
    <KeyboardStickyView
      offset={{
        closed: Platform.select({ ios: 0, android: 0 }),
        opened: Platform.select({ ios: insets.bottom + 75, android: 0 }),
      }}>
      <View className="px-4">
        <Button
          size={Platform.select({ ios: 'lg', default: 'md' })}
          disabled={isDisabled}
          onPress={handleSubmit(handlePress)}>
          <Text className="font-sofia">{buttonLabel}</Text>
        </Button>
      </View>
    </KeyboardStickyView>
  );
}
