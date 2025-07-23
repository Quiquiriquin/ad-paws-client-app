import { createContext, useState, useEffect, useContext, ReactNode, ReactElement } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useLazyQuery } from '@apollo/client';
import { USER } from '~/lib/queries/user.queries';
import { router } from 'expo-router';

type UserData = {
  id: string;
  name: string;
  // Add other properties that 'userInfo.user' would contain
};

type User = {
  token: string;
} & Partial<UserData>;

type AuthContextType = {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  assignUser: () => void;
  tokens: Tokens;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

type Tokens = {
  accessToken: string;
} | null;

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
  const [tokens, setTokens] = useState<Tokens>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [getUserData, { data: userInfo, loading: loadingUser }] = useLazyQuery<{ user: UserData }>(
    USER
  );
  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        setUser({ token });
        setTokens({ accessToken: token });
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const assignUser = () => {
    getUserData();
  };

  const login = async (token: string) => {
    console.log('Logging in with token:', token);
    setTokens({ accessToken: token });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    setTokens(null);
    setUser(null);
  };

  useEffect(() => {
    if (userInfo && userInfo.user) {
      setUser({
        token: tokens?.accessToken || '',
        ...userInfo.user,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  useEffect(() => {
    if (tokens) {
      console.log('Tokens available:', tokens);
      router.replace('/(tabs)/dashboard'); // Redirect to dashboard if tokens are available
    }
  }, [tokens]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading: loading || loadingUser, assignUser, tokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
