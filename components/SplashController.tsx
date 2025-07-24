import { useAuth } from '~/context/AuthContext';
import { SplashScreen } from 'expo-router';

export default function SplashScreenController() {
  const { loading } = useAuth();

  if (!loading) {
    SplashScreen.hideAsync();
  }

  return null;
}
