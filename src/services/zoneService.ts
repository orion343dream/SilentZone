import AsyncStorage from '@react-native-async-storage/async-storage';
import { Zone } from '@/types';

const ZONES_KEY = 'silent_zones';

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
