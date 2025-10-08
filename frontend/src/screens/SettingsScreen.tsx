import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';

const AUTO_SILENT_KEY = 'auto_silent_android';

export default function SettingsScreen() {
  const [autoSilentEnabled, setAutoSilentEnabled] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const value = await AsyncStorage.getItem(AUTO_SILENT_KEY);
        setAutoSilentEnabled(value === 'true');
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleToggleAutoSilent = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(AUTO_SILENT_KEY, value.toString());
      setAutoSilentEnabled(value);
      if (value && Platform.OS === 'android') {
        Alert.alert(
          'Auto-Silent Enabled',
          'When entering a silent zone, the app will attempt to switch to silent mode. Note: This requires Do Not Disturb access, which may need to be configured in your device settings or requires a bare workflow app for full functionality.'
        );
      }
    } catch (error) {
      console.error('Failed to save setting:', error);
      Alert.alert('Error', 'Failed to save setting.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {Platform.OS === 'android' && (
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto-Silent on Android</Text>
            <Text style={styles.settingDescription}>
              Automatically switch to silent mode when entering zones (requires Do Not Disturb access).
            </Text>
          </View>
          <Switch
            value={autoSilentEnabled}
            onValueChange={handleToggleAutoSilent}
            trackColor={{ false: Colors.gray, true: Colors.secondary }}
            thumbColor={Colors.light}
          />
        </View>
      )}

      {Platform.OS === 'ios' && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>iOS Limitations</Text>
          <Text style={styles.infoText}>
            Automatic silent mode switching is not supported on iOS due to platform restrictions.
            You will receive notifications when entering or leaving zones instead.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: Colors.dark,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.gray,
  },
  infoContainer: {
    backgroundColor: Colors.light,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
});
