import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  ReactElement,
  useCallback,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { useLazyQuery } from '@apollo/client';
import { USER } from '~/lib/queries/user.queries';
import { router } from 'expo-router';

type UserData = {
  id: string;
  name: string;
  // Add other user fields here
};

type User = {
  token: string;
} & Partial<UserData>;

type Tokens = {
  accessToken: string;
} | null;

type AuthContextType = {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  assignUser: () => Promise<void>;
  tokens: Tokens;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
  const [tokens, setTokens] = useState<Tokens>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [fetchUser, { data: userInfo, loading: userLoading, error: errorFetchingUser }] =
    useLazyQuery<{ user: UserData }>(USER, { fetchPolicy: 'network-only' });

  // Load token on mount
  useEffect(() => {
    const loadTokensAndUser = async () => {
      setLoading(true);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (accessToken) {
        setTokens({ accessToken });
        await fetchUser();
      }
      setLoading(false);
    };
    loadTokensAndUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set user info after fetching user
  useEffect(() => {
    if (userInfo && tokens?.accessToken) {
      setUser({
        token: tokens.accessToken,
        ...userInfo.user,
      });
    }
  }, [userInfo, tokens]);

  // Navigate to dashboard when login completes
  useEffect(() => {
    if (tokens?.accessToken && user && !loading && !userLoading) {
      router.replace('/(tabs)/dashboard');
    }
  }, [tokens, user, loading, userLoading]);

  const assignUser = useCallback(async () => {
    if (tokens?.accessToken) {
      await fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  useEffect(() => {
    if (errorFetchingUser) {
      console.error('Error fetching user:', errorFetchingUser);
      setUser(null);
      setTokens(null);
      router.replace('/auth'); // Redirect to auth if there's an error fetching user
    }
  }, [errorFetchingUser]);

  const login = async (accessToken: string) => {
    setLoading(true);
    await SecureStore.setItemAsync('accessToken', accessToken);
    setTokens({ accessToken });
    await fetchUser();
    // if the above fetchUser is asynchronous/does not immediately update, the userInfo effect will run
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await SecureStore.deleteItemAsync('accessToken');
    setTokens(null);
    setUser(null);
    setLoading(false);
    router.replace('/auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading: loading || userLoading,
        assignUser,
        tokens,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
