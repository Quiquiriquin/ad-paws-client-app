// Alternativa usando fetch directo
export const uploadImageWithFetch = async (dogId: number, asset: any) => {
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
