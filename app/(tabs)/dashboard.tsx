import { AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { useAuth } from '~/context/AuthContext';

export default function Index() {
  const { assignUser, user } = useAuth();

  useEffect(() => {
    // Solo llamar assignUser si no tenemos usuario
    if (!user) {
      assignUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sin dependencias para evitar loops

  return (
    <View className="flex-1 bg-brandLight dark:bg-brandDark">
      <SafeAreaView className="p-4">
        <Text variant="title2" className="font-sofia">
          Actividad reciente
        </Text>
        <View className="h-full items-center justify-center">
          <AntDesign color="white" name="hourglass" size={36} className="dark:text-white! mb-4" />
          <Text variant="body" className="font-sofia">
            Aquí aparecerá tu actividad reciente.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
