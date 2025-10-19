import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../components/ui/theme';


export default function MapScreen() {
  const { width, height } = Dimensions.get('window');

  const [searchQuery, setSearchQuery] = useState('');
  const [showPlaceMarkers, setShowPlaceMarkers] = useState(true);
  const [showCustomZones, setShowCustomZones] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Mock places data
  const mockPlaces = [
    { id: 1, name: 'Central Library', lat: 40.7128, lng: -74.0060, type: 'Library', distance: '12m' },
    { id: 2, name: 'St. Mary Church', lat: 40.7129, lng: -74.0061, type: 'Church', distance: '45m' },
    { id: 3, name: 'City Hospital', lat: 40.7130, lng: -74.0062, type: 'Hospital', distance: '120m' },
  ];

  const mockCustomZones = [
    { id: 101, name: 'Home Office', lat: 40.7127, lng: -74.0059, radius: 30 },
    { id: 102, name: 'Gym', lat: 40.7131, lng: -74.0063, radius: 25 },
  ];

  const handleLongPress = (coordinates: any) => {
    setSelectedCoordinates(coordinates);
    setShowAddZoneModal(true);
  };

  const handleAddZone = () => {
    setShowAddZoneModal(false);
    router.push('/add-zone');
  };

  const handleNavigateToZone = (zoneId: number) => {
    router.push(`/zone/${zoneId}`);
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'Library': return '📚';
      case 'Church': return '⛪';
      case 'Hospital': return '🏥';
      default: return '📍';
    }
  };

  return (
    <View style={styles.container}>
      {/* Offline Banner */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>⚠️ Location unavailable. Check your GPS or Internet.</Text>
        </View>
      )}

      {/* Map Header */}
      <View style={styles.mapHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
          accessibilityLabel="Go back to previous screen"
          accessibilityRole="button"
        >
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search places..."
              style={styles.searchInput}
              placeholderTextColor={theme.colors.text.secondary}
              accessibilityLabel="Search places"
              accessibilityHint="Type to search for locations"
            />
          </View>
        </View>
      </View>

      {/* Map Container */}
      <TouchableOpacity
        style={styles.mapContainer}
        onLongPress={() => handleLongPress({ lat: 40.7128, lng: -74.0060 })}
        accessibilityLabel="Interactive map view - long press to add zone"
        accessibilityHint="Touch and hold to create a new silent zone"
      >
        <View style={styles.mapContent}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapTitle}>Interactive Map View</Text>
          <Text style={styles.mapSubtitle}>
            Google Maps integration would be implemented here
          </Text>

          {/* Mock Zone Circles */}
          <View style={styles.zoneCircle1} />
          <View style={styles.zoneCircle2} />

          {/* User Location Dot */}
          <View style={styles.userLocation} />
        </View>
      </TouchableOpacity>

      {/* Floating Controls */}
      <View style={styles.floatingControls}>
        <TouchableOpacity
          style={styles.floatingButton}
          accessibilityLabel="Center on my location"
          accessibilityRole="button"
        >
          <Text style={styles.floatingButtonText}>📍</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowPlaceMarkers(!showPlaceMarkers)}
          style={[styles.floatingButton, showPlaceMarkers && styles.floatingButtonActive]}
          accessibilityLabel={`${showPlaceMarkers ? 'Hide' : 'Show'} place markers`}
          accessibilityRole="button"
          accessibilityState={{ selected: showPlaceMarkers }}
        >
          <Text style={[styles.floatingButtonText, showPlaceMarkers && styles.floatingButtonTextActive]}>🏛️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowCustomZones(!showCustomZones)}
          style={[styles.floatingButton, showCustomZones && styles.floatingButtonActive]}
          accessibilityLabel={`${showCustomZones ? 'Hide' : 'Show'} custom zones`}
          accessibilityRole="button"
          accessibilityState={{ selected: showCustomZones }}
        >
          <Text style={[styles.floatingButtonText, showCustomZones && styles.floatingButtonTextActive]}>📍</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('Refresh', 'Map refreshed successfully')}
          style={styles.floatingButton}
          accessibilityLabel="Refresh map data"
          accessibilityRole="button"
        >
          <Text style={styles.floatingButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Zone Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <ScrollView style={styles.bottomSheetContent}>
          {selectedPlace ? (
            <View>
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHeaderInfo}>
                  <Text style={styles.sheetTitle}>{selectedPlace.name}</Text>
                  <Text style={styles.sheetSubtitle}>
                    {selectedPlace.type} • {selectedPlace.distance}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedPlace(null)}
                  style={styles.closeButton}
                  accessibilityLabel="Close zone details"
                  accessibilityRole="button"
                >
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sheetActions}>
                <TouchableOpacity
                  onPress={() => router.push('/add-zone')}
                  style={styles.sheetActionButton}
                  accessibilityLabel="Add this location as zone"
                  accessibilityRole="button"
                >
                  <Text style={styles.sheetActionText}>Add Zone</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleNavigateToZone(selectedPlace.id)}
                  style={[styles.sheetActionButton, { backgroundColor: theme.colors.neutral.light }]}
                  accessibilityLabel="Navigate to this location"
                  accessibilityRole="button"
                >
                  <Text style={[styles.sheetActionText, { color: theme.colors.text.primary }]}>Navigate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleNavigateToZone(selectedPlace.id)}
                  style={[styles.sheetActionButton, { backgroundColor: theme.colors.neutral.light }]}
                  accessibilityLabel="View more information"
                  accessibilityRole="button"
                >
                  <Text style={[styles.sheetActionText, { color: theme.colors.text.primary }]}>Info</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.sheetTitle}>Places & Zones</Text>

              <View style={styles.placesList}>
                {showPlaceMarkers && mockPlaces.slice(0, 2).map((place) => (
                  <TouchableOpacity
                    key={place.id}
                    onPress={() => setSelectedPlace(place)}
                    style={styles.placeItem}
                    accessibilityLabel={`Select ${place.name}`}
                    accessibilityRole="button"
                  >
                    <Text style={styles.placeIcon}>{getMarkerIcon(place.type)}</Text>
                    <View style={styles.placeInfo}>
                      <Text style={styles.placeName}>{place.name}</Text>
                      <Text style={styles.placeDistance}>{place.distance}</Text>
                    </View>
                    <Text style={styles.arrowIcon}>→</Text>
                  </TouchableOpacity>
                ))}

                {showCustomZones && mockCustomZones.map((zone) => (
                  <TouchableOpacity
                    key={zone.id}
                    onPress={() => setSelectedPlace({...zone, type: 'Custom', distance: 'Your zone'})}
                    style={[styles.placeItem, { backgroundColor: `${theme.colors.success}10` }]}
                    accessibilityLabel={`Select your zone ${zone.name}`}
                    accessibilityRole="button"
                  >
                    <Text style={styles.placeIcon}>📍</Text>
                    <View style={styles.placeInfo}>
                      <Text style={styles.placeName}>{zone.name}</Text>
                      <Text style={styles.placeDistance}>Your zone • {zone.radius}m radius</Text>
                    </View>
                    <Text style={styles.arrowIcon}>→</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.instructionText}>
                Long press on map to add a custom zone
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Add Zone Modal */}
      <Modal
        visible={showAddZoneModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddZoneModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Zone</Text>
            <Text style={styles.modalSubtitle}>
              Create a silent zone at selected location
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleAddZone}
                style={styles.modalPrimaryButton}
                accessibilityLabel="Confirm add zone"
                accessibilityRole="button"
              >
                <Text style={styles.modalPrimaryText}>Add Zone</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowAddZoneModal(false)}
                style={styles.modalSecondaryButton}
                accessibilityLabel="Cancel add zone"
                accessibilityRole="button"
              >
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  offlineBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.sm,
    zIndex: 40,
  },
  offlineBannerText: {
    color: theme.colors.background,
    textAlign: 'center',
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
  },
  mapHeader: {
    position: 'absolute',
    top: theme.spacing.xl,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 30,
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  headerIcon: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.background,
  },
  searchContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  searchBar: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContent: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  mapIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  mapTitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  mapSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  zoneCircle1: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: 80,
    height: 80,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    borderRadius: 40,
    opacity: 0.6,
  },
  zoneCircle2: {
    position: 'absolute',
    bottom: '40%',
    right: '30%',
    width: 60,
    height: 60,
    borderWidth: 3,
    borderColor: theme.colors.success,
    borderRadius: 30,
    opacity: 0.6,
  },
  userLocation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 16,
    height: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ translateX: -8 }, { translateY: -8 }],
  },
  floatingControls: {
    position: 'absolute',
    top: theme.spacing.xl * 4 + theme.spacing.xl,
    right: theme.spacing.md,
    zIndex: 20,
  },
  floatingButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: theme.spacing.sm,
  },
  floatingButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  floatingButtonText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
  },
  floatingButtonTextActive: {
    color: theme.colors.background,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  bottomSheetContent: {
    padding: theme.spacing.xl,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  sheetHeaderInfo: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sheetSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  closeIcon: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  sheetActionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  sheetActionText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.background,
  },
  placesList: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral.light,
    borderRadius: theme.borderRadius.lg,
  },
  placeIcon: {
    fontSize: theme.typography.sizes['2xl'],
    marginRight: theme.spacing.md,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  placeDistance: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  arrowIcon: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.muted,
  },
  instructionText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
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