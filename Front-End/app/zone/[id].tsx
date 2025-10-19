import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../components/ui/theme';

const { width } = Dimensions.get('window');

export default function ZoneDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isEnabled, setIsEnabled] = useState(true);
  const [mode, setMode] = useState<'silent' | 'vibrate'>('silent');

  // Mock zone data - in real app this would come from state/API
  const zone = {
    id: parseInt(id as string),
    name: 'Central Library',
    type: 'Library',
    radius: 50,
    latitude: 40.7128,
    longitude: -74.0060,
    mode: 'silent',
    activationDelay: 1,
    createdAt: '2024-01-15',
    isCustom: false,
    visitCount: 12,
    lastVisited: '2 hours ago'
  };

  // Mock history data
  const visitHistory = [
    { id: 1, timestamp: '2024-01-20 14:30', action: 'Entered zone', duration: null },
    { id: 2, timestamp: '2024-01-20 16:45', action: 'Exited zone', duration: '2h 15m' },
    { id: 3, timestamp: '2024-01-19 09:15', action: 'Entered zone', duration: null },
    { id: 4, timestamp: '2024-01-19 11:30', action: 'Exited zone', duration: '2h 15m' },
  ];

  const handleDelete = () => {
    Alert.alert(
      'Delete Zone',
      `Are you sure you want to delete "${zone.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Zone deleted successfully', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  };

  const handleTestEnter = () => {
    Alert.alert(
      'Test Zone Entry', 
      `This will simulate entering the "${zone.name}" zone and trigger ${zone.mode} mode for 10 seconds.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Test Zone', 
          onPress: () => {
            Alert.alert('Zone Test Started', `Your device is now in ${zone.mode} mode. It will return to normal after 10 seconds.`);
          }
        }
      ]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Share Zone Location', 
      `Share the location of "${zone.name}" with others. They can add this as a silent zone in their app.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => Alert.alert('Shared Successfully', 'Zone location has been shared!') }
      ]
    );
  };

  const getModeIcon = () => {
    return mode === 'silent' ? '🔇' : '📳';
  };

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.background]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
            <Text style={styles.headerIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Zone Header */}
        <View style={styles.zoneHeader}>
          <View style={styles.zoneTitleRow}>
            <Text style={styles.zoneIcon}>
              {zone.type === 'Library' ? '📚' : zone.type === 'Church' ? '⛪' : '🏥'}
            </Text>
            <View style={styles.zoneTitleContent}>
              <Text style={styles.zoneName}>{zone.name}</Text>
              <Text style={styles.zoneType}>{zone.type}</Text>
            </View>
          </View>

          {/* Status Badge */}
          <View style={styles.zoneStatusRow}>
            <View style={[styles.statusBadge, isEnabled ? styles.enabledBadge : styles.disabledBadge]}>
              <Text style={[styles.statusBadgeText, isEnabled ? styles.enabledBadgeText : styles.disabledBadgeText]}>
                {isEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <Text style={styles.modeText}>
              {getModeIcon()} {mode === 'silent' ? 'Silent' : 'Vibrate'} Mode
            </Text>
          </View>
        </View>

        {/* Map Preview */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPreview}>
            <Text style={styles.mapIcon}>🗺️</Text>
            <Text style={styles.mapTitle}>Zone Location</Text>
            <Text style={styles.mapRadius}>{zone.radius}m radius</Text>
          </View>
          {/* Mock zone circle */}
          <View style={styles.zoneCircle} />
        </View>

        {/* Zone Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zone Details</Text>

          <View style={styles.card}>
            <View style={[styles.detailRow, styles.borderBottom]}>
              <Text style={styles.detailLabel}>Radius</Text>
              <Text style={styles.detailValue}>{zone.radius} meters</Text>
            </View>

            <View style={[styles.detailRow, styles.borderBottom]}>
              <Text style={styles.detailLabel}>Activation Delay</Text>
              <Text style={styles.detailValue}>{zone.activationDelay} minute</Text>
            </View>

            <View style={[styles.detailRow, styles.borderBottom]}>
              <Text style={styles.detailLabel}>Mode</Text>
              <Text style={styles.detailValue}>{zone.mode}</Text>
            </View>

            <View style={[styles.detailRow, styles.borderBottom]}>
              <Text style={styles.detailLabel}>Created</Text>
              <Text style={styles.detailValue}>{zone.createdAt}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Coordinates</Text>
              <Text style={styles.detailValue}>
                {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🏃</Text>
              <Text style={styles.statValue}>{zone.visitCount}</Text>
              <Text style={styles.statLabel}>Visits</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🕒</Text>
              <Text style={styles.statValue}>{zone.lastVisited}</Text>
              <Text style={styles.statLabel}>Last Visit</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={handleTestEnter}
              style={[styles.actionButton, styles.testButton]}
            >
              <Text style={styles.actionButtonText}>Test Enter Zone</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push(`/add-zone?id=${zone.id}`)}
              style={[styles.actionButton, styles.editButton]}
            >
              <Text style={styles.actionButtonText}>Edit Zone</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={[styles.actionButton, styles.shareButton]}
            >
              <Text style={styles.actionButtonText}>Share Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Export Zone', `Export "${zone.name}" as a JSON file to share or backup.`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Export', onPress: () => Alert.alert('Success', 'Zone exported successfully to Downloads folder') }
              ])}
              style={[styles.actionButton, styles.exportButton]}
            >
              <Text style={styles.actionButtonText}>Export Zone</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Visit History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {visitHistory.map((visit, index) => (
            <View key={visit.id} style={[styles.historyCard, index < visitHistory.length - 1 && styles.borderBottom]}>
              <View style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyIcon}>
                    {visit.action.includes('Entered') ? '📍' : '➡️'}
                  </Text>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyAction}>{visit.action}</Text>
                    <Text style={styles.historyTimestamp}>{visit.timestamp}</Text>
                  </View>
                </View>

                {visit.duration && (
                  <Text style={styles.historyDuration}>{visit.duration}</Text>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  headerButtonText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  headerIcon: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.error,
  },
  zoneHeader: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  zoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  zoneIcon: {
    fontSize: theme.typography.sizes['4xl'],
    marginRight: theme.spacing.md,
  },
  zoneTitleContent: {
    flex: 1,
  },
  zoneName: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  zoneType: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  zoneStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  enabledBadge: {
    backgroundColor: theme.colors.success + '20',
  },
  disabledBadge: {
    backgroundColor: theme.colors.neutral.light,
  },
  statusBadgeText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: 'medium',
  },
  enabledBadgeText: {
    color: theme.colors.success,
  },
  disabledBadgeText: {
    color: theme.colors.text.secondary,
  },
  modeText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  mapContainer: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPreview: {
    backgroundColor: theme.colors.neutral.light,
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.xl,
  },
  mapIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.sm,
  },
  mapTitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  mapRadius: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  zoneCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 128,
    height: 128,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    borderRadius: 64,
    opacity: 0.6,
    transform: [{ translateX: -64 }, { translateY: -64 }],
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'semibold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'medium',
    color: theme.colors.text.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statIcon: {
    fontSize: theme.typography.sizes['2xl'],
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  actionsContainer: {
    gap: theme.spacing.sm,
  },
  actionButton: {
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: theme.colors.success,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
  },
  shareButton: {
    backgroundColor: theme.colors.neutral.dark,
  },
  exportButton: {
    backgroundColor: theme.colors.accent,
  },
  actionButtonText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'semibold',
    color: theme.colors.background,
  },
  historyCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    fontSize: theme.typography.sizes.lg,
    marginRight: theme.spacing.md,
  },
  historyContent: {
    flex: 1,
  },
  historyAction: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'medium',
    color: theme.colors.text.primary,
  },
  historyTimestamp: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  historyDuration: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  viewAllText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'medium',
    color: theme.colors.primary,
  },
});