import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Switch, TouchableOpacity, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getZones, deleteZone, toggleZoneActive } from '@/services/zoneService';
import { startGeofencingForZones } from '@/services/geofencing';
import { Zone } from '@/types';
import { Colors } from '@/constants/Colors';
import { Edit, Trash2 } from 'lucide-react-native';

type RootStackParamList = {
  ManageZone: { zone: Zone };
};

type ZoneListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ManageZone'>;

export default function ZoneListScreen() {
  const [zones, setZones] = useState<Zone[]>([]);
  const navigation = useNavigation<ZoneListScreenNavigationProp>();


  const loadZones = useCallback(async () => {
    const storedZones = await getZones();
    setZones(storedZones);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadZones();
    }, [loadZones])
  );

  const handleDelete = (id: string) => {
    Alert.alert('Delete Zone', 'Are you sure you want to delete this zone?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteZone(id);
          await loadZones();
          const updatedZones = await getZones();
          await startGeofencingForZones(updatedZones);
        },
      },
    ]);
  };

  const handleToggle = async (id: string) => {
    await toggleZoneActive(id);
    await loadZones();
    const updatedZones = await getZones();
    await startGeofencingForZones(updatedZones);
  };

  const renderItem = ({ item }: { item: Zone }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemSubText}>Radius: {item.radius.toFixed(0)}m</Text>
      </View>
      <View style={styles.itemActions}>
        <Switch
          value={item.isActive}
          onValueChange={() => handleToggle(item.id)}
          trackColor={{ false: Colors.gray, true: Colors.secondary }}
          thumbColor={Colors.light}
        />
        <TouchableOpacity onPress={() => navigation.navigate('ManageZone', { zone: item })} style={styles.iconButton}>
          <Edit color={Colors.primary} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
          <Trash2 color={Colors.danger} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={zones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No zones created yet.</Text>}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: Colors.light,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
  },
  itemSubText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.gray,
  },
});
