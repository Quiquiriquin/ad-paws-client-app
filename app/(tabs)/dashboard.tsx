import { AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { useAuth } from '~/context/AuthContext';

export default function Index() {
  const { assignUser } = useAuth();

  useEffect(() => {
    assignUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="bg-brandLight flex-1">
      <SafeAreaView className="p-4">
        <Text variant="title2" className="font-sofia">
          Actividad reciente
        </Text>
        <View className="h-full items-center justify-center">
          <AntDesign name="hourglass" size={36} color="black" className="mb-4" />
          <Text variant="body">Aquí aparecerá tu actividad reciente.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
