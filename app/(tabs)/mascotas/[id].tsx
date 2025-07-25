import { Platform, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@apollo/client';
import { GET_DOG_BY_ID } from '~/lib/queries/dog.queries';
import PetForm from '~/components/Forms/PetForm';
import { BackButton } from '~/components/BackButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import DogImage from '~/components/DogImage';

import { FormProvider, useForm } from 'react-hook-form';
import StickySubmitButton from '~/components/StickySubmit';
import { dogBreedSelectableOptions } from '~/utils/breed.catalog';
import { dogSizeOptions } from '~/utils/size.catalog';
import { UPDATE_DOG } from '~/lib/mutations/dog.mutations';
import { useEffect } from 'react';

export default function PetInformation() {
  const form = useForm({
    mode: 'all',
  });
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [updateDogMutation, { data: dataMutation, loading: loadingMutation, error }] =
    useMutation(UPDATE_DOG);

  const { data, loading, refetch } = useQuery(GET_DOG_BY_ID, {
    variables: { id: parseInt(id as string, 10) },
  });

  const parsePickerValue = (inputName: string, label: string): string => {
    if (inputName === 'breed') {
      return dogBreedSelectableOptions.find((option) => option.label === label)?.value || '';
    }
    if (inputName === 'size') {
      return dogSizeOptions.find((option) => option.label === label)?.value || '';
    }
    return label;
  };

  const onSubmit = async (formData: any) => {
    const updatedDog = {
      name: formData.name,
      breed: parsePickerValue('breed', formData.breed),
      color: formData.color,
      size: parsePickerValue('size', formData.size),
      age: parseInt(formData.age, 10),
      weight: parseFloat(formData.weight),
    };
    console.log('Updated Dog:', updatedDog);
    await updateDogMutation({
      variables: {
        input: {
          id: parseInt(data?.dogById.id, 10),
          ...updatedDog,
        },
      },
    });
    // handle updatedDog as needed
  };

  useEffect(() => {
    if (dataMutation) {
      form.reset({
        name: dataMutation.updateDog.name,
        breed:
          dogBreedSelectableOptions.find((option) => option.value === dataMutation.updateDog.breed)
            ?.label || '',
        color: dataMutation.updateDog.color,
        size:
          dogSizeOptions.find((option) => option.value === dataMutation.updateDog.size)?.label ||
          '',
        age: String(dataMutation.updateDog.age),
        weight: String(dataMutation.updateDog.weight),
      });
    }
    if (error) {
      console.error('Error updating dog:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMutation, error]);

  if (loading) {
    return (
      <View className="flex-1 justify-center">
        <View className="mx-auto mb-4 h-[200px] w-[200px] rounded-lg bg-neutral-200 dark:bg-neutral-700" />
      </View>
    );
  }

  return (
    <FormProvider {...form}>
      <SafeAreaView className="flex-1 justify-between bg-brandLight dark:bg-brandDark">
        {/* Fijo arriba */}
        <View className="mb-4 flex-1">
          <View className="bg-brandLight px-4 pt-4 dark:bg-brandDark">
            <BackButton onPress={() => router.back()} />
            <Text variant="title2" className="mt-2 font-sofia">
              Información de {data?.dogById?.name}
            </Text>
          </View>

          <DogImage data={data} onImageUploaded={(url) => refetch()} />

          <KeyboardAwareScrollView
            bottomOffset={Platform.select({ ios: 175, android: 0 })}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            className="px-4">
            <View className="flex-1">
              <PetForm dog={data?.dogById} />
            </View>
          </KeyboardAwareScrollView>
        </View>
        <StickySubmitButton
          toastMessage="Información actualizada correctamente"
          onSubmit={onSubmit}
          disabled={!form.formState.isDirty || loadingMutation}
        />
      </SafeAreaView>
    </FormProvider>
  );
}
