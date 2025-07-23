import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

export const SIGN_IN_USER = gql`
  mutation SignInUser($input: SignInUserInput!) {
    signUser(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
      status
      role
      phone
      gender
      lastname
    }
  }
`;
