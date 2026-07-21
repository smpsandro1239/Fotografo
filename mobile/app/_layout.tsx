import { Stack } from 'expo-router';
import { SplashScreen } from 'expo-splash-screen';
import { AuthProvider } from '@/lib/auth-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000000' },
        }}
      >
        <Stack.Screen name="auth" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="events/[id]" />
        <Stack.Screen name="gallery/photo" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="settings" />
      </Stack>
    </AuthProvider>
  );
}
