import { gql } from 'urql';

export const GET_USERS = gql`
  query GetUsers($status: UserStatus!) {
    users(status: $status) {
      id
      firstName
      lastName
    }
  }
`;