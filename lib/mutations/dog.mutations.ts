import { gql } from '@apollo/client';

export const CREATE_DOGS = gql`
  mutation CreateDogs($input: CreateDogsInput) {
    createDogs(input: $input) {
      id
      name
      breed
      size
      color
      age
      weight
      owner {
        id
        name
        email
      }
    }
  }
`;

export const UPLOAD_DOG_IMAGE = gql`
  mutation UploadDogPicture($dogId: Int, $file: Upload) {
    uploadDogPicture(dogId: $dogId, file: $file)
  }
`;

export const UPDATE_DOG = gql`
  mutation UpdateDog($input: UpdateDogInput!) {
    updateDog(input: $input) {
      id
      name
      breed
      size
      color
      age
      weight
    }
  }
`;
