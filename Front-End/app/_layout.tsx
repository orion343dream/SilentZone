import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingBottom: 8,
        paddingTop: 8,
        height: 60,
      },
      tabBarActiveTintColor: '#0F62FE',
      tabBarInactiveTintColor: '#64748B',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      headerStyle: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
      },
      headerTintColor: '#0F172A',
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 18,
      },
    }}>
      <Tabs.Screen
        name="(tabs)/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => '🏠',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="zones"
        options={{
          title: 'Zones',
          tabBarIcon: ({ color, size }) => '📍',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => '🗺️',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => '⚙️',
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="permissions" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-zone" options={{ title: 'Add Zone' }} />
        <Stack.Screen name="zone/[id]" options={{ title: 'Zone Details' }} />
        <Stack.Screen name="history" options={{ title: 'History' }} />
        <Stack.Screen name="help" options={{ title: 'Help' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


