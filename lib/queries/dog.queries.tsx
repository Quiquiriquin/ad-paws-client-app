import { gql } from "@apollo/client";

export const COMPANY_ALUMNI = gql`
  query CompanyDogs($companyId: Int, $search: String) {
    companyDogs(companyId: $companyId, search: $search) {
      id
      breed
      age
      name
      ownerId
      imageUrl
      notes
      owner {
        name
        lastname
        id
      }
      size
    }
  }
`;

export const GET_USER_DOGS = gql`
  query GetDogsByOwner($ownerId: Int!) {
    dogsByOwner(ownerId: $ownerId) {
      id
      name
      breed
      age
      size
      imageUrl
    }
  }
`;

export const GET_DOG_BY_ID = gql`
  query GetDogById($id: Int!) {
    dogById(id: $id) {
      id
      name
      breed
      age
      size
      imageUrl
      notes
      ownerId
      weight
      color
      owner {
        id
        name
        lastname
        email
        phone
      }
    }
  }
`;
