import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from './theme';

const { width: screenWidth } = Dimensions.get('window');
const drawerWidth = screenWidth * 0.75;

interface NavigationDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: '🏠', label: 'Home', route: '/', key: 'home' },
  { icon: '📍', label: 'My Zones', route: '/zones', key: 'zones' },
  { icon: '🗺️', label: 'Map View', route: '/map', key: 'map' },
  { icon: '🔔', label: 'Notifications', route: '/history', key: 'notifications' },
  { icon: '⚙️', label: 'Settings', route: '/settings', key: 'settings' },
  { icon: '❓', label: 'Help & Support', route: '/help', key: 'help' },
  { icon: '💡', label: 'About App', route: null, key: 'about' },
];

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ visible, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(-drawerWidth)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -drawerWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleMenuPress = (route: string | null, key: string) => {
    onClose();
    if (route) {
      setTimeout(() => router.push(route as any), 300);
    } else if (key === 'about') {
      // Handle about modal or navigation
      console.log('About pressed');
    }
  };

  const handleBackdropPress = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleBackdropPress}
          accessibilityLabel="Close navigation drawer"
        >
          <View />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Drawer Header */}
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.accent]}
            style={styles.drawerHeader}
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🎯</Text>
            </View>
            <Text style={styles.appName}>SilentZone</Text>
            <Text style={styles.appTagline}>Smart Auto-Silent App</Text>
            <View style={styles.modeIndicator}>
              <Text style={styles.modeText}>🔇 Silent Mode Active</Text>
            </View>
          </LinearGradient>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder
                ]}
                onPress={() => handleMenuPress(item.route, item.key)}
                accessibilityLabel={`Navigate to ${item.label}`}
                accessibilityRole="button"
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton}>
              <Text style={styles.footerButtonText}>Rate this App</Text>
            </TouchableOpacity>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: drawerWidth,
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 16,
  },
  drawerHeader: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoIcon: {
    fontSize: 30,
  },
  appName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: 'bold',
    color: theme.colors.background,
    marginBottom: theme.spacing.xs,
  },
  appTagline: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.background + 'E0',
    marginBottom: theme.spacing.md,
  },
  modeIndicator: {
    backgroundColor: theme.colors.background + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  modeText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.background,
    fontWeight: 'medium',
  },
  menuContainer: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuIcon: {
    fontSize: theme.typography.sizes.xl,
    width: 24,
    textAlign: 'center',
  },
  menuLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    fontWeight: 'medium',
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  menuChevron: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.muted,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  footerButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  footerButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.sm,
    fontWeight: 'medium',
  },
  versionText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
  },
});

export default NavigationDrawer;