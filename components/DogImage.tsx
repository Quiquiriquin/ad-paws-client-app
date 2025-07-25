import { useState } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { DropdownMenu } from '~/components/nativewindui/DropdownMenu';
import { Feather } from '@expo/vector-icons';
import { createDropdownItem } from './nativewindui/DropdownMenu/utils';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { apiUrl } from '~/lib/apolloProvider';

// Alternativa usando fetch directo
const uploadImageWithFetch = async (dogId: number, asset: any) => {
  const formData = new FormData();

  // @ts-ignore
  formData.append(
    'operations',
    JSON.stringify({
      query: `
      mutation UploadDogPicture($dogId: Int!, $file: Upload!) {
        uploadDogPicture(dogId: $dogId, file: $file)
      }
    `,
      variables: { dogId, file: null },
    })
  );

  // @ts-ignore
  formData.append('map', JSON.stringify({ '0': ['variables.file'] }));

  // @ts-ignore
  formData.append('0', {
    uri: asset.uri,
    name: asset.fileName || 'photo.jpg',
    type: asset.mimeType || 'image/jpeg',
  });

  const token = await SecureStore.getItemAsync('accessToken');

  const response = await fetch(`${apiUrl}/graphql`, {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'X-Client-Type': '1',
    },
    body: formData,
  });

  return response.json();
};

export default function DogImage({
  data,
  onImageUploaded,
}: {
  data: any;
  onImageUploaded?: (imageUrl: string) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const showImage = !!data?.dogById?.imageUrl;

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Toast.show({
          type: 'error',
          text1: 'Permisos requeridos',
          text2: 'Necesitamos acceso a tu galería para subir fotos',
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadLoading(true);
        const asset = result.assets[0];

        try {
          const response = await uploadImageWithFetch(
            Number.parseInt(data?.dogById?.id || '0', 10),
            asset
          );

          if (response.data?.uploadDogPicture) {
            Toast.show({
              type: 'success',
              text1: 'Foto subida',
              text2: 'La foto se ha actualizado correctamente',
            });

            onImageUploaded?.(response.data.uploadDogPicture);
          }
          setUploadLoading(false);
        } catch (err) {
          console.error('Upload failed:', err);
          Toast.show({
            type: 'error',
            text1: 'Error al subir foto',
            text2: 'No se pudo subir la imagen. Inténtalo de nuevo.',
          });
          setUploadLoading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo acceder a la galería',
      });
      setUploadLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Toast.show({
          type: 'error',
          text1: 'Permisos requeridos',
          text2: 'Necesitamos acceso a tu cámara para tomar fotos',
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadLoading(true);
        const asset = result.assets[0];

        try {
          const response = await uploadImageWithFetch(
            Number.parseInt(data?.dogById?.id || '0', 10),
            asset
          );

          if (response.data?.uploadDogPicture) {
            Toast.show({
              type: 'success',
              text1: 'Foto tomada',
              text2: 'La foto se ha actualizado correctamente',
            });

            onImageUploaded?.(response.data.uploadDogPicture);
          }
          setUploadLoading(false);
        } catch (err) {
          console.error('Upload failed:', err);
          Toast.show({
            type: 'error',
            text1: 'Error al subir foto',
            text2: 'No se pudo subir la imagen. Inténtalo de nuevo.',
          });
          setUploadLoading(false);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo acceder a la cámara',
      });
      setUploadLoading(false);
    }
  };

  return (
    <View className="relative mx-auto mt-4 h-[175px] w-[175px] flex-row justify-center">
      {showImage ? (
        <>
          {!imageLoaded && (
            <View className="absolute z-0 h-full w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
          )}
          <Image
            source={{ uri: data.dogById.imageUrl }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 10,
            }}
            className="z-10"
            resizeMode="cover"
            onLoadEnd={() => setImageLoaded(true)}
          />
        </>
      ) : (
        <View className="z-0 flex-1 items-center justify-center rounded-lg bg-neutral-200 p-8 dark:bg-neutral-700">
          <Text
            variant="body"
            className="text-center font-sofia text-xs font-semibold dark:text-neutral-300">
            Aún no tenemos una foto de tu peludo
          </Text>
        </View>
      )}

      {uploadLoading && (
        <View className="absolute inset-0 z-30 items-center justify-center rounded-lg bg-black/50">
          <Text className="text-white">Subiendo...</Text>
        </View>
      )}

      <View className="absolute right-2 top-2 z-20">
        <DropdownMenu
          title="Acciones"
          items={[
            createDropdownItem({
              actionKey: 'gallery',
              title: showImage ? 'Cambiar desde galería' : 'Subir desde galería',
              icon: { name: 'image', namingScheme: 'material' },
            }),
            createDropdownItem({
              actionKey: 'camera',
              title: 'Tomar foto',
              icon: { name: 'camera', namingScheme: 'material' },
            }),
          ]}
          onItemPress={(item) => {
            switch (item.actionKey) {
              case 'gallery':
                pickImage();
                break;
              case 'camera':
                takePhoto();
                break;
            }
          }}>
          <TouchableOpacity
            className="rounded-full bg-white/90 p-1 shadow-sm"
            disabled={uploadLoading}>
            <Feather name="more-vertical" size={24} color={uploadLoading ? '#999' : 'black'} />
          </TouchableOpacity>
        </DropdownMenu>
      </View>
    </View>
  );
}
