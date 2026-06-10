import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../src/store/authStore';
import { useRouter, useSegments } from 'expo-router';

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect until the async checkAuth() has resolved
    if (isInitializing) return;

    const inAuthGroup = segments[0] === '(auth)';
    const onLanding = segments[0] === 'landing';
    const onSplash = segments[0] === 'splash';

    // Splash and landing are always accessible without auth
    if (onSplash || onLanding) return;

    if (!isAuthenticated && !inAuthGroup) {
      // Not logged in — send to login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && user && inAuthGroup) {
      // Already logged in — send to the correct dashboard based on role
      if (user.role === 'client') {
        router.replace('/(client)/dashboard');
      } else {
        // admin and employee both go to internal dashboard
        router.replace('/(internal)/dashboard');
      }
    }
  }, [isAuthenticated, isInitializing, user, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const { checkAuth, isInitializing } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // Show a minimal loading screen while the session is being restored.
  // Without this the AuthGuard would fire before checkAuth() resolves and
  // immediately redirect the user to login even if they have a valid token.
  if (isInitializing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#030712', alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#eab308" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthGuard>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="splash" options={{ animation: 'none' }} />
              <Stack.Screen name="landing" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(client)" />
              <Stack.Screen name="(internal)" />
            </Stack>
          </AuthGuard>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
