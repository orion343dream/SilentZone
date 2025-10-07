import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';

export default function ManageZoneScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add/Edit Zone</Text>
      <Text style={styles.placeholder}>Map picker and form will go here.</Text>
      <View style={styles.buttonContainer}>
        <Button title="Save Zone" onPress={() => navigation.goBack()} color={Colors.primary} />
        <View style={{marginTop: 10}}/>
        <Button title="Cancel" onPress={() => navigation.goBack()} color={Colors.gray} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  }
});
