import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SERVICES = [
  {
    icon: 'globe-outline' as const,
    title: 'Custom Web Platforms',
    color: '#3b82f6',
    desc: 'We craft bespoke web experiences that scale with your ambitions, not cookie-cutter templates.',
  },
  {
    icon: 'phone-portrait-outline' as const,
    title: 'Mobile-First Products',
    color: '#8b5cf6',
    desc: 'Launch on both platforms simultaneously with apps built for speed, offline resilience, and delight.',
  },
  {
    icon: 'server-outline' as const,
    title: 'Scalable Backends',
    color: '#10b981',
    desc: 'From zero to millions of users, we engineer backend systems that never become your bottleneck.',
  },
  {
    icon: 'cloud-outline' as const,
    title: 'Cloud Infrastructure',
    color: '#eab308',
    desc: 'Deploy with confidence using battle-tested infrastructure that auto-scales and self-heals.',
  },
  {
    icon: 'sparkles-outline' as const,
    title: 'AI-Powered Features',
    color: '#f97316',
    desc: 'Embed intelligence into your product with practical AI that solves real user problems.',
  },
  {
    icon: 'bulb-outline' as const,
    title: 'Startup Advisory',
    color: '#06b6d4',
    desc: 'Get founder-to-founder guidance on technical decisions that could make or break your venture.',
  },
];

const STATS = [
  { value: '5+', label: 'Projects Delivered' },
  { value: '12+', label: 'Years Experience' },
  { value: '100%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'Support Available' },
];

function ServiceCard({ service, delay }: { service: typeof SERVICES[0]; delay: number }) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 500, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.serviceCard, { opacity: fade, transform: [{ translateY: slide }], borderColor: service.color + '28' }]}>
      <View style={[styles.serviceIconBox, { backgroundColor: service.color + '18', borderColor: service.color + '35' }]}>
        <Ionicons name={service.icon} size={26} color={service.color} />
      </View>
      <Text style={styles.serviceTitle}>{service.title}</Text>
      <Text style={styles.serviceDesc}>{service.desc}</Text>
    </Animated.View>
  );
}

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#030712', '#050c1a', '#070b13']} style={StyleSheet.absoluteFill} />

      {/* Ambient glows */}
      <View style={styles.glowTopRight} />
      <View style={styles.glowBottomLeft} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(client)/dashboard')} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <Animated.View style={[styles.hero, { opacity: headerFade }]}>
          <View style={styles.eyebrowBadge}>
            <Ionicons name="construct-outline" size={13} color="#eab308" />
            <Text style={styles.eyebrowText}>WHAT WE BUILD</Text>
          </View>
          <Text style={styles.heroTitle}>Engineering Excellence,{'\n'}
            <Text style={styles.heroTitleAccent}>Delivered</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            From idea to production — we cover the full spectrum of modern software engineering with deep expertise and relentless execution.
          </Text>
        </Animated.View>

        {/* Services Grid */}
        <View style={styles.grid}>
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} service={s} delay={100 + i * 80} />
          ))}
        </View>

        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <LinearGradient colors={['#0f172a', '#0d1525']} style={styles.statsBannerInner}>
            <Text style={styles.statsBannerLabel}>Trusted by startups worldwide</Text>
            <View style={styles.statsRow}>
              {STATS.map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Build Something?</Text>
          <Text style={styles.ctaSubtitle}>Let's discuss your vision. Book a free 30-min consultation.</Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push('/(client)/contact' as any)}
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#eab308', '#f97316']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaBtnGrad}>
              <Ionicons name="calendar-outline" size={16} color="#030712" />
              <Text style={styles.ctaBtnText}>Book a Consultation</Text>
              <Ionicons name="arrow-forward" size={16} color="#030712" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#030712' },
  scroll: { paddingBottom: 80 },

  glowTopRight: {
    position: 'absolute', top: -80, right: -80,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: '#3b82f6', opacity: 0.05,
  },
  glowBottomLeft: {
    position: 'absolute', bottom: 200, left: -100,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: '#eab308', opacity: 0.04,
  },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#1e293b', backgroundColor: '#030712',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#1e293b',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#f8fafc' },

  hero: { paddingHorizontal: 24, paddingTop: 36, paddingBottom: 28 },
  eyebrowBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#eab30812', borderWidth: 1, borderColor: '#eab30830',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100,
    alignSelf: 'flex-start', marginBottom: 16,
  },
  eyebrowText: { fontSize: 11, color: '#eab308', fontWeight: '700', letterSpacing: 1.5 },
  heroTitle: { fontSize: 30, fontWeight: '800', color: '#f8fafc', lineHeight: 38, marginBottom: 12 },
  heroTitleAccent: { color: '#eab308' },
  heroSubtitle: { fontSize: 14, color: '#64748b', lineHeight: 22 },

  grid: { paddingHorizontal: 16, gap: 14, marginBottom: 28 },
  serviceCard: {
    backgroundColor: '#0d1525', borderRadius: 18, borderWidth: 1, padding: 22,
  },
  serviceIconBox: {
    width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, marginBottom: 16,
  },
  serviceTitle: { fontSize: 16, fontWeight: '700', color: '#f8fafc', marginBottom: 8 },
  serviceDesc: { fontSize: 13, color: '#64748b', lineHeight: 21 },

  statsBanner: { marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b', marginBottom: 28 },
  statsBannerInner: { padding: 24 },
  statsBannerLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600', textAlign: 'center', marginBottom: 20, letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#eab308', marginBottom: 4 },
  statLabel: { fontSize: 10, color: '#6B7280', textAlign: 'center', fontWeight: '500' },

  ctaSection: { marginHorizontal: 16, alignItems: 'center', gap: 8 },
  ctaTitle: { fontSize: 20, fontWeight: '800', color: '#f8fafc', textAlign: 'center' },
  ctaSubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 8 },
  ctaBtn: { borderRadius: 14, overflow: 'hidden', width: '100%' },
  ctaBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, gap: 8,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '700', color: '#030712' },
});
