import { useEffect } from 'react';
import { useAuth } from '~/context/AuthContext';
import { router, useSegments } from 'expo-router';

export function useAuthGuard() {
  const { tokens, loading, user } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    // Si no está autenticado y está en una ruta protegida
    if (!tokens && inTabsGroup) {
      router.replace('/auth');
      return;
    }

    // Si está autenticado pero no tiene datos de usuario y está en tabs
    if (tokens && !user && inTabsGroup) {
      // Esperar a que se cargue el usuario
      return;
    }

    // Si está autenticado, tiene usuario y está en auth
    if (tokens && user && inAuthGroup) {
      router.replace('/(tabs)/dashboard');
      return;
    }
  }, [tokens, user, loading, segments]);

  return {
    isAuthenticated: !!tokens,
    hasUser: !!user,
    loading,
  };
}
