import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AppNavigator from '@/navigation/AppNavigator';
import { getGeofencingTaskName, startGeofencingForZones } from '@/services/geofencing';
import { getZones } from '@/services/zoneService';
import { sendEntryNotification, sendExitNotification } from '@/services/notifications';

// Define the geofence background task
TaskManager.defineTask(getGeofencingTaskName(), async ({ data, error }) => {
  if (error) {
    console.error('Geofencing task error:', error);
    return;
  }

  if (data) {
    const { eventType, region } = data as Location.LocationGeofencingEventData;
    const zoneId = region.identifier;

    // Load zones to get zone name
    try {
      const zones = await getZones();
      const zone = zones.find(z => z.id === zoneId);
      const zoneName = zone ? zone.name : `Zone ${zoneId}`;

      if (eventType === Location.LocationGeofencingEventType.Enter) {
        await sendEntryNotification(zoneName);
        // Attempt to toggle sound mode (limited in managed workflow)
        attemptToggleSilentMode(true);
      } else if (eventType === Location.LocationGeofencingEventType.Exit) {
        await sendExitNotification(zoneName);
        attemptToggleSilentMode(false);
      }
    } catch (e) {
      console.error('Error in geofencing task:', e);
    }
  }
});

// Function to attempt toggling silent mode (limited functionality in managed workflow)
const attemptToggleSilentMode = async (silent: boolean) => {
  // In Expo managed workflow, we cannot directly toggle Do Not Disturb
  // This would require bare workflow or native modules
  // For now, just log the attempt
  console.log(`Attempting to ${silent ? 'enable' : 'disable'} silent mode`);
  // In a bare workflow, you could use AudioManager for Android or AVAudioSession for iOS
  // But since iOS doesn't allow programmatic silent mode toggle anyway, only notifications
};

export default function App() {
  useEffect(() => {
    // Start geofencing on app launch if zones exist
    const initializeGeofencing = async () => {
      const zones = await getZones();
      await startGeofencingForZones(zones);
    };
    initializeGeofencing();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
