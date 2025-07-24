import { Platform, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@apollo/client';
import { GET_DOG_BY_ID } from '~/lib/queries/dog.queries';
import PetForm from '~/components/Forms/PetForm';
import FormWrapper from '~/components/Forms/FormWrapper';
import { BackButton } from '~/components/BackButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import DogImage from '~/components/DogImage';

export default function PetInformation() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data, loading, refetch } = useQuery(GET_DOG_BY_ID, {
    variables: { id: parseInt(id as string, 10) },
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center">
        <View className="mx-auto mb-4 h-[200px] w-[200px] rounded-lg bg-neutral-200 dark:bg-neutral-700" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-brandLight dark:bg-brandDark">
      {/* Fijo arriba */}
      <View className="bg-brandLight px-4 pt-4 dark:bg-brandDark">
        <BackButton onPress={() => router.back()} />
        <Text variant="title2" className="mt-2 font-sofia">
          Información de {data?.dogById?.name}
        </Text>
      </View>

      <DogImage data={data} onImageUploaded={(url) => refetch()} />

      <FormWrapper>
        <KeyboardAwareScrollView
          bottomOffset={Platform.select({ ios: 175, android: 0 })}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          className="flex-1 px-4">
          <PetForm dog={data?.dogById} />
        </KeyboardAwareScrollView>
      </FormWrapper>
    </SafeAreaView>
  );
}
