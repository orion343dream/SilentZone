import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../components/ui/theme';

const { width } = Dimensions.get('window');

export default function AddZoneScreen() {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [zoneName, setZoneName] = useState('New Silent Zone');
  const [zoneType, setZoneType] = useState<'Library' | 'School' | 'Temple' | 'Church' | 'Hospital' | 'Custom'>('Custom');
  const [radius, setRadius] = useState(20);
  const [mode, setMode] = useState<'silent' | 'vibrate'>('silent');
  const [activationDelay, setActivationDelay] = useState(1);

  const zoneTypes = ['Library', 'School', 'Temple', 'Church', 'Hospital', 'Custom'];

  // Load zone data if editing
  useEffect(() => {
    if (isEditing) {
      // Mock data for editing - in real app, load from state/storage
      const existingZone = {
        id: parseInt(id as string),
        name: 'Central Library',
        type: 'Library' as const,
        radius: 50,
        mode: 'silent' as const,
        activationDelay: 2,
      };
      setZoneName(existingZone.name);
      setZoneType(existingZone.type);
      setRadius(existingZone.radius);
      setMode(existingZone.mode);
      setActivationDelay(existingZone.activationDelay);
    }
  }, [id, isEditing]);

  const handleSave = () => {
    if (!zoneName.trim()) {
      Alert.alert('Missing Zone Name', 'Please enter a name for your silent zone.');
      return;
    }

    if (zoneName.trim().length < 3) {
      Alert.alert('Zone Name Too Short', 'Zone name must be at least 3 characters long.');
      return;
    }

    if (radius < 10 || radius > 100) {
      Alert.alert('Invalid Radius', 'Radius must be between 10 and 100 meters.');
      return;
    }

    // In real app, save to state/storage
    const action = isEditing ? 'updated' : 'created';
    Alert.alert(
      `Zone ${action.charAt(0).toUpperCase() + action.slice(1)} Successfully!`, 
      `Your silent zone "${zoneName}" has been ${action}. It will automatically silence your device when you enter the area.`,
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const handleTest = () => {
    Alert.alert(
      'Test Zone Behavior', 
      `This will simulate entering the "${zoneName}" zone to test the ${mode} mode behavior. Your device will be set to ${mode} mode for 10 seconds.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Test Zone', 
          onPress: () => {
            Alert.alert('Zone Test Started', `Your device is now in ${mode} mode. It will return to normal after 10 seconds.`);
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
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Zone' : 'Add Silent Zone'}</Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Map Preview */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPreview}>
            <Text style={styles.mapIcon}>🗺️</Text>
            <Text style={styles.mapTitle}>Map Preview</Text>
            <Text style={styles.mapSubtitle}>Tap to adjust location</Text>
          </View>
          {/* Dynamic zone circle visualization */}
          <View style={[styles.zoneCircle, { width: radius * 2, height: radius * 2, borderRadius: radius }]} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Zone Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Zone Name</Text>
            <TextInput
              value={zoneName}
              onChangeText={setZoneName}
              placeholder="Enter zone name"
              style={styles.textInput}
              placeholderTextColor={theme.colors.text.muted}
            />
          </View>

          {/* Zone Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Zone Type</Text>
            <View style={styles.typeContainer}>
              {zoneTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setZoneType(type as any)}
                  style={[
                    styles.typeButton,
                    zoneType === type ? styles.typeButtonSelected : styles.typeButtonNormal
                  ]}
                >
                  <Text style={[
                    styles.typeButtonText,
                    zoneType === type ? styles.typeButtonTextSelected : styles.typeButtonTextNormal
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Radius Control */}
          <View style={styles.inputGroup}>
            <View style={styles.radiusHeader}>
              <Text style={styles.inputLabel}>Radius</Text>
              <Text style={styles.radiusValue}>{radius} meters</Text>
            </View>

            <View style={styles.sliderContainer}>
              <View style={styles.sliderControls}>
                <TouchableOpacity
                  onPress={() => setRadius(Math.max(10, radius - 5))}
                  style={[styles.sliderButton, radius <= 10 && styles.sliderButtonDisabled]}
                  disabled={radius <= 10}
                >
                  <Text style={styles.sliderButtonText}>-</Text>
                </TouchableOpacity>

                <View style={styles.sliderTrack}>
                  <View
                    style={[styles.sliderFill, { width: `${((radius - 10) / 90) * 100}%` }]}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setRadius(Math.min(100, radius + 5))}
                  style={[styles.sliderButton, radius >= 100 && styles.sliderButtonDisabled]}
                  disabled={radius >= 100}
                >
                  <Text style={styles.sliderButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sliderHint}>
                Drag the slider or use +/- buttons (10-100m)
              </Text>
            </View>
          </View>

          {/* Mode Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Silent Mode</Text>
            <View style={styles.modeContainer}>
              <TouchableOpacity
                onPress={() => setMode('silent')}
                style={[
                  styles.modeButton,
                  mode === 'silent' ? styles.modeButtonSelected : styles.modeButtonNormal
                ]}
              >
                <Text style={styles.modeIcon}>🔇</Text>
                <Text style={[
                  styles.modeText,
                  mode === 'silent' ? styles.modeTextSelected : styles.modeTextNormal
                ]}>
                  Silent
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMode('vibrate')}
                style={[
                  styles.modeButton,
                  mode === 'vibrate' ? styles.modeButtonSelected : styles.modeButtonNormal
                ]}
              >
                <Text style={styles.modeIcon}>📳</Text>
                <Text style={[
                  styles.modeText,
                  mode === 'vibrate' ? styles.modeTextSelected : styles.modeTextNormal
                ]}>
                  Vibrate
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Activation Delay */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Activation Delay</Text>
            <Text style={styles.inputDescription}>
              How long to wait before activating silent mode when entering the zone
            </Text>

            <View style={styles.delayContainer}>
              {[1, 2, 3].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  onPress={() => setActivationDelay(minutes)}
                  style={[
                    styles.delayButton,
                    activationDelay === minutes ? styles.delayButtonSelected : styles.delayButtonNormal
                  ]}
                >
                  <Text style={[
                    styles.delayButtonText,
                    activationDelay === minutes ? styles.delayButtonTextSelected : styles.delayButtonTextNormal
                  ]}>
                    {minutes} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Test Button */}
          <TouchableOpacity
            onPress={handleTest}
            style={styles.testButton}
          >
            <Text style={styles.testButtonText}>Simulate Enter Zone</Text>
          </TouchableOpacity>

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Tip</Text>
            <Text style={styles.infoText}>
              Place zones at locations where you want automatic silencing. The larger the radius, the bigger the silent area.
            </Text>
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
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  headerButtonText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  headerTitle: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  saveButtonText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'semibold',
    color: theme.colors.primary,
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
  mapSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  zoneCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderWidth: 4,
    borderColor: theme.colors.primary,
    borderRadius: 1000,
    opacity: 0.6,
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  form: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing['2xl'] + theme.spacing.xl,
  },
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'medium',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  typeButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  typeButtonNormal: {
    backgroundColor: theme.colors.neutral.light,
  },
  typeButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  typeButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: 'medium',
  },
  typeButtonTextNormal: {
    color: theme.colors.text.secondary,
  },
  typeButtonTextSelected: {
    color: theme.colors.background,
  },
  radiusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  radiusValue: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  sliderContainer: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sliderButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.neutral.light,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButtonDisabled: {
    opacity: 0.5,
  },
  sliderButtonText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.neutral.light,
    borderRadius: 2,
    marginHorizontal: theme.spacing.md,
  },
  sliderFill: {
    height: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  sliderHint: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  modeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modeButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  modeButtonNormal: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
  },
  modeButtonSelected: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  modeIcon: {
    fontSize: theme.typography.sizes['2xl'],
    marginBottom: theme.spacing.sm,
  },
  modeText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'medium',
  },
  modeTextNormal: {
    color: theme.colors.text.secondary,
  },
  modeTextSelected: {
    color: theme.colors.primary,
  },
  inputDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.md,
  },
  delayContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  delayButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  delayButtonNormal: {
    backgroundColor: theme.colors.neutral.light,
  },
  delayButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  delayButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'medium',
  },
  delayButtonTextNormal: {
    color: theme.colors.text.secondary,
  },
  delayButtonTextSelected: {
    color: theme.colors.background,
  },
  testButton: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  testButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: 'semibold',
    color: theme.colors.background,
  },
  infoCard: {
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  infoTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: 'medium',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    lineHeight: 20,
  },
});