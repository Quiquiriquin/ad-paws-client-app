import { useLazyQuery, useQuery } from '@apollo/client';
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
  const [getOwnerDogs, { data, loading, error }] = useLazyQuery(GET_USER_DOGS);

  useEffect(() => {
    console.log('Fetching user dogs for user:', user);
    if (user?.id) {
      getOwnerDogs({
        variables: {
          ownerId: parseInt(user.id, 10), // Ensure the id is a number
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
    <View className="flex-1 bg-brandLight dark:bg-brandDark">
      <SafeAreaView className="p-4">
        <Text variant="title2" className="mb-6 font-sofia">
          Mascotas
        </Text>
        <GridList>
          {data?.dogsByOwner?.map((dog: any) => <DogCard key={dog.id} dog={dog} />) || (
            <Text variant="body" className="font-sofia">
              No tienes mascotas registradas.
            </Text>
          )}
        </GridList>
      </SafeAreaView>
    </View>
  );
}
