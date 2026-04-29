import { Redirect } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { LoadingSpinner } from '../src/components/ui/LoadingSpinner';
import { theme } from '../src/theme';

export default function Index() {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner label="Chargement..." size="lg" />
      </View>
    );
  }

  return <Redirect href={isAuth ? '/(tabs)' : '/(auth)/login'} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
