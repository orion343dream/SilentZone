import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

let MapViewComponent: any;
let Marker: any;
let Circle: any;

if (Platform.OS === 'web') {
  // Web dummy components that show a message
  MapViewComponent = ({ children, ...props }: any) => (
    <View style={[styles.webMapContainer, props.style]}>
      <Text style={styles.webMapText}>Map is not available on web</Text>
      <Text style={styles.webMapSubtext}>Use the mobile app for full features</Text>
    </View>
  );
  Marker = () => null;
  Circle = () => null;
} else {
  try {
    // Native components
    const Maps = require('react-native-maps');
    MapViewComponent = Maps.default;
    Marker = Maps.Marker;
    Circle = Maps.Circle;
  } catch (error) {
    // Fallback if react-native-maps is not available
    MapViewComponent = ({ children, ...props }: any) => (
      <View style={[styles.webMapContainer, props.style]}>
        <Text style={styles.webMapText}>Map component not available</Text>
      </View>
    );
    Marker = () => null;
    Circle = () => null;
  }
}

const styles = StyleSheet.create({
  webMapContainer: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  webMapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  webMapSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default MapViewComponent;
export { Marker, Circle };