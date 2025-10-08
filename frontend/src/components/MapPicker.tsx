import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, Platform } from 'react-native';
import { MapPin, Circle } from 'lucide-react-native';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import MapView, { Marker, Circle as MapCircle } from '@/components/MapView';

interface MapPickerProps {
  initialLatitude?: number;
  initialLongitude?: number;
  initialRadius?: number;
  onLocationChange: (latitude: number, longitude: number) => void;
  onRadiusChange: (radius: number) => void;
}

export default function MapPicker({
  initialLatitude = 37.78825,
  initialLongitude = -122.4324,
  initialRadius = 100,
  onLocationChange,
  onRadiusChange,
}: MapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
  });
  const [radius, setRadius] = useState(initialRadius);
  const [mapRegion, setMapRegion] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    // Center on current location if no initial
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Location permission not granted');
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setSelectedLocation({ latitude, longitude });
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        onLocationChange(latitude, longitude);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    if (Platform.OS !== 'web' && (!initialLatitude || !initialLongitude)) {
      getCurrentLocation();
    }
  }, []);

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
    onLocationChange(coordinate.latitude, coordinate.longitude);
  };

  const handleRadiusChange = (text: string) => {
    const newRadius = parseFloat(text);
    if (!isNaN(newRadius) && newRadius > 0) {
      setRadius(newRadius);
      onRadiusChange(newRadius);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' ? (
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
          onPress={handleMapPress}
          showsUserLocation
        >
          <Marker coordinate={selectedLocation} />
          <MapCircle
            center={selectedLocation}
            radius={radius}
            strokeColor={Colors.primary}
            fillColor="rgba(0, 123, 255, 0.1)"
          />
        </MapView>
      ) : (
        <View style={[styles.webContainerGradient, { backgroundColor: Colors.secondary }]}>
          <View style={styles.webContainer}>
            <Text style={styles.webLabel}>Select Location (Web Mode)</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color={Colors.light} style={styles.icon} />
              <TextInput
                style={styles.input}
                value={selectedLocation.latitude.toString()}
                onChangeText={(text) => {
                  const lat = parseFloat(text);
                  if (!isNaN(lat)) {
                    const newLoc = { ...selectedLocation, latitude: lat };
                    setSelectedLocation(newLoc);
                    onLocationChange(lat, newLoc.longitude);
                  }
                }}
                placeholder="Latitude (e.g., 37.7749)"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <MapPin size={20} color={Colors.light} style={styles.icon} />
              <TextInput
                style={styles.input}
                value={selectedLocation.longitude.toString()}
                onChangeText={(text) => {
                  const lng = parseFloat(text);
                  if (!isNaN(lng)) {
                    const newLoc = { ...selectedLocation, longitude: lng };
                    setSelectedLocation(newLoc);
                    onLocationChange(newLoc.latitude, lng);
                  }
                }}
                placeholder="Longitude (e.g., -122.4194)"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      )}
      <View style={[styles.controlsGradient, { backgroundColor: Colors.primary }]}>
        <View style={styles.controls}>
          <Text style={styles.label}>Zone Radius (meters)</Text>
          <View style={styles.inputContainer}>
            <Circle size={20} color={Colors.light} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={radius.toString()}
              onChangeText={handleRadiusChange}
              keyboardType="numeric"
              placeholder="Enter radius (e.g., 100)"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controlsGradient: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 5, // for Android shadow
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  controls: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
    color: Colors.light,
    flexShrink: 1,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light,
    paddingVertical: 0, // to align with icon
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.light,
  },
  webContainerGradient: {
    borderRadius: 12,
    margin: 16,
    elevation: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  webContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light,
    marginBottom: 16,
    textAlign: 'center',
  },
});