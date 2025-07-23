import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { type ReactNode } from 'react';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import * as SecureStore from 'expo-secure-store';

const apiUrl = 'http://192.168.3.234:4000';
const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = await SecureStore.getItemAsync('accessToken');
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-refresh-token': refreshToken ? `Bearer ${refreshToken}` : '',
      'X-Client-Type': '1',
    },
  };
});
const uploadLink = createUploadLink({
  uri: `${apiUrl || 'http://localhost:4000'}/graphql`,
  headers: {
    'apollo-require-preflight': 'true',
  },
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
});

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
