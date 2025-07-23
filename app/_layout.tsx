import '../global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';

import { KeyboardProvider } from 'react-native-keyboard-controller';
import { AuthProvider } from '~/context/AuthContext';
import RootNavigator from '~/navigation/RootNavigator';
import { NAV_THEME } from '~/theme';
import { ApolloWrapper } from '~/lib/apolloProvider';
import FloatingLogoutButton from '~/components/FloatingLogoutButton';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
      <NavThemeProvider value={NAV_THEME[colorScheme]}>
        <ApolloWrapper>
          <AuthProvider>
            <StatusBar
              key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
              style={isDarkColorScheme ? 'light' : 'dark'}
              backgroundColor={isDarkColorScheme ? '#060503' : '#f0f1e5'}
              translucent={false}
            />
            <RootNavigator />
            <FloatingLogoutButton />
          </AuthProvider>
        </ApolloWrapper>
      </NavThemeProvider>
    </KeyboardProvider>
  );
}
