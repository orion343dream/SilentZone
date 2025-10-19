import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../components/ui/theme';

const { width } = Dimensions.get('window');

// Create styles outside component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  headerButtonText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  headerTitle: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'medium',
    color: theme.colors.text.primary,
  },
  settingDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  selector: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.neutral.light,
    borderRadius: theme.borderRadius.md,
  },
  selectorText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  radiusControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  radiusButton: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.neutral.light,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  radiusButtonText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  radiusValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'medium',
    color: theme.colors.text.primary,
    minWidth: 40,
    textAlign: 'center',
  },
  permissionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  permissionIcon: {
    fontSize: theme.typography.sizes.xl,
    marginRight: theme.spacing.md,
  },
  permissionContent: {
    flex: 1,
  },
  permissionStatus: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: 'medium',
    textTransform: 'capitalize' as const,
  },
  fixButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  fixButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.background,
    fontWeight: 'medium',
  },
  aboutContent: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'medium',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  aboutSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.md,
  },
  aboutFooter: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing['2xl'],
    margin: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  modalSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
  },
  modalPrimaryButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  modalPrimaryText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    color: theme.colors.background,
  },
  modalSecondaryButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  modalSecondaryText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
});

export default function SettingsScreen() {
  const [autoSilentEnabled, setAutoSilentEnabled] = useState(true);
  const [defaultMode, setDefaultMode] = useState<'silent' | 'vibrate'>('silent');
  const [detectionInterval, setDetectionInterval] = useState<'30s' | '1m' | '2m'>('1m');
  const [defaultRadius, setDefaultRadius] = useState(20);
  const [activationDuration, setActivationDuration] = useState<'1' | '2' | '3'>('2');
  const [batterySaver, setBatterySaver] = useState(false);
  const [restoreBehavior, setRestoreBehavior] = useState<'previous' | 'default'>('previous');

  const permissionStatus = {
    location: 'granted',
    backgroundLocation: 'denied',
    dnd: 'granted',
    notifications: 'granted'
  };

  const getPermissionColor = (status: string) => {
    switch (status) {
      case 'granted': return theme.colors.success;
      case 'denied': return theme.colors.error;
      default: return theme.colors.warning;
    }
  };

  const getPermissionIcon = (status: string) => {
    switch (status) {
      case 'granted': return '✅';
      case 'denied': return '❌';
      default: return '⚠️';
    }
  };

  const handleFixPermission = (permission: string) => {
    const permissionNames = {
      location: 'Location Access',
      backgroundLocation: 'Background Location',
      dnd: 'Do Not Disturb',
      notifications: 'Notifications'
    };
    
    Alert.alert(
      'Permission Required',
      `To enable ${permissionNames[permission as keyof typeof permissionNames]}, you'll need to open your device settings and grant the permission.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => {
          Alert.alert('Settings Opened', 'Please enable the required permission and return to the app.');
        }}
      ]
    );
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setAutoSilentEnabled(true);
            setDefaultMode('silent');
            setDetectionInterval('1m');
            setDefaultRadius(20);
            setActivationDuration('2');
            setBatterySaver(false);
            setRestoreBehavior('previous');
            Alert.alert('Success', 'Settings reset to defaults');
          }
        }
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
            onPress={() => Alert.alert('Navigation', 'Would navigate back')}
            style={styles.headerButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.headerButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your SilentZone experience</Text>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Auto-Silent</Text>
                <Text style={styles.settingDescription}>Automatically silence in zones</Text>
              </View>
              <Switch
                value={autoSilentEnabled}
                onValueChange={setAutoSilentEnabled}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary }}
                thumbColor={autoSilentEnabled ? theme.colors.background : '#f4f3f4'}
              />
            </View>

            <View style={[styles.settingItem, styles.borderBottom]}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Default Mode</Text>
                <Text style={styles.settingDescription}>Silent or vibrate when activated</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDefaultMode(defaultMode === 'silent' ? 'vibrate' : 'silent')}
                style={styles.selector}
              >
                <Text style={styles.selectorText}>{defaultMode}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Detection Interval</Text>
                <Text style={styles.settingDescription}>How often to check location</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const options = ['30s', '1m', '2m'] as const;
                  const currentIndex = options.indexOf(detectionInterval);
                  const nextIndex = (currentIndex + 1) % options.length;
                  setDetectionInterval(options[nextIndex]);
                }}
                style={styles.selector}
              >
                <Text style={styles.selectorText}>{detectionInterval}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Detection Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detection Settings</Text>

          <View style={styles.card}>
            <View style={[styles.settingItem, styles.borderBottom]}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Default Radius</Text>
                <Text style={styles.settingDescription}>Default zone size in meters</Text>
              </View>
              <View style={styles.radiusControls}>
                <TouchableOpacity
                  onPress={() => setDefaultRadius(Math.max(10, defaultRadius - 5))}
                  style={[styles.radiusButton, defaultRadius <= 10 && styles.disabledButton]}
                  disabled={defaultRadius <= 10}
                >
                  <Text style={styles.radiusButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.radiusValue}>{defaultRadius}m</Text>
                <TouchableOpacity
                  onPress={() => setDefaultRadius(Math.min(100, defaultRadius + 5))}
                  style={[styles.radiusButton, defaultRadius >= 100 && styles.disabledButton]}
                  disabled={defaultRadius >= 100}
                >
                  <Text style={styles.radiusButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.settingItem, styles.borderBottom]}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Activation Duration</Text>
                <Text style={styles.settingDescription}>Delay before silencing</Text>
              </View>
              <TouchableOpacity
                onPress={() => setActivationDuration(activationDuration === '1' ? '2' : activationDuration === '2' ? '3' : '1')}
                style={styles.selector}
              >
                <Text style={styles.selectorText}>{activationDuration} min</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.settingItem, styles.borderBottom]}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Battery Saver Mode</Text>
                <Text style={styles.settingDescription}>Use network location only</Text>
              </View>
              <Switch
                value={batterySaver}
                onValueChange={setBatterySaver}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary }}
                thumbColor={batterySaver ? theme.colors.background : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>DND Restore Behavior</Text>
                <Text style={styles.settingDescription}>What volume to restore to</Text>
              </View>
              <TouchableOpacity
                onPress={() => setRestoreBehavior(restoreBehavior === 'previous' ? 'default' : 'previous')}
                style={styles.selector}
              >
                <Text style={styles.selectorText}>{restoreBehavior}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Permissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>

          <View style={styles.card}>
            {Object.entries(permissionStatus).map(([key, status], index) => (
              <View key={key} style={[styles.settingItem, index < Object.keys(permissionStatus).length - 1 && styles.borderBottom]}>
                <View style={styles.permissionLeft}>
                  <Text style={styles.permissionIcon}>{getPermissionIcon(status)}</Text>
                  <View style={styles.permissionContent}>
                    <Text style={styles.settingTitle}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Text>
                    <Text style={[styles.permissionStatus, { color: getPermissionColor(status) }]}>
                      {status}
                    </Text>
                  </View>
                </View>
                {status !== 'granted' && (
                  <TouchableOpacity
                    onPress={() => handleFixPermission(key)}
                    style={styles.fixButton}
                  >
                    <Text style={styles.fixButtonText}>Fix</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>

          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => Alert.alert('Export Zones', 'Your zones will be exported as a JSON file to your Downloads folder.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Export', onPress: () => Alert.alert('Success', 'Zones exported successfully to Downloads folder') }
              ])}
              style={[styles.settingItem, styles.borderBottom]}
              accessibilityLabel="Export zones"
              accessibilityRole="button"
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Export Zones</Text>
                <Text style={styles.settingDescription}>Download your zones as JSON</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Import Zones', 'Select a JSON file to import your zones.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Import', onPress: () => Alert.alert('Success', 'Zones imported successfully') }
              ])}
              style={[styles.settingItem, styles.borderBottom]}
              accessibilityLabel="Import zones"
              accessibilityRole="button"
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Import Zones</Text>
                <Text style={styles.settingDescription}>Import zones from file</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/history')}
              style={[styles.settingItem, styles.borderBottom]}
              accessibilityLabel="View activity history"
              accessibilityRole="button"
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Activity History</Text>
                <Text style={styles.settingDescription}>View all zone activity</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/help')}
              style={[styles.settingItem, styles.borderBottom]}
              accessibilityLabel="Get help and support"
              accessibilityRole="button"
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingDescription}>FAQ and troubleshooting</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResetToDefaults}
              style={styles.settingItem}
            >
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.colors.error }]}>Reset to Defaults</Text>
                <Text style={styles.settingDescription}>Reset all settings</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.card}>
            <View style={styles.aboutContent}>
              <Text style={styles.aboutTitle}>SilentZone v1.0.0</Text>
              <Text style={styles.aboutSubtitle}>Smart Auto-Silent Zones</Text>
              <Text style={styles.aboutFooter}>Made with ❤️ by Orion</Text>
            </View>
          </View>
        </View>
      </ScrollView>

    </LinearGradient>
  );
}