import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
  type ReactElement,
  useRef,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { useLazyQuery } from '@apollo/client';
import { USER } from '~/lib/queries/user.queries';
import { router, useSegments } from 'expo-router';

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastname: string;
  gender: string;
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
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
  const [tokens, setTokens] = useState<Tokens>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const segments = useSegments();

  // Refs para evitar dependencias circulares
  const hasInitialized = useRef(false);
  const isNavigating = useRef(false);

  const [fetchUser] = useLazyQuery<{ user: UserData }>(USER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data.user && tokens?.accessToken) {
        setUser({
          token: tokens.accessToken,
          ...data.user,
        });
      }
      setLoading(false);
    },
    onError: (error) => {
      console.error('Error fetching user:', error);
      setTokens(null);
      setUser(null);
      setLoading(false);
    },
  });

  // 1. Inicialización única al montar
  useEffect(() => {
    if (hasInitialized.current) return;

    const initializeAuth = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');

        if (accessToken) {
          setTokens({ accessToken });
          // Llamar fetchUser solo si tenemos token
          fetchUser();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    hasInitialized.current = true;
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sin dependencias

  // 2. Navegación basada en estado
  useEffect(() => {
    if (loading || isNavigating.current) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';
    const isOnRoot = !segments.length;

    // Usuario autenticado con datos
    if (tokens?.accessToken && user) {
      if (inAuthGroup || isOnRoot) {
        isNavigating.current = true;
        router.replace('/(tabs)/dashboard');
        setTimeout(() => {
          isNavigating.current = false;
        }, 100);
      }
      return;
    }

    // Usuario no autenticado
    if (!tokens?.accessToken) {
      if (inTabsGroup || isOnRoot) {
        isNavigating.current = true;
        router.replace('/auth');
        setTimeout(() => {
          isNavigating.current = false;
        }, 100);
      }
      return;
    }

    // Usuario autenticado pero sin datos (esperando)
    // No hacer nada, esperar a que se carguen los datos
  }, [tokens, user, loading, segments]);

  const assignUser = async () => {
    if (tokens?.accessToken && !loading) {
      setLoading(true);
      fetchUser();
    }
  };

  const login = async (accessToken: string) => {
    try {
      setLoading(true);
      isNavigating.current = false;

      await SecureStore.setItemAsync('accessToken', accessToken);
      setTokens({ accessToken });

      // fetchUser se llamará automáticamente cuando tokens cambie
      fetchUser();
    } catch (error) {
      console.error('Login error:', error);
      setTokens(null);
      setUser(null);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      isNavigating.current = false;

      await SecureStore.deleteItemAsync('accessToken');
      setTokens(null);
      setUser(null);

      router.replace('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        assignUser,
        tokens,
        setUser,
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
