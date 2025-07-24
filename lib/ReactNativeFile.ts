export class ReactNativeFile {
  uri: string;
  name: string;
  type: string;

  constructor({ uri, name, type }: { uri: string; name: string; type: string }) {
    this.uri = uri;
    this.name = name;
    this.type = type;
  }
}

// Función para crear un archivo compatible con apollo-upload-client
export const createUploadFile = (asset: any) => {
  // Para React Native, necesitamos crear un objeto que simule un File
  const file = {
    uri: asset.uri,
    name: asset.fileName || asset.name || 'photo.jpg',
    type: asset.mimeType || asset.type || 'image/jpeg',
  };

  // Agregar propiedades que apollo-upload-client espera
  Object.defineProperty(file, 'constructor', {
    value: File,
    writable: false,
  });

  return file;
};

// Alternativa usando FormData (más compatible)
export const createFormDataFile = (asset: any) => {
  const formData = new FormData();

  // @ts-ignore - FormData en React Native acepta objetos con uri
  formData.append('file', {
    uri: asset.uri,
    name: asset.fileName || asset.name || 'photo.jpg',
    type: asset.mimeType || asset.type || 'image/jpeg',
  });

  return formData.get('file');
};
