import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, Platform, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Plus, MapPin, Bell, Settings, Activity, Clock, Target } from 'lucide-react-native';
import { requestPermissions } from '@/services/permissionService';
import { getZones } from '@/services/zoneService';
import { Zone } from '@/types';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import MapView, { Marker, Circle } from '../components/MapView';

type RootStackParamList = {
  ManageZone: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ManageZone'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [zones, setZones] = useState<Zone[]>([]);

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
  const inactiveZones = zones.filter(zone => !zone.isActive);

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIcon}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const ZoneCard = ({ zone, onPress }: any) => (
    <TouchableOpacity style={styles.zoneCard} onPress={onPress}>
      <View style={styles.zoneHeader}>
        <MapPin size={20} color={Colors.primary} />
        <Text style={styles.zoneName}>{zone.name}</Text>
        {zone.isActive && <View style={styles.activeBadge}><Text style={styles.activeText}>Active</Text></View>}
      </View>
      <Text style={styles.zoneDetails}>
        Radius: {zone.radius}m • Lat: {zone.latitude.toFixed(4)}, Lng: {zone.longitude.toFixed(4)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeText}>Hello, {user?.name || 'User'}!</Text>
            <Text style={styles.welcomeSubtitle}>Manage your silent zones</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings' as any)}
          >
            <Settings size={24} color={Colors.dark} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <StatCard
            icon={Target}
            title="Active Zones"
            value={activeZones.length}
            subtitle="Currently monitoring"
            color={Colors.primary}
          />
          <StatCard
            icon={Bell}
            title="Total Zones"
            value={zones.length}
            subtitle="Created zones"
            color={Colors.secondary}
          />
          <StatCard
            icon={Activity}
            title="Status"
            value={Platform.OS === 'web' ? 'Web' : 'Mobile'}
            subtitle={Platform.OS === 'web' ? 'Limited features' : 'Full features'}
            color={Colors.gray}
          />
        </View>

        {/* Map Section */}
        {Platform.OS !== 'web' && activeZones.length > 0 && (
          <View style={styles.mapSection}>
            <Text style={styles.sectionTitle}>Active Zones Map</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: activeZones[0]?.latitude || 37.78825,
                longitude: activeZones[0]?.longitude || -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation
            >
              {activeZones.map((zone) => (
                <React.Fragment key={zone.id}>
                  <Marker
                    coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
                    title={zone.name}
                    description={`Radius: ${zone.radius}m`}
                  />
                  <Circle
                    center={{ latitude: zone.latitude, longitude: zone.longitude }}
                    radius={zone.radius}
                    strokeColor={Colors.primary}
                    fillColor="rgba(255, 140, 0, 0.2)"
                  />
                </React.Fragment>
              ))}
            </MapView>
          </View>
        )}

        {/* Recent Zones */}
        <View style={styles.zonesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Zones</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ZoneList' as any)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {zones.length === 0 ? (
            <View style={styles.emptyState}>
              <MapPin size={48} color={Colors.gray} />
              <Text style={styles.emptyTitle}>No zones yet</Text>
              <Text style={styles.emptySubtitle}>Create your first silent zone to get started</Text>
            </View>
          ) : (
            <View style={styles.zonesList}>
              {zones.slice(0, 3).map((zone) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  onPress={() => navigation.navigate('ManageZone', { zoneId: zone.id } as any)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ManageZone')}
            >
              <Plus size={32} color={Colors.light} />
              <Text style={styles.actionText}>Add Zone</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ZoneList' as any)}
            >
              <MapPin size={32} color={Colors.light} />
              <Text style={styles.actionText}>View Zones</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mobile Features Info */}
        {Platform.OS !== 'web' && (
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Mobile Features</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Clock size={20} color={Colors.primary} />
                <Text style={styles.featureText}>Automatic GPS monitoring</Text>
              </View>
              <View style={styles.featureItem}>
                <Bell size={20} color={Colors.primary} />
                <Text style={styles.featureText}>Silent mode activation</Text>
              </View>
              <View style={styles.featureItem}>
                <Activity size={20} color={Colors.primary} />
                <Text style={styles.featureText}>Background location tracking</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.card,
    margin: 16,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.gray,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  statTitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 2,
  },
  mapSection: {
    margin: 16,
    marginBottom: 24,
  },
  map: {
    height: 200,
    borderRadius: 12,
  },
  zonesSection: {
    margin: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  viewAllText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.card,
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
  zonesList: {
    gap: 12,
  },
  zoneCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
    flex: 1,
  },
  activeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.light,
  },
  zoneDetails: {
    fontSize: 14,
    color: Colors.gray,
  },
  actionsSection: {
    margin: 16,
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light,
    marginTop: 8,
  },
  featuresSection: {
    margin: 16,
    marginBottom: 40,
  },
  featuresList: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: Colors.dark,
    flex: 1,
  },
});
