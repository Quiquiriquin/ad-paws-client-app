import { useEffect } from 'react';
import { useAuth } from '~/context/AuthContext';
import { router, useSegments } from 'expo-router';

export function useProtectedRoute() {
  const { tokens, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    // Si no está autenticado y está en una ruta protegida
    if (!tokens && inTabsGroup) {
      router.replace('/auth');
    }

    // Si está autenticado y está en auth
    if (tokens && inAuthGroup) {
      router.replace('/(tabs)/dashboard');
    }
  }, [tokens, loading, segments]);

  return { isAuthenticated: !!tokens, loading };
}
