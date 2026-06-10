import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WHY_US = [
  {
    icon: 'person-outline' as const,
    title: "Owner's Mindset",
    color: '#eab308',
    desc: "Every team member operates with an owner's mindset. We take full responsibility and work relentlessly to solve problems, not just manage them.",
  },
  {
    icon: 'flash-outline' as const,
    title: 'No Bureaucracy',
    color: '#3b82f6',
    desc: "We don't hide behind layers of bureaucracy or push problems around. We operate with startup agility, making decisions quickly and executing relentlessly.",
  },
  {
    icon: 'hammer-outline' as const,
    title: 'Hands-On Execution',
    color: '#10b981',
    desc: 'We think like founders and work alongside you. Our deep technical expertise combined with hands-on involvement ensures your vision becomes reality.',
  },
  {
    icon: 'trending-up-outline' as const,
    title: 'Results-Driven',
    color: '#f97316',
    desc: 'We measure success by your success. Every project is approached with a laser focus on delivering tangible, measurable business outcomes.',
  },
];

const DIFFERENTIATORS = [
  { icon: 'shield-checkmark-outline' as const, text: 'Free consultation' },
  { icon: 'close-circle-outline' as const, text: 'No commitment required' },
  { icon: 'star-outline' as const, text: 'Expert technical guidance' },
  { icon: 'checkmark-circle-outline' as const, text: 'Actionable insights' },
];

function WhyCard({ item, index }: { item: typeof WHY_US[0]; index: number }) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, delay: 100 + index * 100, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 500, delay: 100 + index * 100, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.whyCard, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <LinearGradient colors={['#0d1525', '#0a0f1d']} style={styles.whyCardInner}>
        <View style={styles.whyCardTop}>
          <View style={[styles.whyIconBox, { backgroundColor: item.color + '18', borderColor: item.color + '30' }]}>
            <Ionicons name={item.icon} size={22} color={item.color} />
          </View>
          <View style={[styles.whyNumberBadge, { backgroundColor: item.color + '15' }]}>
            <Text style={[styles.whyNumber, { color: item.color }]}>0{index + 1}</Text>
          </View>
        </View>
        <Text style={styles.whyTitle}>{item.title}</Text>
        <Text style={styles.whyDesc}>{item.desc}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

export default function WhyUsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#030712', '#050c1a']} style={StyleSheet.absoluteFill} />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(client)/dashboard')} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Why Choose Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <Animated.View style={[styles.hero, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <View style={styles.eyebrowBadge}>
            <Ionicons name="star" size={12} color="#eab308" />
            <Text style={styles.eyebrowText}>WHY CHOOSE US</Text>
          </View>
          <Text style={styles.heroTitle}>Built by Founders,{'\n'}
            <Text style={styles.heroAccent}>Driven by Ownership</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            At 3J Technologies, we don't just build solutions, we solve problems. As a startup ourselves, we are agile, ownership-driven, and hyper-focused on delivering real value.
          </Text>
        </Animated.View>

        {/* Cards */}
        <View style={styles.cardsGrid}>
          {WHY_US.map((item, i) => (
            <WhyCard key={item.title} item={item} index={i} />
          ))}
        </View>

        {/* Differentiators Row */}
        <View style={styles.diffRow}>
          {DIFFERENTIATORS.map((d) => (
            <View key={d.text} style={styles.diffItem}>
              <Ionicons name={d.icon} size={16} color="#eab308" />
              <Text style={styles.diffText}>{d.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <LinearGradient colors={['#1a0f00', '#0f172a']} style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Start the Conversation</Text>
            <Text style={styles.ctaSub}>
              Book a free 30-minute consultation with our founder and see the difference firsthand.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(client)/contact' as any)}
              activeOpacity={0.85}
              style={{ borderRadius: 12, overflow: 'hidden' }}
            >
              <LinearGradient colors={['#eab308', '#f97316']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaBtn}>
                <Ionicons name="calendar-outline" size={16} color="#030712" />
                <Text style={styles.ctaBtnText}>Book a Free Call</Text>
                <Ionicons name="arrow-forward" size={16} color="#030712" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#030712' },
  scroll: { paddingBottom: 80 },

  glowTop: {
    position: 'absolute', top: -60, right: -80,
    width: 250, height: 250, borderRadius: 125,
    backgroundColor: '#eab308', opacity: 0.05,
  },
  glowBottom: {
    position: 'absolute', bottom: 150, left: -80,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#10b981', opacity: 0.04,
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

  hero: { paddingHorizontal: 20, paddingTop: 36, paddingBottom: 28 },
  eyebrowBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#eab30812', borderWidth: 1, borderColor: '#eab30830',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100,
    alignSelf: 'flex-start', marginBottom: 16,
  },
  eyebrowText: { fontSize: 10, color: '#eab308', fontWeight: '700', letterSpacing: 1.5 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#f8fafc', lineHeight: 36, marginBottom: 12 },
  heroAccent: { color: '#eab308' },
  heroSubtitle: { fontSize: 14, color: '#64748b', lineHeight: 22 },

  cardsGrid: { paddingHorizontal: 16, gap: 14, marginBottom: 24 },
  whyCard: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  whyCardInner: { padding: 22 },
  whyCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  whyIconBox: {
    width: 48, height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  whyNumberBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  whyNumber: { fontSize: 16, fontWeight: '800' },
  whyTitle: { fontSize: 16, fontWeight: '700', color: '#f8fafc', marginBottom: 8 },
  whyDesc: { fontSize: 13, color: '#64748b', lineHeight: 21 },

  diffRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16, marginBottom: 28 },
  diffItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#0d1525', borderWidth: 1, borderColor: '#1e293b',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100,
  },
  diffText: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },

  ctaSection: { marginHorizontal: 16 },
  ctaCard: { borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#2e1f05', gap: 12 },
  ctaTitle: { fontSize: 18, fontWeight: '800', color: '#f8fafc' },
  ctaSub: { fontSize: 13, color: '#94a3b8', lineHeight: 20 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 15, gap: 8,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '700', color: '#030712' },
});
