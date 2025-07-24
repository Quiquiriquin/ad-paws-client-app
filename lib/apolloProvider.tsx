import { ApolloClient, ApolloProvider, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import type { ReactNode } from 'react';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import * as SecureStore from 'expo-secure-store';

export const apiUrl = 'http://192.168.3.234:4000';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

// Auth link
const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync('accessToken');
  const refreshToken = await SecureStore.getItemAsync('refreshToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-refresh-token': refreshToken ? `Bearer ${refreshToken}` : '',
      'X-Client-Type': '1',
    },
  };
});

// Upload link con configuración específica para React Native
const uploadLink = createUploadLink({
  uri: `${apiUrl}/graphql`,
  headers: {
    'apollo-require-preflight': 'true',
  },
  // Configuración específica para React Native
  fetch: (uri, options) => {
    // Modificar las opciones para React Native
    if (options?.body instanceof FormData) {
      // Eliminar Content-Type header para que el navegador lo establezca automáticamente
      if (
        options.headers &&
        typeof options.headers === 'object' &&
        !Array.isArray(options.headers)
      ) {
        delete (options.headers as Record<string, string>)['Content-Type'];
      }
    }
    return fetch(uri, options);
  },
});

const client = new ApolloClient({
  link: from([errorLink, authLink, uploadLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
