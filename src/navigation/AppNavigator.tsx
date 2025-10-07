import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Map, List, Settings as SettingsIcon } from 'lucide-react-native';

import HomeScreen from '@/screens/HomeScreen';
import ZoneListScreen from '@/screens/ZoneListScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import ManageZoneScreen from '@/screens/ManageZoneScreen';
import { Colors } from '@/constants/Colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Zones"
        component={ZoneListScreen}
        options={{
          title: 'My Zones',
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={HomeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ManageZone" component={ManageZoneScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
