import { View, Platform } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Text } from '~/components/nativewindui/Text';
import PetForm from '~/components/Forms/PetForm';
import { FormProvider, useForm } from 'react-hook-form';
import { useColorScheme } from '~/lib/useColorScheme';

export default function CreatePet() {
  const insets = useSafeAreaInsets();
  const form = useForm({
    mode: 'all',
  });
  const { colorScheme } = useColorScheme();
  return (
    <FormProvider {...form}>
      <View
        className="ios:bg-brandLight! flex-1"
        style={{
          paddingBottom: insets.bottom,
          backgroundColor: colorScheme === 'dark' ? '#060503' : '#f0f1e5',
        }}>
        <KeyboardAwareScrollView
          bottomOffset={Platform.select({ ios: 175 })}
          bounces={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="ios:pt-12 pt-20">
          <View className="bg-brandLight! flex-1 px-6">
            <View className="pb-1">
              <Text variant="title1" className="ios:font-bold pb-1">
                {Platform.select({ ios: 'Registra a tu nuevo peludo', default: 'Log in' })}
              </Text>
              {Platform.OS !== 'ios' && (
                <Text className="ios:text-sm text-center text-muted-foreground">Welcome back!</Text>
              )}
            </View>
            <View className="ios:pt-4 flex-1 pt-6">
              <PetForm />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </FormProvider>
  );
}
