import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../components/ui/theme';

export default function HistoryScreen() {
  const [filter, setFilter] = useState<'all' | 'silenced' | 'restored' | 'manual'>('all');

  // Mock history data
  const historyEvents = [
    {
      id: 1,
      timestamp: '2024-01-20 14:30:25',
      action: 'Entered zone',
      zoneName: 'Central Library',
      zoneType: 'Library',
      mode: 'silent',
      duration: null,
      type: 'silenced'
    },
    {
      id: 2,
      timestamp: '2024-01-20 16:45:12',
      action: 'Exited zone',
      zoneName: 'Central Library',
      zoneType: 'Library',
      mode: 'restored',
      duration: '2h 15m',
      type: 'restored'
    },
    {
      id: 3,
      timestamp: '2024-01-20 12:15:33',
      action: 'Manual mode change',
      zoneName: null,
      zoneType: null,
      mode: 'vibrate',
      duration: null,
      type: 'manual'
    },
    {
      id: 4,
      timestamp: '2024-01-19 09:15:45',
      action: 'Entered zone',
      zoneName: 'St. Mary Church',
      zoneType: 'Church',
      mode: 'silent',
      duration: null,
      type: 'silenced'
    },
    {
      id: 5,
      timestamp: '2024-01-19 11:30:22',
      action: 'Exited zone',
      zoneName: 'St. Mary Church',
      zoneType: 'Church',
      mode: 'restored',
      duration: '2h 15m',
      type: 'restored'
    }
  ];

  const filteredEvents = historyEvents.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const getActionIcon = (action: string, type: string) => {
    if (action.includes('Entered')) return '📍';
    if (action.includes('Exited')) return '➡️';
    if (action.includes('Manual')) return '👤';
    return '🔄';
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'silenced': return theme.colors.error;
      case 'restored': return theme.colors.success;
      case 'manual': return theme.colors.primary;
      default: return theme.colors.text.secondary;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      return `${Math.floor(diffMs / (1000 * 60))}m ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else {
      return `${Math.floor(diffDays)}d ago`;
    }
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear Activity History',
      'This will permanently delete all your zone activity history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All History',
          style: 'destructive',
          onPress: () => {
            Alert.alert('History Cleared', 'All activity history has been permanently deleted.');
          }
        }
      ]
    );
  };

  const navigateBack = () => {
    router.back();
  };

  const navigateToZone = (zoneId: number) => {
    router.push(`/zone/${zoneId}`);
  };

  const exportHistory = () => {
    Alert.alert(
      'Export Activity History', 
      'Your activity history will be exported as a CSV file to your Downloads folder.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Alert.alert('Success', 'Activity history exported successfully to Downloads folder') }
      ]
    );
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
            onPress={navigateBack}
            style={styles.headerButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.headerButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity History</Text>
          <TouchableOpacity
            onPress={clearHistory}
            style={styles.headerButton}
            accessibilityLabel="Clear history"
            accessibilityRole="button"
          >
            <Text style={styles.clearIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            {[
              { key: 'all', label: 'All' },
              { key: 'silenced', label: 'Silenced' },
              { key: 'restored', label: 'Restored' },
              { key: 'manual', label: 'Manual' }
            ].map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                onPress={() => setFilter(key as any)}
                style={[styles.filterChip, filter === key && styles.activeFilterChip]}
                accessibilityLabel={`Filter by ${label.toLowerCase()}`}
                accessibilityRole="button"
                accessibilityState={{ selected: filter === key }}
              >
                <Text style={[styles.filterChipText, filter === key && styles.activeFilterChipText]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Export Button */}
        <View style={styles.exportContainer}>
          <TouchableOpacity
            onPress={exportHistory}
            style={styles.exportButton}
            accessibilityLabel="Export history"
            accessibilityRole="button"
          >
            <Text style={styles.exportButtonText}>Export History</Text>
          </TouchableOpacity>
        </View>

        {/* History List */}
        <View style={styles.historyList}>
          <Text style={styles.historyTitle}>
            Recent Activity ({filteredEvents.length})
          </Text>

          {filteredEvents.map((event) => (
            <View key={event.id} style={styles.historyCard}>
              <View style={styles.historyCardContent}>
                <Text style={styles.actionIcon}>{getActionIcon(event.action, event.type)}</Text>

                <View style={styles.historyInfo}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyAction}>
                      {event.action}
                      {event.zoneName && (
                        <Text style={styles.historyZoneName}> • {event.zoneName}</Text>
                      )}
                    </Text>
                    <Text style={styles.historyTimestamp}>
                      {formatTimestamp(event.timestamp)}
                    </Text>
                  </View>

                  <View style={styles.historyDetails}>
                    <View style={styles.historyMeta}>
                      {event.mode && (
                        <Text style={[styles.historyMode, { color: getActionColor(event.type) }]}>
                          {event.mode === 'silent' ? '🔇 Silent' :
                           event.mode === 'vibrate' ? '📳 Vibrate' :
                           event.mode === 'restored' ? '🔊 Restored' : event.mode}
                        </Text>
                      )}
                      {event.zoneType && (
                        <Text style={styles.historyZoneType}>
                          {event.zoneType}
                        </Text>
                      )}
                    </View>

                    {event.duration && (
                      <Text style={styles.historyDuration}>
                        {event.duration}
                      </Text>
                    )}
                  </View>

                  <Text style={styles.historyFullTimestamp}>
                    {new Date(event.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Quick Actions */}
              {event.zoneName && (
                <View style={styles.quickActions}>
                  <TouchableOpacity
                    onPress={() => navigateToZone(event.id)}
                    style={styles.viewZoneButton}
                    accessibilityLabel={`View zone ${event.zoneName}`}
                    accessibilityRole="button"
                  >
                    <Text style={styles.viewZoneText}>View Zone</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          {filteredEvents.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No activity found</Text>
              <Text style={styles.emptyDescription}>
                {filter === 'all' ? 'Start using SilentZone to see your activity here' :
                 `No ${filter} events found. Try adjusting your filter.`}
              </Text>
            </View>
          )}
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
  clearIcon: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.error,
  },
  filterContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  filterRow: {
    backgroundColor: theme.colors.neutral.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    flexDirection: 'row',
  },
  filterChip: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  activeFilterChip: {
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterChipText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  activeFilterChipText: {
    color: theme.colors.text.primary,
  },
  exportContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  exportButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    color: theme.colors.background,
  },
  historyList: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing['2xl'] + theme.spacing.xl,
  },
  historyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'semibold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  historyCard: {
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
  historyCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
  },
  actionIcon: {
    fontSize: theme.typography.sizes['2xl'],
    marginRight: theme.spacing.md,
  },
  historyInfo: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  historyAction: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '500',
    color: theme.colors.text.primary,
    flex: 1,
  },
  historyZoneName: {
    color: theme.colors.text.secondary,
  },
  historyTimestamp: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    marginLeft: theme.spacing.sm,
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyMode: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
    marginRight: theme.spacing.sm,
  },
  historyZoneType: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  historyDuration: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    backgroundColor: theme.colors.neutral.light,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  historyFullTimestamp: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  viewZoneButton: {
    backgroundColor: theme.colors.neutral.light,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  viewZoneText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'] + theme.spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
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
});