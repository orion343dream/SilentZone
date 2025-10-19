import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NavigationDrawer from '../components/ui/NavigationDrawer';
import { theme } from '../components/ui/theme';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentMode, setCurrentMode] = useState<'normal' | 'silent' | 'vibrate'>('normal');
  const [autoSilentEnabled, setAutoSilentEnabled] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Mock zones data - in real app this would come from state management
  const nearbyZones = [
    { id: 1, name: 'Central Library', distance: '12m', type: 'Library', radius: 50 },
    { id: 2, name: 'St. Mary Church', distance: '45m', type: 'Church', radius: 30 },
    { id: 3, name: 'City Hospital', distance: '120m', type: 'Hospital', radius: 75 },
  ];

  const toggleAutoSilent = () => {
    setAutoSilentEnabled(!autoSilentEnabled);
    Alert.alert(
      'Auto-Silent ' + (autoSilentEnabled ? 'Paused' : 'Resumed'),
      autoSilentEnabled 
        ? 'Automatic silencing has been paused. You can resume it anytime.'
        : 'Automatic silencing is now active. Your device will be silenced when entering zones.'
    );
  };

  const getModeIcon = () => {
    switch (currentMode) {
      case 'silent': return '🔇';
      case 'vibrate': return '📳';
      default: return '🔔';
    }
  };

  const getModeColor = () => {
    switch (currentMode) {
      case 'silent': return theme.colors.error;
      case 'vibrate': return theme.colors.warning;
      default: return theme.colors.success;
    }
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.background]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          {/* Home Header */}
          <View style={styles.homeHeader}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleDrawer}
              accessibilityLabel="Open navigation menu"
              accessibilityRole="button"
            >
              <Text style={styles.headerIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>SilentZone</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => router.push('/history')}
                style={styles.headerButton}
                accessibilityLabel="View notifications"
                accessibilityRole="button"
              >
                <Text style={styles.headerIcon}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/settings')}
                style={styles.headerButton}
                accessibilityLabel="Open settings"
                accessibilityRole="button"
              >
                <Text style={styles.headerIcon}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>

        {/* Map Preview */}
        <View style={styles.mapContainer}>
          <TouchableOpacity
            onPress={() => router.push('/map')}
            style={styles.mapPreview}
          >
            <Text style={styles.mapText}>🗺️</Text>
            <Text style={styles.tapToOpenText}>Tap to open map</Text>
            {/* Mock location dot */}
            <View style={styles.locationDot} />
            {/* Mock zone circles */}
            <View style={styles.zoneCircle1} />
            <View style={styles.zoneCircle2} />
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.modeIconContainer}>
                <Text style={styles.modeIcon}>{getModeIcon()}</Text>
              </View>
              <View>
                <Text style={[styles.modeText, { color: getModeColor() }]}>
                  {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Mode
                </Text>
                <Text style={styles.lastChangedText}>Last changed 2 min ago</Text>
              </View>
            </View>
          </View>

          <View style={styles.autoSilentRow}>
            <Text style={styles.autoSilentText}>Auto-Silent</Text>
            <TouchableOpacity
              onPress={toggleAutoSilent}
              style={[
                styles.pauseButton,
                { backgroundColor: autoSilentEnabled ? theme.colors.primary : theme.colors.neutral.light }
              ]}
            >
              <Text style={[
                styles.pauseButtonText,
                { color: autoSilentEnabled ? theme.colors.background : theme.colors.text.secondary }
              ]}>
                {autoSilentEnabled ? 'Pause Auto-Silent' : 'Resume Auto-Silent'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Zones List */}
        <View style={styles.zonesList}>
          <Text style={styles.nearbyText}>Nearby Zones</Text>

          {nearbyZones.map((zone) => (
            <TouchableOpacity
              key={zone.id}
              onPress={() => router.push(`/zone/${zone.id}`)}
              style={styles.zoneCard}
            >
              <View style={styles.zoneLeft}>
                <View style={styles.zoneIconContainer}>
                  <Text style={styles.zoneIcon}>
                    {zone.type === 'Library' ? '📚' : zone.type === 'Church' ? '⛪' : '🏥'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.zoneName}>{zone.name}</Text>
                  <Text style={styles.zoneDetails}>{zone.distance} • {zone.radius}m radius</Text>
                </View>
              </View>
              <View style={styles.zoneActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push(`/zone/${zone.id}`)}
                  accessibilityLabel={`Navigate to ${zone.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.actionIcon}>🧭</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push(`/zone/${zone.id}`)}
                  accessibilityLabel={`View details for ${zone.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.actionIcon}>ℹ️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {nearbyZones.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>📍</Text>
              </View>
              <Text style={styles.emptyTitle}>No zones nearby</Text>
              <Text style={styles.emptyDescription}>
                Add your first silent zone to get started with automatic silencing
              </Text>
            </View>
          )}
        </View>

        {/* FAB */}
        <TouchableOpacity
          onPress={() => router.push('/add-zone')}
          style={styles.fab}
          accessibilityLabel="Add new silent zone"
          accessibilityRole="button"
          accessibilityHint="Tap to create a new silent zone"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>

    {/* Navigation Drawer */}
    <NavigationDrawer
      visible={drawerVisible}
      onClose={() => setDrawerVisible(false)}
    />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  homeHeader: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  headerIcon: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text.secondary,
  },
  headerTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'bold',
  },
  mapContainer: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  mapPreview: {
    backgroundColor: theme.colors.neutral.light,
    height: height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
    position: 'relative',
  },
  mapText: {
    fontSize: 60,
    marginBottom: theme.spacing.sm,
  },
  tapToOpenText: {
    color: theme.colors.text.secondary,
    fontWeight: '500',
    fontSize: theme.typography.sizes.base,
  },
  locationDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 16,
    height: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ translateX: -8 }, { translateY: -8 }],
  },
  zoneCircle1: {
    position: 'absolute',
    top: '33%',
    left: '33%',
    width: 64,
    height: 64,
    borderWidth: 4,
    borderColor: theme.colors.accent,
    borderRadius: 32,
    opacity: 0.6,
  },
  zoneCircle2: {
    position: 'absolute',
    bottom: '33%',
    right: '33%',
    width: 48,
    height: 48,
    borderWidth: 4,
    borderColor: theme.colors.error,
    borderRadius: 24,
    opacity: 0.6,
  },
  statusCard: {
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modeIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.neutral.light,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  modeIcon: {
    fontSize: theme.typography.sizes.xl,
  },
  modeText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  lastChangedText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
  },
  autoSilentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  autoSilentText: {
    color: theme.colors.text.secondary,
    fontWeight: '500',
    fontSize: theme.typography.sizes.base,
  },
  pauseButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
  },
  pauseButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.background,
  },
  zonesList: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing['2xl'] + theme.spacing.xl,
  },
  nearbyText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'semibold',
    marginBottom: theme.spacing.md,
  },
  zoneCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  zoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  zoneIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  zoneIcon: {
    fontSize: theme.typography.sizes.xl,
  },
  zoneName: {
    color: theme.colors.text.primary,
    fontWeight: 'semibold',
    fontSize: theme.typography.sizes.base,
  },
  zoneDetails: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.sizes.sm,
    fontWeight: 'medium',
  },
  zoneActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionButton: {
    padding: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral.light,
  },
  actionIcon: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.sizes.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'] + theme.spacing.lg,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.neutral.light,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyIconText: {
    fontSize: 64,
  },
  emptyTitle: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
    fontSize: theme.typography.sizes.base,
    fontWeight: 'medium',
  },
  emptyDescription: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.sizes.sm,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 64,
    height: 64,
    backgroundColor: theme.colors.primary,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: theme.colors.background,
  },
  fabText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.xl,
    fontWeight: 'bold',
  },
});
