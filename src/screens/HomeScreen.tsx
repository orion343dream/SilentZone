import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';
import MapView from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { requestPermissions } from '@/services/permissionService';
import { Colors } from '@/constants/Colors';

type RootStackParamList = {
  ManageZone: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ManageZone'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const checkPermissions = async () => {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permissions Required',
          'This app needs location and notification permissions to function correctly. Please enable them in your settings.',
          [{ text: 'OK' }]
        );
      }
    };
    checkPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
      />
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Silent Zones</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Add New Zone"
            onPress={() => navigation.navigate('ManageZone')}
            color={Colors.primary}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});
