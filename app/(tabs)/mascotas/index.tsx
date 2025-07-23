import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DogCard from '~/components/DogCard';
import GridList from '~/components/GridList';
import { Text } from '~/components/nativewindui/Text';
import { useAuth } from '~/context/AuthContext';
import { GET_USER_DOGS } from '~/lib/queries/dog.queries';

export default function Mascotas() {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(GET_USER_DOGS, {
    variables: {
      ownerId: parseInt(user?.id || '0', 10), // Assuming user has an id property
    },
  });

  useEffect(() => {
    if (data) {
      console.log('User Dogs Data:', data);
    }
  }, [data]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text variant="body">Cargando mascotas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text variant="body">Error al cargar mascotas: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="bg-brandLight flex-1">
      <SafeAreaView className="p-4">
        <Text variant="title2" className="font-sofia mb-6">
          Mascotas
        </Text>
        <GridList>
          {data?.dogsByOwner?.map((dog: any) => <DogCard key={dog.id} dog={dog} />) || (
            <Text variant="body">No tienes mascotas registradas.</Text>
          )}
        </GridList>
      </SafeAreaView>
    </View>
  );
}
