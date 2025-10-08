import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, Platform, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Save, X, Plus } from 'lucide-react-native';
import MapPicker from '@/components/MapPicker';
import { saveZone } from '@/services/zoneService';
import { startGeofencingForZones } from '@/services/geofencing';
import { getZones } from '@/services/zoneService';
import { Zone } from '@/types';
import { Colors } from '@/constants/Colors';

type RootStackParamList = {
  ManageZone: { zone?: Zone };
};

type ManageZoneScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ManageZone'>;
type ManageZoneScreenRouteProp = RouteProp<RootStackParamList, 'ManageZone'>;

export default function ManageZoneScreen() {
  const navigation = useNavigation<ManageZoneScreenNavigationProp>();
  const route = useRoute<ManageZoneScreenRouteProp>();
  const existingZone = route.params?.zone;

  const [name, setName] = useState(existingZone?.name || '');
  const [latitude, setLatitude] = useState(existingZone?.latitude || 37.78825);
  const [longitude, setLongitude] = useState(existingZone?.longitude || -122.4324);
  const [radius, setRadius] = useState(existingZone?.radius || 100);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    if (existingZone) {
      setName(existingZone.name);
      setLatitude(existingZone.latitude);
      setLongitude(existingZone.longitude);
      setRadius(existingZone.radius);
    }
  }, [existingZone]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a zone name.');
      return;
    }

    setIsSaving(true);
    try {
      const zoneData = {
        name: name.trim(),
        latitude,
        longitude,
        radius,
        ...(existingZone && { id: existingZone.id }),
      };
      await saveZone(zoneData);
      // Update geofencing
      if (Platform.OS !== 'web') {
        const updatedZones = await getZones();
        await startGeofencingForZones(updatedZones);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save zone. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={[{ flex: 1 }, { backgroundColor: Colors.primary }]}>
      <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.titleContainer}>
              {existingZone ? <Plus size={24} color={Colors.light} /> : <Plus size={24} color={Colors.light} />}
              <Text style={styles.title}>{existingZone ? 'Edit Zone' : 'Add New Zone'}</Text>
            </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <Plus size={18} color={Colors.light} />
              <Text style={styles.label}>Zone Name</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter zone name"
                placeholderTextColor={Colors.gray}
                maxLength={50}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MapPin size={18} color={Colors.light} />
              <Text style={styles.label}>Location</Text>
            </View>
            <MapPicker
              initialLatitude={latitude}
              initialLongitude={longitude}
              initialRadius={radius}
              onLocationChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
              onRadiusChange={setRadius}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, isSaving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <View style={[styles.buttonGradient, { backgroundColor: Colors.secondary }]}>
                <Save size={20} color={Colors.light} />
                <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save Zone'}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.buttonSpacer} />
            <TouchableOpacity
              style={[styles.button, isSaving && styles.buttonDisabled]}
              onPress={handleCancel}
              disabled={isSaving}
            >
              <View style={styles.cancelButton}>
                <X size={20} color={Colors.gray} />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
  </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: Colors.light,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light,
    marginLeft: 8,
  },
  inputContainer: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.light,
    color: Colors.dark,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: Colors.light,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.light,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: Colors.gray,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonSpacer: {
    height: 15,
  },
});
