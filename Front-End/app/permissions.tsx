import { LinearGradient } from "expo-linear-gradient";
import * as Linking from 'expo-linking';
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../components/ui/theme";

const { width } = Dimensions.get('window');

const PermissionsScreen = () => {
  const [currentPermission, setCurrentPermission] = useState(0);

  const permissions = [
    {
      title: "Location Access",
      icon: "📍",
      description: "We need location access to detect when you enter or leave silent zones.",
      whyNeeded: "Location is required to automatically silence your device in designated areas.",
      permissionType: "location",
      additionalNote: null
    },
    {
      title: "Do Not Disturb Access",
      icon: "🔇",
      description: "Access to change your phone's Do Not Disturb settings.",
      whyNeeded: "Required to automatically silence notifications and calls in silent zones.",
      permissionType: "dnd",
      additionalNote: "Android only: Required for automatic mode switching"
    },
    {
      title: "Notifications",
      icon: "🔔",
      description: "Permission to show notifications about zone status and reminders.",
      whyNeeded: "Receive alerts when entering zones and status updates.",
      permissionType: "notifications",
      additionalNote: "Optional but recommended for zone alerts"
    }
  ];

  const handleGrantPermission = (permissionType: string) => {
    // In a real app, this would request the actual system permission
    // For now, we'll simulate the flow
    console.log(`Requesting ${permissionType} permission`);

    // Show success message
    Alert.alert(
      'Permission Granted',
      `${permissions[currentPermission].title} has been granted successfully.`,
      [
        {
          text: 'Continue',
          onPress: () => {
            if (currentPermission < permissions.length - 1) {
              setCurrentPermission(currentPermission + 1);
            } else {
              // All permissions requested, navigate to home
              router.replace("/");
            }
          }
        }
      ]
    );
  };

  const handleSkip = () => {
    router.replace("/");
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const currentPerm = permissions[currentPermission];

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.background]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Permissions Required
          </Text>
          <Text style={styles.headerSubtitle}>
            To provide the best silent zone experience, we need a few permissions.
          </Text>
        </View>

        {/* Permission Card */}
        <View style={styles.permissionCard}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.permissionIcon}>{currentPerm.icon}</Text>
          </View>

          {/* Title */}
          <Text style={styles.permissionTitle}>
            {currentPerm.title}
          </Text>

          {/* Description */}
          <Text style={styles.permissionDescription}>
            {currentPerm.description}
          </Text>

          {/* Additional Note */}
          {currentPerm.additionalNote && (
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                {currentPerm.additionalNote}
              </Text>
            </View>
          )}

          {/* Why Needed */}
          <View style={styles.whyNeededContainer}>
            <Text style={styles.whyNeededTitle}>Why we need this:</Text>
            <Text style={styles.whyNeededText}>
              {currentPerm.whyNeeded}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleGrantPermission(currentPerm.permissionType)}
              style={styles.grantButton}
            >
              <Text style={styles.grantButtonText}>
                Grant Permission
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenSettings}
              style={styles.settingsButton}
            >
              <Text style={styles.settingsButtonText}>
                Open Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentPermission + 1} of {permissions.length}
          </Text>
          <View style={styles.dotsContainer}>
            {permissions.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentPermission ? styles.dotActive :
                  index < currentPermission ? styles.dotCompleted : styles.dotInactive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Skip Button */}
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipContainer}
        >
          <Text style={styles.skipText}>
            Remind me later
          </Text>
        </TouchableOpacity>

        {/* Footer Note */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            You can change these permissions anytime in your device settings or app settings.
            SilentZone works best with all permissions enabled.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
    paddingTop: theme.spacing.xl,
  },
  headerTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  permissionIcon: {
    fontSize: 80,
  },
  permissionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  permissionDescription: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  noteContainer: {
    backgroundColor: theme.colors.warning + '20',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  noteText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.warning,
    textAlign: 'center',
  },
  whyNeededContainer: {
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  whyNeededTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: 'medium',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  whyNeededText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    lineHeight: 18,
  },
  buttonContainer: {
    gap: theme.spacing.sm,
  },
  grantButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  grantButtonText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'semibold',
    color: theme.colors.background,
  },
  settingsButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  settingsButtonText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  progressText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
  },
  dotCompleted: {
    backgroundColor: theme.colors.success,
  },
  dotInactive: {
    backgroundColor: theme.colors.neutral.light,
  },
  skipContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  skipText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.muted,
    textDecorationLine: 'underline',
  },
  footerContainer: {
    backgroundColor: theme.colors.neutral.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PermissionsScreen;