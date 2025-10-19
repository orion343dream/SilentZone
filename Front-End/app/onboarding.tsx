import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../components/ui/theme";

// Create styles outside component
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: theme.spacing.xl,
  },
  skipButton: {
    padding: theme.spacing.sm,
  },
  skipText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.base,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: width,
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl * 1.5,
    paddingBottom: theme.spacing.xl * 1.5,
    justifyContent: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  illustration: {
    fontSize: 120,
    marginBottom: theme.spacing.md,
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: 'medium',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.sizes.lg,
    lineHeight: 24,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  bulletsContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  bulletDot: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
    width: 16,
  },
  bulletText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: theme.spacing.xs,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
  },
  dotInactive: {
    backgroundColor: theme.colors.neutral.light,
  },
  ctaButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.lg,
    fontWeight: 'semibold',
  },
});

const OnboardingScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);

  const onboardingPages = [
    {
      title: "Welcome to SilentZone",
      subtitle: "Smart Auto-Silent Zones",
      description: "Automatically silence your device when you enter predefined locations like libraries, schools, or churches.",
      illustration: "📍🔔",
      bullets: [
        "Create custom silent zones",
        "Automatic mode switching",
        "Works in background"
      ]
    },
    {
      title: "How it Works",
      subtitle: "Location-Based Silence",
      description: "Our app uses GPS to detect when you enter or leave silent zones. It automatically activates silent mode and restores your previous settings when you leave.",
      illustration: "🗺️🔇",
      bullets: [
        "GPS-based zone detection",
        "Smart mode switching",
        "Battery optimized"
      ]
    },
    {
      title: "Privacy & Permissions",
      subtitle: "Your Privacy Matters",
      description: "We only use location data to provide automatic silent zones. All data stays on your device and is never shared.",
      illustration: "🔒✅",
      bullets: [
        "Location data stays local",
        "No data collection",
        "Transparent permissions"
      ]
    },
    {
      title: "Get Started",
      subtitle: "Ready to Begin",
      description: "You're all set! Let's set up your first silent zone and start enjoying automatic device silencing.",
      illustration: "🚀✨",
      bullets: [
        "Grant necessary permissions",
        "Create your first zone",
        "Enjoy automatic silencing"
      ]
    }
  ];

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const page = Math.round(scrollPosition / width);
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({ x: nextPage * width, animated: true });
    } else {
      // Navigate to permissions flow
      router.replace("/permissions");
    }
  };

  const handleSkip = () => {
    router.replace("/permissions");
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingPages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentPage ? styles.dotActive : styles.dotInactive
            ]}
          />
        ))}
      </View>
    );
  };

  const renderBullets = (bullets: string[]) => {
    return (
      <View style={styles.bulletsContainer}>
        {bullets.map((bullet, index) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{bullet}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.background]}
      style={styles.container}
    >
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Pager */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingPages.map((page, index) => (
          <View key={index} style={styles.page}>
            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <Text style={styles.illustration}>{page.illustration}</Text>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
              {/* Title */}
              <Text style={styles.title}>{page.title}</Text>

              {/* Subtitle */}
              <Text style={styles.subtitle}>{page.subtitle}</Text>

              {/* Description */}
              <Text style={styles.description}>{page.description}</Text>

              {/* Bullet Points */}
              {renderBullets(page.bullets)}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Dots Indicator */}
        {renderDots()}

        {/* CTA Button */}
        <TouchableOpacity onPress={handleNext} style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>
            {currentPage === onboardingPages.length - 1 ? "Start Using SilentZone" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default OnboardingScreen;