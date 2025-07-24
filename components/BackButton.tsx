import { Feather } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { Text } from './nativewindui/Text';

export const BackButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <View className="flex-row items-center">
      <Feather name="chevron-left" size={16} color="#007AFF" />
      <Text className="pt-2font-sofia" style={styles.backButtonText} onPress={onPress}>
        Regresar
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
  },
  backButtonText: {
    color: '#007AFF',
  },
});
