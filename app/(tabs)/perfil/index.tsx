import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Platform, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserForm, { genderSelectableOptions } from '~/components/Forms/UserForm';
import { Text } from '~/components/nativewindui/Text';
import StickySubmitButton from '~/components/StickySubmit';
import { useAuth } from '~/context/AuthContext';
import { UPDATE_USER } from '~/lib/mutations/user.mutations';

export default function Perfil() {
  const [updateUserMutation, { data, error }] = useMutation(UPDATE_USER);
  const { user, setUser } = useAuth();
  const form = useForm({
    mode: 'all',
  });

  const parsePickerValue = (inputName: string, label: string): string => {
    if (inputName === 'gender') {
      return genderSelectableOptions.find((option) => option.label === label)?.value || '';
    }
    return label;
  };

  const onSubmit = async (formData: any) => {
    const updatedUser = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      lastname: formData.lastname,
      gender: parsePickerValue('gender', formData.gender),
    };
    await updateUserMutation({
      variables: {
        input: {
          ...updatedUser,
        },
      },
    });
    // handle updatedUser as needed
  };

  useEffect(() => {
    form.reset({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      lastname: user?.lastname || '',
      gender: user?.gender
        ? genderSelectableOptions.find((option) => option.value === user.gender)?.label || ''
        : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      console.log('User updated successfully:', data);

      form.reset({
        name: data.updateUser.name,
        email: data.updateUser.email,
        phone: data.updateUser.phone,
        lastname: data.updateUser.lastname,
        gender:
          genderSelectableOptions.find((option) => option.value === data.updateUser.gender)
            ?.label || '',
      });
      setUser({
        ...user,
        ...data.updateUser,
      });
    }
    if (error) {
      console.error('Error updating user:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, form.reset]);
  return (
    <FormProvider {...form}>
      <View className="flex-1 bg-brandLight dark:bg-brandDark ">
        <SafeAreaView className="flex-1 justify-between p-4">
          <View className="flex-1">
            <Text variant="largeTitle">Perfil</Text>
            <KeyboardAwareScrollView
              bottomOffset={Platform.select({ ios: 175, android: 0 })}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              className="mt-6 flex-1">
              <UserForm user={user} />
            </KeyboardAwareScrollView>
          </View>
          <StickySubmitButton
            buttonLabel="Guardar cambios"
            onSubmit={onSubmit}
            disabled={!form.formState.isDirty}
          />
        </SafeAreaView>
      </View>
    </FormProvider>
  );
}
