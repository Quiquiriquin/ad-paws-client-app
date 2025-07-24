import { Platform, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormWrapper from '~/components/Forms/FormWrapper';
import UserForm from '~/components/Forms/UserForm';
import { Text } from '~/components/nativewindui/Text';
import { useAuth } from '~/context/AuthContext';

export default function Perfil() {
  const { user } = useAuth();
  return (
    <View className="flex-1 bg-brandLight dark:bg-brandDark ">
      <SafeAreaView className="flex-1 p-4">
        <Text variant="largeTitle">Perfil</Text>
        <FormWrapper>
          <KeyboardAwareScrollView
            bottomOffset={Platform.select({ ios: 175, android: 0 })}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            className="mt-6 flex-1">
            <UserForm user={user} />
          </KeyboardAwareScrollView>
        </FormWrapper>
      </SafeAreaView>
    </View>
  );
}
