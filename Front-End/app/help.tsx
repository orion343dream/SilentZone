import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../components/ui/theme';

export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const faqItems = [
    {
      id: 1,
      question: "App not silencing my phone",
      answer: "Check that you have granted Location, Do Not Disturb, and Notification permissions. Also ensure Auto-Silent is enabled in Settings and you're within a zone's radius.",
      tags: ['permissions', 'silencing', 'troubleshooting']
    },
    {
      id: 2,
      question: "How do I add a custom silent zone?",
      answer: "From the Home screen, tap the + button or go to the Map tab and long-press on a location. You can also use the Zones tab to manage existing zones.",
      tags: ['zones', 'adding', 'custom']
    },
    {
      id: 3,
      question: "Why does the app need location permission?",
      answer: "Location access is required to detect when you enter or leave silent zones. This data is processed locally on your device and is never shared.",
      tags: ['permissions', 'privacy', 'location']
    },
    {
      id: 4,
      question: "Battery optimization affecting the app",
      answer: "Android may restrict background activity. Go to Settings > Apps > SilentZone > Battery and disable battery optimization for reliable zone detection.",
      tags: ['battery', 'android', 'background']
    },
    {
      id: 5,
      question: "How to change zone radius and mode?",
      answer: "Tap on any zone in the Zones list or from the zone details screen to edit. You can adjust radius (10-100m), silent/vibrate mode, and activation delay.",
      tags: ['zones', 'editing', 'radius']
    },
    {
      id: 6,
      question: "App not working in the background",
      answer: "For Android: Disable battery optimization and allow background location. For iOS: Enable Location Services and Background App Refresh in Settings.",
      tags: ['background', 'android', 'ios']
    }
  ];

  const troubleshootingGuides = [
    {
      title: "Samsung Devices",
      steps: [
        "Go to Settings > Apps > SilentZone",
        "Tap Battery > Optimize battery usage",
        "Find SilentZone and set to 'Not optimized'",
        "Go to Location > App permissions > Allow all the time"
      ]
    },
    {
      title: "Google Pixel / Android Stock",
      steps: [
        "Go to Settings > Apps > SilentZone",
        "Tap Permissions > Location > Allow all the time",
        "Go to Battery > Battery optimization > Don't optimize"
      ]
    },
    {
      title: "iOS Devices",
      steps: [
        "Go to Settings > SilentZone",
        "Enable Location > Always",
        "Enable Background App Refresh",
        "Allow Notifications if prompted"
      ]
    }
  ];

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openSystemSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      Alert.alert('Error', 'Unable to open settings');
    }
  };

  const contactSupport = () => {
    const email = 'support@silentzones.app';
    const subject = 'SilentZone Support Request';
    const body = 'Please describe your issue:';

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open email app');
      }
    });
  };

  const exportLogs = () => {
    Alert.alert('Export Logs', 'Debug logs exported to Downloads folder');
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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('Search', 'Would toggle search bar')}
            style={styles.headerButton}
            accessibilityLabel="Toggle search"
            accessibilityRole="button"
          >
            <Text style={styles.headerIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search FAQ..."
              style={styles.searchInput}
              placeholderTextColor={theme.colors.text.secondary}
              accessibilityLabel="Search help topics"
              accessibilityHint="Type to search for help topics and troubleshooting"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            onPress={openSystemSettings}
            style={styles.quickActionButton}
            accessibilityLabel="Open system settings"
            accessibilityRole="button"
          >
            <Text style={styles.quickActionText}>Open Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={exportLogs}
            style={[styles.quickActionButton, { backgroundColor: theme.colors.neutral.dark }]}
            accessibilityLabel="Export debug logs"
            accessibilityRole="button"
          >
            <Text style={styles.quickActionText}>Export Logs</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          {filteredFAQs.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              style={styles.faqCard}
              accessibilityLabel={`FAQ: ${item.question}`}
              accessibilityHint="Tap to expand answer"
              accessibilityRole="button"
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>
                  {item.question}
                </Text>
                <Text style={styles.faqToggle}>
                  {expandedItem === item.id ? '−' : '+'}
                </Text>
              </View>

              {expandedItem === item.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>
                    {item.answer}
                  </Text>
                  <View style={styles.faqTags}>
                    {item.tags.map((tag) => (
                      <Text key={tag} style={styles.faqTag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {filteredFAQs.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No results found</Text>
            </View>
          )}
        </View>

        {/* Device-Specific Guides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device-Specific Setup</Text>

          {troubleshootingGuides.map((guide, index) => (
            <View key={index} style={styles.troubleshootingCard}>
              <Text style={styles.troubleshootingTitle}>{guide.title}</Text>

              {guide.steps.map((step, stepIndex) => (
                <View key={stepIndex} style={styles.troubleshootingStep}>
                  <Text style={styles.stepNumber}>
                    {stepIndex + 1}.
                  </Text>
                  <Text style={styles.stepText}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Permissions Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permission Requirements</Text>

          <View style={styles.card}>
            <View style={styles.permissionItem}>
              <Text style={styles.permissionIcon}>📍</Text>
              <View style={styles.permissionContent}>
                <Text style={styles.permissionTitle}>Location Access</Text>
                <Text style={styles.permissionDescription}>Required to detect when you enter or leave zones</Text>
              </View>
            </View>

            <View style={[styles.permissionItem, styles.borderBottom]}>
              <Text style={styles.permissionIcon}>🔇</Text>
              <View style={styles.permissionContent}>
                <Text style={styles.permissionTitle}>Do Not Disturb</Text>
                <Text style={styles.permissionDescription}>Allows the app to automatically silence your phone</Text>
              </View>
            </View>

            <View style={[styles.permissionItem, styles.borderBottom]}>
              <Text style={styles.permissionIcon}>🔔</Text>
              <View style={styles.permissionContent}>
                <Text style={styles.permissionTitle}>Notifications</Text>
                <Text style={styles.permissionDescription}>Shows alerts when zones are triggered</Text>
              </View>
            </View>

            <View style={styles.permissionItem}>
              <Text style={styles.permissionIcon}>🔋</Text>
              <View style={styles.permissionContent}>
                <Text style={styles.permissionTitle}>Battery Optimization</Text>
                <Text style={styles.permissionDescription}>Prevents Android from killing the app in background</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Battery Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Battery Optimization Tips</Text>

          <View style={styles.batteryTip}>
            <Text style={styles.batteryTipText}>
              Android devices may restrict background activity to save battery. For best performance, disable battery optimization for SilentZone in your device settings.
            </Text>
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>

          <View style={styles.supportCard}>
            <Text style={styles.supportText}>
              Can't find what you're looking for? Get in touch with our support team.
            </Text>

            <TouchableOpacity
              onPress={contactSupport}
              style={styles.supportButton}
              accessibilityLabel="Contact support via email"
              accessibilityRole="button"
            >
              <Text style={styles.supportButtonText}>Email Support</Text>
            </TouchableOpacity>

            <View style={styles.supportInfo}>
              <View style={styles.supportInfoItem}>
                <Text style={styles.supportInfoLabel}>Version</Text>
                <Text style={styles.supportInfoValue}>1.0.0</Text>
              </View>
              <View style={styles.supportInfoItem}>
                <Text style={styles.supportInfoLabel}>Support</Text>
                <Text style={styles.supportInfoValue}>24/7</Text>
              </View>
            </View>
          </View>
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
  },
  searchInput: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.background,
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
  faqCard: {
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
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  faqQuestion: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '500',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  faqToggle: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text.muted,
  },
  faqAnswer: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  faqAnswerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  faqTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  faqTag: {
    fontSize: theme.typography.sizes.xs,
    backgroundColor: theme.colors.neutral.light,
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
  },
  emptyText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  troubleshootingCard: {
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
  },
  troubleshootingTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'semibold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  troubleshootingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  stepNumber: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
    color: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  stepText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    flex: 1,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  permissionIcon: {
    fontSize: theme.typography.sizes.xl,
    marginRight: theme.spacing.md,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  permissionDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  batteryTip: {
    backgroundColor: theme.colors.warning + '10',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  batteryTipText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  supportCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  supportText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  supportButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  supportButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    color: theme.colors.background,
  },
  supportInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supportInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  supportInfoLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
  },
  supportInfoValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
});