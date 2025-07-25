import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useColorScheme } from '~/lib/useColorScheme';

export default function CustomToast({ ...props }: any) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderWidth: 0,
          borderLeftWidth: 0,
          borderRadius: 8,
          width: '90%',
        }}
        contentContainerStyle={{
          padding: 14,
          width: '100%',
          backgroundColor: '#7bab7eff',
          borderRadius: 8,
          borderWidth: 0,
          borderColor: 'transparent',
        }}
        text1Style={{
          fontSize: 16,
          fontFamily: 'Sofia Pro',
          fontWeight: 'bold',
        }}
        text2Style={{
          fontSize: 14,
          fontWeight: 'normal',
          fontFamily: 'Sofia Pro',
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          borderWidth: 0,
          borderLeftWidth: 0,
          borderRadius: 8,
          width: '90%',
        }}
        contentContainerStyle={{
          padding: 14,
          width: '100%',
          backgroundColor: '#a77878ff',
          borderRadius: 8,
          borderWidth: 0,
          borderColor: 'transparent',
        }}
        text1Style={{
          fontSize: 16,
          fontFamily: 'Sofia Pro',
          fontWeight: 'bold',
        }}
        text2Style={{
          fontSize: 14,
          fontWeight: 'normal',
          fontFamily: 'Sofia Pro',
          color: '#000',
        }}
      />
    ),
  };

  return <Toast topOffset={props?.insets?.top || insets.top} config={toastConfig} />;
}
