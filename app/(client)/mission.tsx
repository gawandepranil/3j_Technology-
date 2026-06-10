import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VISION_BARS = [
  { label: 'Startup-Focused', value: 100 },
  { label: 'Innovation-Driven', value: 100 },
  { label: 'Client Success Rate', value: 98 },
];

export default function MissionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const fade = useRef(new Animated.Value(0)).current;
  const slideLeft = useRef(new Animated.Value(-30)).current;
  const slideRight = useRef(new Animated.Value(30)).current;
  const barWidths = VISION_BARS.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideLeft, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideRight, { toValue: 0, duration: 700, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    // Animate progress bars (non-native — width cannot use native driver)
    VISION_BARS.forEach((bar, i) => {
      Animated.timing(barWidths[i], {
        toValue: bar.value,
        duration: 900,
        delay: 400 + i * 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#030712', '#050c1a']} style={StyleSheet.absoluteFill} />

      {/* Glow */}
      <View style={styles.glowLeft} />
      <View style={styles.glowRight} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(client)/dashboard')} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mission & Vision</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── MISSION ── */}
        <Animated.View style={[styles.section, { opacity: fade, transform: [{ translateX: slideLeft }] }]}>
          <View style={styles.sectionTag}>
            <View style={styles.sectionTagIcon}>
              <Ionicons name="rocket-outline" size={18} color="#eab308" />
            </View>
            <Text style={styles.sectionTagText}>OUR MISSION</Text>
          </View>

          <Text style={styles.sectionTitle}>Empowering Innovation,{'\n'}
            <Text style={styles.accentText}>Shaping the Future</Text>
          </Text>

          <Text style={styles.sectionBody}>
            At 3J Technologies, we exist to empower people and organizations by solving their toughest technical challenges, making the world a better place through meaningful, impactful technology.
          </Text>

          {/* Highlight card */}
          <View style={styles.highlightCard}>
            <LinearGradient colors={['#eab30820', '#f9731608']} style={styles.highlightCardInner}>
              <View style={styles.highlightIconBox}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#eab308" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.highlightTitle}>Technical Excellence</Text>
                <Text style={styles.highlightBody}>
                  Deep expertise across emerging technologies and proven execution frameworks.
                </Text>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <LinearGradient colors={['#eab308', '#f97316']} style={styles.dividerDot} />
          <View style={styles.dividerLine} />
        </View>

        {/* ── VISION ── */}
        <Animated.View style={[styles.section, { opacity: fade, transform: [{ translateX: slideRight }] }]}>
          <View style={styles.sectionTag}>
            <View style={[styles.sectionTagIcon, { backgroundColor: '#3b82f620', borderColor: '#3b82f630' }]}>
              <Ionicons name="eye-outline" size={18} color="#3b82f6" />
            </View>
            <Text style={[styles.sectionTagText, { color: '#3b82f6' }]}>OUR VISION</Text>
          </View>

          <Text style={styles.sectionTitle}>From Bold Ideas to{'\n'}
            <Text style={styles.accentText}>Breakthrough Products</Text>
          </Text>

          <Text style={styles.sectionBody}>
            We aspire to be the trusted technical partner to startups worldwide, turning bold concepts into reality with deep tech expertise and purpose-driven innovation.
          </Text>

          {/* Progress bars */}
          <View style={styles.progressSection}>
            {VISION_BARS.map((bar, i) => (
              <View key={bar.label} style={styles.progressItem}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>{bar.label}</Text>
                  <Text style={styles.progressValue}>{bar.value}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: barWidths[i].interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={['#eab308', '#f97316']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFill}
                    />
                  </Animated.View>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Bottom quote */}
        <View style={styles.quoteCard}>
          <LinearGradient colors={['#0f172a', '#0d1525']} style={styles.quoteCardInner}>
            <FontAwesome name="quote-left" size={28} color="#eab30840" style={{ marginBottom: 12 }} />
            <Text style={styles.quoteText}>
              "We don't just build products, we build partnerships. Every project is a commitment to excellence and a shared journey toward success."
            </Text>
            <Text style={styles.quoteAuthor}>— Ashlesha Shinde, Founder</Text>
          </LinearGradient>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#030712' },
  scroll: { paddingBottom: 80 },

  glowLeft: {
    position: 'absolute', top: 100, left: -120,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: '#eab308', opacity: 0.04,
  },
  glowRight: {
    position: 'absolute', bottom: 200, right: -100,
    width: 250, height: 250, borderRadius: 125,
    backgroundColor: '#3b82f6', opacity: 0.04,
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

  section: { paddingHorizontal: 20, paddingTop: 36, paddingBottom: 24 },
  sectionTag: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  sectionTagIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#eab30818', borderWidth: 1, borderColor: '#eab30830',
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTagText: { fontSize: 11, color: '#eab308', fontWeight: '700', letterSpacing: 2 },
  sectionTitle: { fontSize: 27, fontWeight: '800', color: '#f8fafc', lineHeight: 35, marginBottom: 14 },
  accentText: { color: '#eab308' },
  sectionBody: { fontSize: 14, color: '#64748b', lineHeight: 23, marginBottom: 20 },

  highlightCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eab30825' },
  highlightCardInner: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 18 },
  highlightIconBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#eab30818', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#eab30830', flexShrink: 0,
  },
  highlightTitle: { fontSize: 14, fontWeight: '700', color: '#f8fafc', marginBottom: 4 },
  highlightBody: { fontSize: 12, color: '#64748b', lineHeight: 19 },

  divider: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#1e293b' },
  dividerDot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 12 },

  progressSection: { gap: 16 },
  progressItem: {},
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, color: '#94a3b8' },
  progressValue: { fontSize: 13, fontWeight: '700', color: '#f8fafc' },
  progressTrack: { height: 6, backgroundColor: '#1e293b', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3, overflow: 'hidden' },

  quoteCard: { marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b', marginTop: 8 },
  quoteCardInner: { padding: 24 },
  quoteText: { fontSize: 15, color: '#94a3b8', fontStyle: 'italic', lineHeight: 24, marginBottom: 14 },
  quoteAuthor: { fontSize: 12, color: '#eab308', fontWeight: '700' },
});
