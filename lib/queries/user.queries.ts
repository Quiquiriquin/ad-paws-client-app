import { gql } from "@apollo/client";

export const USER = gql`
  query User {
    user {
      id
      email
      name
      lastname
      role
      gender
      phone
      status
    }
  }
`;
