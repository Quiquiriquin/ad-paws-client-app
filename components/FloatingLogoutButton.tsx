import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '~/context/AuthContext';
import { useRouter } from 'expo-router';

const FloatingLogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuth();
  if (!__DEV__) return null;

  const handleLogout = async () => {
    logout();
    await SecureStore.deleteItemAsync('accessToken');
    alert('Token eliminado del SecureStore');
    router.replace('/auth'); // Redirigir a la pantalla de autenticación
    // Aquí puedes agregar más limpieza si usas contextos o navegación
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handleLogout}>
      <Text style={styles.fabText}>⎋</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#e74c3c',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 999,
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default FloatingLogoutButton;
