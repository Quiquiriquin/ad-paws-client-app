import { View, Text } from 'react-native';

import TouchableCard from './TouchableCard';
import { useRouter } from 'expo-router';
import { Avatar, AvatarFallback, AvatarImage } from './nativewindui/Avatar';

export default function DogCard({ dog }: { dog: any }) {
  const router = useRouter();
  const onPress = () => {
    router.push(`/mascotas/${dog.id}`);
  };
  return (
    <TouchableCard onPress={onPress}>
      <View className="flex flex-col items-center rounded-md bg-neutral-100 p-4 shadow-sm">
        <Avatar alt="Dog Avatar" className="mb-2 h-16 w-16 items-center justify-center">
          <AvatarImage
            source={{ uri: dog?.imageUrl || 'https://via.placeholder.com/150' }}
            resizeMode="cover"
            className="rounded-full object-cover"
          />
          <AvatarFallback>
            <Text>{dog?.name?.charAt(0).toUpperCase() || 'D'}</Text>
          </AvatarFallback>
        </Avatar>

        <Text numberOfLines={1} ellipsizeMode="tail" className="">
          {dog?.name}
        </Text>
      </View>
    </TouchableCard>
  );
}
