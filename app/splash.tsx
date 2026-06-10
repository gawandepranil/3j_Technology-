import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

const { width: SW, height: SH } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Animation refs
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale1 = useRef(new Animated.Value(0.5)).current;
  const ringOpacity1 = useRef(new Animated.Value(0)).current;
  const ringScale2 = useRef(new Animated.Value(0.5)).current;
  const ringOpacity2 = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(24)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const tagSlide = useRef(new Animated.Value(16)).current;
  const pillsOpacity = useRef(new Animated.Value(0)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Step 1: Rings pulse in
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 55,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity1, {
          toValue: 0.25,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(ringScale1, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Step 2: Second ring, text
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(ringOpacity2, {
          toValue: 0.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(ringScale2, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(textSlide, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, 400);

    // Step 3: Tagline + pills
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(tagOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(tagSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pillsOpacity, {
          toValue: 1,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);

    // Step 4: Navigate after 2.8s with fade-out
    const navTimer = setTimeout(() => {
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (isAuthenticated) {
          if (user?.role === 'client') {
            router.replace('/(client)/dashboard');
          } else {
            router.replace('/(internal)/dashboard');
          }
        } else {
          router.replace('/(auth)/login');
        }
      });
    }, 2800);

    return () => clearTimeout(navTimer);
  }, []);

  const PILLS = ['AI', 'Cloud', 'IoT', 'Mobile', 'Web'];

  return (
    <Animated.View style={[styles.root, { opacity: exitOpacity }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#030712', '#070b13', '#0a0f1d']}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient top glow */}
      <View style={styles.ambientTop} />
      <View style={styles.ambientBottom} />

      {/* Outer ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.ringOuter,
          {
            opacity: ringOpacity2,
            transform: [{ scale: ringScale2 }],
          },
        ]}
      />

      {/* Inner ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.ringInner,
          {
            opacity: ringOpacity1,
            transform: [{ scale: ringScale1 }],
          },
        ]}
      />

      {/* Logo badge */}
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <LinearGradient
          colors={['#eab308', '#f97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoBadge}
        >
          <Text style={styles.logoText}>3J</Text>
        </LinearGradient>
        {/* Shield checkmark overlay */}
        <View style={styles.shieldBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#fff" />
        </View>
      </Animated.View>

      {/* Brand name */}
      <Animated.Text
        style={[
          styles.brandName,
          {
            opacity: textOpacity,
            transform: [{ translateY: textSlide }],
          },
        ]}
      >
        3J Technologies
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: tagOpacity,
            transform: [{ translateY: tagSlide }],
          },
        ]}
      >
        Turning Bold Ideas Into{'\n'}
        <Text style={styles.taglineAccent}>Breakthrough Products</Text>
      </Animated.Text>

      {/* Tech pills */}
      <Animated.View style={[styles.pillsRow, { opacity: pillsOpacity }]}>
        {PILLS.map((p) => (
          <View key={p} style={styles.pill}>
            <Text style={styles.pillText}>{p}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Bottom loader bar */}
      <Animated.View style={[styles.loaderWrap, { opacity: tagOpacity }]}>
        <View style={styles.loaderTrack}>
          <AnimatedLoader />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// Animated progress bar
function AnimatedLoader() {
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: 1,
      duration: 2200,
      delay: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.loaderBar,
        {
          width: width.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#030712',
  },

  ambientTop: {
    position: 'absolute',
    top: -80,
    left: SW / 2 - 180,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: '#eab308',
    opacity: 0.07,
  },
  ambientBottom: {
    position: 'absolute',
    bottom: -100,
    right: SW / 2 - 160,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#f97316',
    opacity: 0.05,
  },

  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 9999,
  },
  ringOuter: {
    width: 260,
    height: 260,
    borderColor: '#eab308',
  },
  ringInner: {
    width: 190,
    height: 190,
    borderColor: '#f97316',
  },

  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#eab308',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
  logoText: {
    fontSize: 38,
    fontWeight: '900',
    color: '#030712',
    letterSpacing: -1,
  },
  shieldBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#030712',
  },

  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },

  tagline: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 40,
  },
  taglineAccent: {
    color: '#eab308',
    fontWeight: '700',
  },

  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 56,
    paddingHorizontal: 24,
  },
  pill: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#eab30830',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 100,
  },
  pillText: {
    color: '#eab308',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  loaderWrap: {
    position: 'absolute',
    bottom: 60,
    width: SW * 0.55,
    alignItems: 'center',
  },
  loaderTrack: {
    width: '100%',
    height: 3,
    backgroundColor: '#1e293b',
    borderRadius: 100,
    overflow: 'hidden',
  },
  loaderBar: {
    height: '100%',
    borderRadius: 100,
    backgroundColor: '#eab308',
  },
});
