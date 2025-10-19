import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../components/ui/theme';


export default function ZonesScreen() {
  const [filter, setFilter] = useState<'all' | 'custom' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [enabledOnly, setEnabledOnly] = useState(false);

  // Mock zones data
  const zones = [
    { id: 1, name: 'Central Library', type: 'Library', radius: 50, enabled: true, isCustom: false, distance: '12m' },
    { id: 2, name: 'St. Mary Church', type: 'Church', radius: 30, enabled: true, isCustom: false, distance: '45m' },
    { id: 3, name: 'City Hospital', type: 'Hospital', radius: 75, enabled: false, isCustom: false, distance: '120m' },
    { id: 4, name: 'Home Office', type: 'Custom', radius: 25, enabled: true, isCustom: true, distance: '0m' },
    { id: 5, name: 'Gym', type: 'Custom', radius: 40, enabled: true, isCustom: true, distance: '2km' },
  ];

  const filteredZones = zones.filter(zone => {
    const matchesFilter = filter === 'all' ||
      (filter === 'custom' && zone.isCustom) ||
      (filter === 'system' && !zone.isCustom);

    const matchesSearch = zone.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEnabled = !enabledOnly || zone.enabled;

    return matchesFilter && matchesSearch && matchesEnabled;
  }).sort((a, b) => {
    // Sort by distance (simplified)
    const aDistance = a.distance.includes('km') ? parseFloat(a.distance) * 1000 : parseFloat(a.distance);
    const bDistance = b.distance.includes('km') ? parseFloat(b.distance) * 1000 : parseFloat(b.distance);
    return aDistance - bDistance;
  });

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'Library': return '📚';
      case 'Church': return '⛪';
      case 'Hospital': return '🏥';
      default: return '📍';
    }
  };

  const handleDeleteZone = (zoneId: number, zoneName: string) => {
    Alert.alert(
      'Delete Zone',
      `Are you sure you want to delete "${zoneName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In real app, delete from state/storage
            Alert.alert('Success', 'Zone deleted successfully');
          }
        }
      ]
    );
  };

  const handleBulkAction = (action: 'enable' | 'disable' | 'export' | 'import') => {
    switch (action) {
      case 'enable':
        Alert.alert('Enable All Zones', 'This will enable all zones. Continue?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable All', onPress: () => Alert.alert('Success', 'All zones have been enabled') }
        ]);
        break;
      case 'disable':
        Alert.alert('Disable All Zones', 'This will disable all zones. Continue?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Disable All', style: 'destructive', onPress: () => Alert.alert('Success', 'All zones have been disabled') }
        ]);
        break;
      case 'export':
        Alert.alert('Export Zones', 'Your zones will be exported as a JSON file to your Downloads folder.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Export', onPress: () => Alert.alert('Success', 'Zones exported successfully to Downloads folder') }
        ]);
        break;
      case 'import':
        Alert.alert('Import Zones', 'Select a JSON file to import your zones.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Import', onPress: () => Alert.alert('Success', 'Zones imported successfully') }
        ]);
        break;
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.background]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.headerButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Zones</Text>
          <TouchableOpacity
            onPress={() => router.push('/map')}
            style={styles.headerButton}
            accessibilityLabel="Open map view"
            accessibilityRole="button"
          >
            <Text style={styles.headerIcon}>🗺️</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search zones..."
              style={styles.searchInput}
              placeholderTextColor={theme.colors.text.secondary}
              accessibilityLabel="Search zones"
              accessibilityHint="Type to filter zones by name"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
                accessibilityLabel="Clear search"
                accessibilityRole="button"
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            {[
              { key: 'all', label: 'All Zones' },
              { key: 'custom', label: 'Custom' },
              { key: 'system', label: 'System' }
            ].map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                onPress={() => setFilter(key as any)}
                style={[styles.tab, filter === key && styles.activeTab]}
                accessibilityLabel={`Filter by ${label.toLowerCase()}`}
                accessibilityRole="button"
                accessibilityState={{ selected: filter === key }}
              >
                <Text style={[styles.tabText, filter === key && styles.activeTabText]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Enabled Only Toggle */}
          <TouchableOpacity
            onPress={() => setEnabledOnly(!enabledOnly)}
            style={styles.enabledToggle}
            accessibilityLabel={`${enabledOnly ? 'Show all zones' : 'Show enabled zones only'}`}
            accessibilityRole="button"
            accessibilityState={{ checked: enabledOnly }}
          >
            <Text style={styles.enabledToggleText}>Show enabled only</Text>
            <View style={[styles.toggleSwitch, enabledOnly && styles.toggleSwitchActive]}>
              <View style={[styles.toggleKnob, enabledOnly && styles.toggleKnobActive]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Bulk Actions */}
        <View style={styles.bulkActionsContainer}>
          <Text style={styles.bulkActionsTitle}>Bulk Actions</Text>
          <View style={styles.bulkActionsRow}>
            <TouchableOpacity
              onPress={() => handleBulkAction('enable')}
              style={styles.bulkActionButton}
              accessibilityLabel="Enable all zones"
              accessibilityRole="button"
            >
              <Text style={styles.bulkActionButtonText}>Enable All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleBulkAction('disable')}
              style={[styles.bulkActionButton, { backgroundColor: theme.colors.error }]}
              accessibilityLabel="Disable all zones"
              accessibilityRole="button"
            >
              <Text style={styles.bulkActionButtonText}>Disable All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bulkActionsRow}>
            <TouchableOpacity
              onPress={() => handleBulkAction('export')}
              style={[styles.bulkActionButton, { backgroundColor: theme.colors.accent }]}
              accessibilityLabel="Export zones"
              accessibilityRole="button"
            >
              <Text style={styles.bulkActionButtonText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleBulkAction('import')}
              style={[styles.bulkActionButton, { backgroundColor: theme.colors.neutral.dark }]}
              accessibilityLabel="Import zones"
              accessibilityRole="button"
            >
              <Text style={styles.bulkActionButtonText}>Import</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Zones List */}
        <View style={styles.zonesList}>
          <Text style={styles.zonesListTitle}>
            Zones ({filteredZones.length})
          </Text>

          {filteredZones.map((zone) => (
            <View key={zone.id} style={styles.zoneCard}>
              <View style={styles.zoneCardContent}>
                <TouchableOpacity
                  style={styles.zoneTouchable}
                  onPress={() => router.push(`/zone/${zone.id}`)}
                  accessibilityLabel={`Open zone details for ${zone.name}`}
                  accessibilityRole="button"
                >
                  <View style={styles.zoneIconContainer}>
                    <Text style={styles.zoneIcon}>{getZoneIcon(zone.type)}</Text>
                  </View>

                  <View style={styles.zoneInfo}>
                    <Text style={styles.zoneName}>{zone.name}</Text>
                    <Text style={styles.zoneDetails}>
                      {zone.type} • {zone.distance} • {zone.radius}m radius
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.zoneActions}>
                  <TouchableOpacity
                    onPress={() => {
                      // Toggle enabled state
                      Alert.alert('Success', `Zone ${zone.enabled ? 'disabled' : 'enabled'}`);
                    }}
                    style={[styles.toggleSwitch, zone.enabled && styles.toggleSwitchActive]}
                    accessibilityLabel={`Toggle zone ${zone.name}`}
                    accessibilityRole="switch"
                    accessibilityState={{ checked: zone.enabled }}
                  >
                    <View style={[styles.toggleKnob, zone.enabled && styles.toggleKnobActive]} />
                  </TouchableOpacity>

                  {zone.isCustom && (
                    <TouchableOpacity
                      onPress={() => handleDeleteZone(zone.id, zone.name)}
                      style={styles.deleteButton}
                      accessibilityLabel={`Delete zone ${zone.name}`}
                      accessibilityRole="button"
                    >
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}

          {filteredZones.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>📍</Text>
              </View>
              <Text style={styles.emptyTitle}>No zones found</Text>
              <Text style={styles.emptyDescription}>
                {searchQuery ? 'Try adjusting your search or filters' : 'Add your first silent zone'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Zone FAB */}
      <TouchableOpacity
        onPress={() => router.push('/add-zone')}
        style={styles.fab}
        accessibilityLabel="Add new zone"
        accessibilityRole="button"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
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
  headerButton: {
    padding: theme.spacing.sm,
  },
  headerButtonText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  headerIcon: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.primary,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  searchBar: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  clearIcon: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
  },
  tabsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  tabsRow: {
    backgroundColor: theme.colors.neutral.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  activeTabText: {
    color: theme.colors.text.primary,
  },
  enabledToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  enabledToggleText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  toggleSwitch: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.neutral.light,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: theme.colors.success,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleKnobActive: {
    transform: [{ translateX: 24 }],
  },
  bulkActionsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  bulkActionsTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'semibold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  bulkActionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  bulkActionButton: {
    flex: 1,
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  bulkActionButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.background,
  },
  zonesList: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing['2xl'] + theme.spacing.xl,
  },
  zonesListTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'semibold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  zoneCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  zoneCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  zoneTouchable: {
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
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'semibold',
    color: theme.colors.text.primary,
  },
  zoneDetails: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    fontWeight: 'medium',
  },
  zoneActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  deleteIcon: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.error,
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
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
    fontWeight: 'medium',
  },
  emptyDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
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
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: 'bold',
  },
});