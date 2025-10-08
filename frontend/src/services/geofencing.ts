import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Zone } from '@/types';

const GEOFENCE_TASK = 'GEOFENCE_TASK';

export const startGeofencingForZones = async (zones: Zone[]) => {
  try {
    // Stop existing geofencing if any
    await stopGeofencing();

    // Filter active zones
    const activeZones = zones.filter(zone => zone.isActive);

    if (activeZones.length === 0) return;

    // Prepare regions
    const regions = activeZones.map(zone => ({
      identifier: zone.id,
      latitude: zone.latitude,
      longitude: zone.longitude,
      radius: zone.radius,
      notifyOnEnter: true,
      notifyOnExit: true,
    }));

    // Start geofencing
    await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
  } catch (error) {
    console.error('Error starting geofencing:', error);
    throw error;
  }
};

export const stopGeofencing = async () => {
  try {
    await Location.stopGeofencingAsync(GEOFENCE_TASK);
  } catch (error) {
    console.error('Error stopping geofencing:', error);
  }
};

export const removeGeofenceForZone = async (zoneId: string) => {
  // Expo doesn't have direct remove, so we restart with filtered zones
  // This is a limitation, but for simplicity, we'll handle in the calling function
};

export const getGeofencingTaskName = () => GEOFENCE_TASK;