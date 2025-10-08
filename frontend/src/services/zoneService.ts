import AsyncStorage from '@react-native-async-storage/async-storage';
import { Zone } from '@/types';

const ZONES_KEY = 'silent_zones';

const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isReplit = hostname.includes('replit.dev') || hostname.includes('replit.app') || hostname.includes('repl.co');
    
    if (isReplit) {
      const parts = hostname.split('-');
      if (parts.length > 1) {
        const restOfHostname = parts.slice(1).join('-');
        return `https://3001-${restOfHostname}/api/zones`;
      }
    }
  }
  return 'http://localhost:3001/api/zones';
};

const API_BASE_URL = getBackendUrl();

export const getZones = async (): Promise<Zone[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ZONES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch zones.', e);
    return [];
  }
};

export const saveZone = async (zoneData: Omit<Zone, 'id' | 'isActive'> & { id?: string }): Promise<Zone | null> => {
  try {
    const zones = await getZones();
    if (zoneData.id) {
      // Update existing zone
      const index = zones.findIndex((z) => z.id === zoneData.id);
      if (index !== -1) {
        zones[index] = { ...zones[index], ...zoneData };
        await AsyncStorage.setItem(ZONES_KEY, JSON.stringify(zones));
        return zones[index];
      }
      return null;
    } else {
      // Create new zone
      const newZone: Zone = {
        ...zoneData,
        id: Date.now().toString(),
        isActive: true,
      };
      const updatedZones = [...zones, newZone];
      await AsyncStorage.setItem(ZONES_KEY, JSON.stringify(updatedZones));
      return newZone;
    }
  } catch (e) {
    console.error('Failed to save zone.', e);
    return null;
  }
};

export const deleteZone = async (id: string): Promise<void> => {
  try {
    const zones = await getZones();
    const updatedZones = zones.filter((zone) => zone.id !== id);
    await AsyncStorage.setItem(ZONES_KEY, JSON.stringify(updatedZones));
  } catch (e) {
    console.error('Failed to delete zone.', e);
  }
};

export const toggleZoneActive = async (id: string): Promise<Zone | null> => {
    try {
        const zones = await getZones();
        const index = zones.findIndex((z) => z.id === id);
        if (index !== -1) {
            zones[index].isActive = !zones[index].isActive;
            await AsyncStorage.setItem(ZONES_KEY, JSON.stringify(zones));
            return zones[index];
        }
        return null;
    } catch (e) {
        console.error('Failed to toggle zone.', e);
        return null;
    }
};

// API Helper functions
const fetchZonesFromAPI = async (): Promise<Zone[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch zones from API');
    return await response.json();
  } catch (e) {
    console.error('Failed to fetch zones from API.', e);
    return [];
  }
};

const uploadZoneToAPI = async (zone: Zone): Promise<Zone | null> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zone),
    });
    if (!response.ok) throw new Error('Failed to upload zone to API');
    return await response.json();
  } catch (e) {
    console.error('Failed to upload zone to API.', e);
    return null;
  }
};

const updateZoneInAPI = async (zone: Zone): Promise<Zone | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${zone.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zone),
    });
    if (!response.ok) throw new Error('Failed to update zone in API');
    return await response.json();
  } catch (e) {
    console.error('Failed to update zone in API.', e);
    return null;
  }
};

const deleteZoneFromAPI = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (e) {
    console.error('Failed to delete zone from API.', e);
    return false;
  }
};

// Sync functions
export const syncZonesToBackend = async (): Promise<void> => {
  try {
    const localZones = await getZones();
    // Clear remote zones and upload all local
    // First, delete all remote zones
    const remoteZones = await fetchZonesFromAPI();
    for (const remoteZone of remoteZones) {
      await deleteZoneFromAPI(remoteZone.id);
    }
    // Then upload all local zones
    for (const localZone of localZones) {
      await uploadZoneToAPI(localZone);
    }
  } catch (e) {
    console.error('Failed to sync zones to backend.', e);
  }
};

export const downloadZonesFromBackend = async (): Promise<void> => {
  try {
    const remoteZones = await fetchZonesFromAPI();
    // Replace local with remote
    await AsyncStorage.setItem(ZONES_KEY, JSON.stringify(remoteZones));
  } catch (e) {
    console.error('Failed to download zones from backend.', e);
  }
};

export const mergeZonesFromBackend = async (): Promise<void> => {
  try {
    const localZones = await getZones();
    const remoteZones = await fetchZonesFromAPI();
    const merged = new Map<string, Zone>();

    // Add local zones
    localZones.forEach(zone => merged.set(zone.id, zone));

    // Add or update with remote zones
    remoteZones.forEach(remote => {
      if (merged.has(remote.id)) {
        // Merge, prefer local for now
        merged.set(remote.id, { ...remote, ...merged.get(remote.id)! });
      } else {
        merged.set(remote.id, remote);
      }
    });

    const mergedZones = Array.from(merged.values());
    await AsyncStorage.setItem(ZONES_KEY, JSON.stringify(mergedZones));
  } catch (e) {
    console.error('Failed to merge zones from backend.', e);
  }
};
