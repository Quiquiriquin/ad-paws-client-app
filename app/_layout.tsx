import '../global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { AuthProvider } from '~/context/AuthContext';
import { NAV_THEME } from '~/theme';
import { ApolloWrapper } from '~/lib/apolloProvider';
import FloatingLogoutButton from '~/components/FloatingLogoutButton';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import CustomToast from '~/components/CustomToast';

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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ApolloWrapper>
              <AuthProvider>
                <StatusBar
                  key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
                  style={isDarkColorScheme ? 'light' : 'dark'}
                  backgroundColor={isDarkColorScheme ? '#060503' : '#f0f1e5'}
                  translucent={false}
                />
                <Slot />
                <FloatingLogoutButton />
                <CustomToast />
              </AuthProvider>
            </ApolloWrapper>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </NavThemeProvider>
    </KeyboardProvider>
  );
}
