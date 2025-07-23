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
      <SafeAreaView>
        <Text className="font-sofia">Hola dashboard</Text>
      </SafeAreaView>
    </View>
  );
}
