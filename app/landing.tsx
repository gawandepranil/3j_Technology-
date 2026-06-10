import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  Easing,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const STATS = [
  { value: '500+', label: 'Projects Delivered', icon: 'rocket-outline' as const },
  { value: '10+', label: 'Years Experience', icon: 'time-outline' as const },
  { value: '150+', label: 'Happy Clients', icon: 'checkmark-circle-outline' as const },
  { value: '24/7', label: 'Support Available', icon: 'headset-outline' as const },
];

const SOLUTIONS = [
  { title: 'AI & Automation', text: 'Smart workflows, predictive insights, and intelligent copilots built for real business impact.', icon: 'sparkles-outline' as const },
  { title: 'Cloud & Security', text: 'Scalable cloud platforms and secure architectures designed for resilience and growth.', icon: 'cloud-outline' as const },
  { title: 'IoT & Connectivity', text: 'Connected experiences and device ecosystems that improve operations and visibility.', icon: 'hardware-chip-outline' as const },
];

const VALUES = [
  { title: 'Innovation', text: 'We build with the newest tools and future-ready thinking.', icon: 'flame-outline' as const },
  { title: 'Excellence', text: 'Quality, speed, and precision drive every delivery.', icon: 'diamond-outline' as const },
  { title: 'Partnership', text: 'We work as an extension of your team from idea to launch.', icon: 'people-outline' as const },
];

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const glow1Anim = useRef(new Animated.Value(0.3)).current;
  const glow2Anim = useRef(new Animated.Value(0.2)).current;

  // Floating decoration animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse glows
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow1Anim, { toValue: 0.6, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glow1Anim, { toValue: 0.3, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow2Anim, { toValue: 0.5, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glow2Anim, { toValue: 0.2, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // Floating icons
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, { toValue: 12, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim1, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, { toValue: -15, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim2, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const navItems = ['Services', 'Mission', 'Vision', 'Why Us', 'Contact'];

  return (
    <View style={styles.root}>
      {/* ── Background Grid & Glowing Blobs ── */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.gridBackground} />
        <Animated.View style={[styles.glowBlob, styles.glowBlob1, { opacity: glow1Anim }]} />
        <Animated.View style={[styles.glowBlob, styles.glowBlob2, { opacity: glow2Anim }]} />
      </View>

      {/* ── Navbar ── */}
      <View style={[styles.navbar, { paddingTop: insets.top + 12 }]}>
        {/* Left Logo */}
        <TouchableOpacity 
          style={styles.logoRow} 
          onPress={() => router.replace('/landing')} 
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#3b82f6', '#22d3ee']} style={styles.logoBox}>
            <Text style={styles.logoText}>3JL</Text>
          </LinearGradient>
          <View>
            <Text style={styles.brandName}>3JL Technologies</Text>
            <Text style={styles.brandSub}>AI · Cloud · IoT · Cybersecurity</Text>
          </View>
        </TouchableOpacity>

        {/* Center Links (Web only) */}
        {Platform.OS === 'web' && (
          <View style={styles.navLinks}>
            {navItems.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.navLink} activeOpacity={0.7}>
                <Text style={styles.navLinkText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Right Button */}
        <View style={styles.navRight}>
          <TouchableOpacity 
            style={styles.bookCallBtn} 
            onPress={() => router.push('/(client)/contact' as any)}
            activeOpacity={0.85}
          >
            <LinearGradient 
              colors={['#0056cc', '#eab308']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={styles.bookCallGrad}
            >
              <Text style={styles.bookCallText}>Book a Call</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Mobile hamburger menu */}
          {Platform.OS !== 'web' && (
            <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.hamburger}>
              <Ionicons name="menu" size={24} color="#f8fafc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Main Scroll View ── */}
      <ScrollView 
        contentContainerStyle={[styles.mainScroll, { paddingBottom: insets.bottom + 80 }]} 
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.contentLayout, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* Floating icons around the hero text (Desktop web only) */}
          {Platform.OS === 'web' && (
            <>
              <Animated.View style={[styles.floatingIconBox, styles.floatIcon1, { transform: [{ translateY: floatAnim1 }] }]}>
                <Ionicons name="logo-react" size={28} color="#00d2ff" />
              </Animated.View>
              <Animated.View style={[styles.floatingIconBox, styles.floatIcon2, { transform: [{ translateY: floatAnim2 }] }]}>
                <Ionicons name="cloud-outline" size={26} color="#3b82f6" />
              </Animated.View>
              <Animated.View style={[styles.floatingIconBox, styles.floatIcon3, { transform: [{ translateY: floatAnim1 }] }]}>
                <Ionicons name="hardware-chip-outline" size={24} color="#00d2ff" />
              </Animated.View>
            </>
          )}

          {/* Welcome badge */}
          <View style={styles.taglineBadge}>
            <Ionicons name="sparkles" size={14} color="#00d2ff" />
            <Text style={styles.taglineBadgeText}>Trusted technology partner for ambitious teams</Text>
          </View>

          {/* Main Headline & Subheadline */}
          <View style={styles.heroTextSection}>
            <Text style={styles.headline}>
              AI, Cloud, IoT & Cybersecurity{'\n'}
              <Text style={styles.headlineBlue}>Solutions for Modern Businesses</Text>
            </Text>
            <Text style={styles.subheadline}>
              We help companies modernize operations, launch intelligent products, and protect critical systems with secure, scalable technology built for measurable growth.
            </Text>
          </View>

          {/* CTA Buttons */}
          <View style={styles.ctaRow}>
            <TouchableOpacity 
              style={styles.btnPrimary} 
              onPress={() => router.replace('/(auth)/login')}
              activeOpacity={0.85}
            >
              <LinearGradient 
                colors={['#0056cc', '#eab308']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.btnPrimaryGrad}
              >
                <Text style={styles.btnPrimaryText}>Book a Consultation</Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.btnSecondary} 
              onPress={() => router.replace('/(auth)/login')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSecondaryText}>Explore Services</Text>
            </TouchableOpacity>
          </View>

          {/* Company Statistics (First Fold) */}
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              {STATS.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
                    style={styles.statCardGrad}
                  >
                    <View style={styles.statIconBox}>
                      <Ionicons name={stat.icon} size={22} color="#00d2ff" />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>

          {/* Solutions section */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionEyebrow}>WHAT WE BUILD</Text>
              <Text style={styles.sectionTitle}>Technology solutions that move your business forward</Text>
              <Text style={styles.sectionText}>From strategy to implementation, we help ambitious teams launch secure products faster with measurable results.</Text>
            </View>
            <View style={styles.solutionGrid}>
              {SOLUTIONS.map((item, index) => (
                <View key={index} style={styles.solutionCard}>
                  <View style={styles.solutionIconBox}>
                    <Ionicons name={item.icon} size={22} color="#00d2ff" />
                  </View>
                  <Text style={styles.solutionTitle}>{item.title}</Text>
                  <Text style={styles.solutionText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Values section */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionEyebrow}>WHY CHOOSE US</Text>
              <Text style={styles.sectionTitle}>Built on trust, clarity, and engineering excellence</Text>
            </View>
            <View style={styles.valueGrid}>
              {VALUES.map((item, index) => (
                <View key={index} style={styles.valueCard}>
                  <View style={styles.solutionIconBox}>
                    <Ionicons name={item.icon} size={20} color="#eab308" />
                  </View>
                  <Text style={styles.solutionTitle}>{item.title}</Text>
                  <Text style={styles.solutionText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* CTA panel */}
          <LinearGradient
            colors={['rgba(0, 88, 219, 0.16)', 'rgba(5, 11, 24, 0.96)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaPanel}
          >
            <View style={styles.ctaContent}>
              <Text style={styles.sectionEyebrow}>READY TO WORK TOGETHER?</Text>
              <Text style={styles.sectionTitle}>Let’s turn your next idea into a confident digital launch.</Text>
              <Text style={styles.sectionText}>Tell us what you need, and we’ll shape the right roadmap for your team.</Text>
            </View>
            <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/(client)/contact' as any)} activeOpacity={0.85}>
              <LinearGradient colors={['#0056cc', '#eab308']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaButtonGrad}>
                <Text style={styles.ctaButtonText}>Start Your Project</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>

        </Animated.View>
      </ScrollView>

      {/* Mobile Drawer Menu */}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <TouchableOpacity style={styles.menuOverlay} onPress={() => setMenuOpen(false)} activeOpacity={1}>
          <View style={[styles.menuPanel, { paddingTop: insets.top + 16 }]}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Navigation</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Ionicons name="close" size={24} color="#f8fafc" />
              </TouchableOpacity>
            </View>
            {navItems.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.menuItem} onPress={() => setMenuOpen(false)}>
                <Text style={styles.menuText}>{item}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.menuSignIn}
              onPress={() => { setMenuOpen(false); router.replace('/(auth)/login'); }}
            >
              <Text style={styles.menuSignInText}>Client Portal →</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#050B18', 
    overflow: 'hidden',
  },

  // Grid background pattern
  gridBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.05,
    ...Platform.select({
      web: {
        backgroundImage: 'radial-gradient(circle, #00d2ff 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      },
    }),
  },

  // Glowing background blobs
  glowBlob: {
    position: 'absolute',
    borderRadius: 500,
    filter: 'blur(120px)',
    ...Platform.select({
      web: {
        filter: 'blur(130px)',
      },
    }),
  },
  glowBlob1: {
    top: -100,
    left: '10%',
    width: SCREEN_W * 0.5,
    height: SCREEN_W * 0.5,
    backgroundColor: '#00d2ff',
  },
  glowBlob2: {
    bottom: -150,
    right: '10%',
    width: SCREEN_W * 0.4,
    height: SCREEN_W * 0.4,
    backgroundColor: '#3b82f6',
  },

  // Navbar
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isWeb ? 48 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(5, 11, 24, 0.8)',
    backdropFilter: 'blur(12px)',
    zIndex: 1000,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
      },
    }),
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: {
    width: 36, height: 36, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 14, fontWeight: '900', color: '#050B18' },
  brandName: { fontSize: 16, fontWeight: '800', color: '#f8fafc' },
  brandSub: { fontSize: 10, color: '#00d2ff', fontWeight: '700', letterSpacing: 0.5 },

  navLinks: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  navLink: { paddingHorizontal: 16, paddingVertical: 8 },
  navLinkText: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },

  navRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bookCallBtn: { borderRadius: 100, overflow: 'hidden' },
  bookCallGrad: { paddingHorizontal: 18, paddingVertical: 9 },
  bookCallText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  hamburger: { padding: 4, marginLeft: 6 },

  // Scroll content
  mainScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 30,
  },

  contentLayout: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    position: 'relative',
  },

  // Floating decorative icons
  floatingIconBox: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(5, 11, 24, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    shadowColor: '#00d2ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  floatIcon1: { top: '8%', left: '4%' },
  floatIcon2: { top: '35%', right: '2%' },
  floatIcon3: { bottom: '38%', left: '6%' },

  // Welcome Tagline Badge
  taglineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 210, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    marginBottom: 20,
    gap: 8,
  },
  taglineBadgeText: { color: '#00d2ff', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },

  // Hero section
  heroTextSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  headline: {
    fontSize: isWeb ? 54 : 32,
    fontWeight: '900',
    color: '#f8fafc',
    textAlign: 'center',
    lineHeight: isWeb ? 66 : 42,
    letterSpacing: -1,
    marginBottom: 20,
  },
  headlineBlue: {
    color: '#eab308', // Gold Accent for "Breakthrough Products" matching your screenshot
  },
  subheadline: {
    fontSize: isWeb ? 17 : 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 750,
  },

  // CTA buttons
  ctaRow: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: 16,
    width: isWeb ? 'auto' : '100%',
    justifyContent: 'center',
    marginBottom: 56,
  },
  btnPrimary: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#0056cc',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    width: isWeb ? 'auto' : '100%',
  },
  btnPrimaryGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 15,
    gap: 8,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  btnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: isWeb ? 'auto' : '100%',
  },
  btnSecondaryText: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '600',
  },

  // Statistics Grid
  statsContainer: {
    width: '100%',
    paddingHorizontal: isWeb ? 20 : 0,
    marginBottom: 60,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: isWeb ? 220 : SCREEN_W > 600 ? '45%' : '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    shadowColor: '#00d2ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    ...Platform.select({
      web: {
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        cursor: 'pointer',
        ':hover': {
          transform: 'translateY(-5px)',
          borderColor: 'rgba(0, 210, 255, 0.3)',
        },
      },
    }),
  },
  statCardGrad: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 210, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f8fafc',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },

  // New corporate sections
  sectionBlock: {
    width: '100%',
    marginBottom: 32,
    paddingTop: 8,
  },
  sectionHeading: {
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionEyebrow: {
    fontSize: 11,
    color: '#00d2ff',
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: isWeb ? 28 : 22,
    fontWeight: '800',
    color: '#f8fafc',
    textAlign: 'center',
    lineHeight: isWeb ? 36 : 30,
    maxWidth: 820,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: isWeb ? 15 : 14,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 760,
  },
  solutionGrid: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: 16,
  },
  valueGrid: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: 16,
  },
  solutionCard: {
    flex: 1,
    minWidth: isWeb ? 220 : '100%',
    backgroundColor: 'rgba(7, 15, 30, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    borderRadius: 18,
    padding: 18,
  },
  valueCard: {
    flex: 1,
    minWidth: isWeb ? 220 : '100%',
    backgroundColor: 'rgba(9, 18, 35, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.14)',
    borderRadius: 18,
    padding: 18,
  },
  solutionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 210, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  solutionTitle: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  solutionText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
  ctaPanel: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    backgroundColor: 'linear-gradient(135deg, rgba(0, 88, 219, 0.16), rgba(5, 11, 24, 0.95))',
    padding: 18,
    marginBottom: 40,
    alignItems: 'center',
  },
  ctaContent: {
    alignItems: 'center',
    marginBottom: 14,
  },
  ctaButton: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  ctaButtonGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Mobile menu drawer
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  menuPanel: {
    backgroundColor: '#050B18',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 24,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  menuItem: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  menuText: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '500',
  },
  menuSignIn: {
    margin: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 210, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.15)',
    padding: 14,
    alignItems: 'center',
  },
  menuSignInText: {
    color: '#00d2ff',
    fontSize: 15,
    fontWeight: '700',
  },
});
