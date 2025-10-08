import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, Platform, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Plus, MapPin } from 'lucide-react-native';
import { requestPermissions } from '@/services/permissionService';
import { getZones } from '@/services/zoneService';
import { Zone } from '@/types';
import { Colors } from '@/constants/Colors';

type RootStackParamList = {
  ManageZone: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ManageZone'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [zones, setZones] = useState<Zone[]>([]);
  const [mapComponents, setMapComponents] = useState<{MapView?: any, Marker?: any, Circle?: any} | null>(null);


  useEffect(() => {
    const checkPermissions = async () => {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permissions Required',
          'This app needs location and notification permissions to function correctly. Please enable them in your settings.',
          [{ text: 'OK' }]
        );
      }
    };
    if (Platform.OS !== 'web') {
      checkPermissions();
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      try {
        const maps = require('react-native-maps');
        setMapComponents(maps);
      } catch (error) {
        console.warn('Failed to load map components:', error);
      }
    }
  }, []);

  const loadZones = useCallback(async () => {
    const storedZones = await getZones();
    setZones(storedZones);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadZones();
    }, [loadZones])
  );

  const activeZones = zones.filter(zone => zone.isActive);

  if (!mapComponents && Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {mapComponents ? (
        <mapComponents.MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
        >
          {activeZones.map((zone) => (
            <React.Fragment key={zone.id}>
              <mapComponents.Marker
                coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
                title={zone.name}
                description={`Radius: ${zone.radius}m`}
              />
              <mapComponents.Circle
                center={{ latitude: zone.latitude, longitude: zone.longitude }}
                radius={zone.radius}
                strokeColor={Colors.primary}
                fillColor="rgba(0, 123, 255, 0.1)"
              />
            </React.Fragment>
          ))}
        </mapComponents.MapView>
      ) : (
        <View style={styles.webContainer}>
          <Text style={styles.webMessage}>Map is not available on web. Please use the app on mobile devices to view and manage zones.</Text>
        </View>
      )}
      <SafeAreaView style={styles.overlay}>
        <View style={[styles.header, { backgroundColor: Colors.primary }]}>
          <View style={styles.headerContent}>
            <MapPin size={32} color={Colors.light} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Silent Zones</Text>
              <Text style={styles.zoneCount}>
                {activeZones.length} active zone{activeZones.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('ManageZone')}
        >
          <View style={[styles.buttonGradient, { backgroundColor: Colors.secondary }]}>
            <Plus size={24} color={Colors.light} />
            <Text style={styles.buttonText}>Add New Zone</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light,
  },
  zoneCount: {
    fontSize: 16,
    color: Colors.lightGray,
    marginTop: 4,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light,
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: Colors.dark,
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
  },
  webMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.dark,
    padding: 20,
  },
});
