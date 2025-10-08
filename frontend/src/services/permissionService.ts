import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

export async function requestPermissions(): Promise<boolean> {
  try {
    // Notification Permissions
    const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
    if (notificationStatus !== 'granted') {
      Alert.alert('Notification permission not granted');
      return false;
    }

    // Foreground Location Permissions
    let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      Alert.alert('Foreground location permission not granted');
      return false;
    }

    // Background Location Permissions
    if (Platform.OS === 'android') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            Alert.alert('Background location permission not granted');
            return false;
        }
    } else {
        // For iOS, background permission is requested with the same dialog
        // if the correct keys are in info.plist
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            Alert.alert('Background location permission not granted');
            return false;
        }
    }


    return true;
  } catch (error) {
    console.error("Error requesting permissions:", error);
    Alert.alert("Error", "An error occurred while requesting permissions.");
    return false;
  }
}
