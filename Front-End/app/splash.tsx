import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../components/ui/theme";

// Create styles outside component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  iconContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    width: 80,
    height: 80,
  },
  appTitle: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes['4xl'],
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  statusContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.neutral.light,
    fontSize: theme.typography.sizes.lg,
    fontWeight: '500',
    marginTop: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.warning,
    fontSize: theme.typography.sizes.lg,
    fontWeight: '500',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.base,
    fontWeight: 'semibold',
  },
  footer: {
    position: 'absolute',
    bottom: theme.spacing['2xl'],
  },
  footerText: {
    color: theme.colors.neutral.light,
    fontSize: theme.typography.sizes.sm,
  },
  heartIcon: {
    color: theme.colors.error,
    fontWeight: '600',
  },
});

const { width } = Dimensions.get('window');

const SplashScreen = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [initializationStep, setInitializationStep] = useState('Checking permissions...');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate initialization checks with progress updates
        setInitializationStep('Checking permissions...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setInitializationStep('Loading zones...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setInitializationStep('Initializing location services...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if permissions were previously denied
        const permissionsPreviouslyDenied = false; // Mock check - in real app, check AsyncStorage

        if (permissionsPreviouslyDenied) {
          // Show brief message then navigate to permissions
          setTimeout(() => {
            router.replace("/permissions");
          }, 500);
        } else {
          // Navigate to main app (onboarding for new users, tabs for returning users)
          router.replace("/onboarding");
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setHasError(true);
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setIsInitializing(true);
    // Retry initialization
    setTimeout(() => {
      setHasError(false);
      router.replace("/onboarding");
    }, 1000);
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.neutral.dark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* App Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.icon}
            resizeMode="contain"
            accessibilityLabel="SilentZone app icon"
          />
        </View>

        {/* App Title */}
        <Text style={styles.appTitle}>
          SilentZone
        </Text>

        {/* Activity Indicator or Error State */}
        {hasError ? (
          <View style={styles.statusContainer}>
            <Text style={styles.errorText}>⚠️ Location services disabled</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <ActivityIndicator
              size="large"
              color={theme.colors.neutral.light}
              accessibilityLabel="Loading application"
            />
            <Text style={styles.loadingText}>
              {initializationStep}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with <Text style={styles.heartIcon}>❤️</Text> by Orion
        </Text>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;
