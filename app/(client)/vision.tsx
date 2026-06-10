import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W } = Dimensions.get('window');

export default function VisionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#030712', '#050c1a', '#070b13']} style={StyleSheet.absoluteFill} />

      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(client)/dashboard')} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Vision</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.pageHero}>
          <Text style={styles.pageEyebrow}>WHERE WE'RE HEADING</Text>
          <Text style={styles.pageTitle}>Our <Text style={styles.accentText}>Vision</Text></Text>
          <Text style={styles.pageSubtitle}>To become the most trusted technology partner for the next generation of world-changing founders.</Text>
        </View>

        <View style={styles.visionContent}>
          <LinearGradient colors={['#0f0a1a', '#0f172a']} style={styles.visionBigCard}>
            <Ionicons name="eye-outline" size={40} color="#8b5cf6" />
            <Text style={styles.visionBigTitle}>The 3J World</Text>
            <Text style={styles.visionBigText}>
              We envision a world where geography, network, or capital no longer determine who gets to build great technology. A world where every bold idea has access to the engineering muscle it needs to become reality.
            </Text>
          </LinearGradient>

          <View style={styles.visionTimeline}>
            <Text style={styles.visionTimelineTitle}>Our Roadmap</Text>
            {[
              { year: '2024', title: 'Established Foundations', desc: 'Built our core team of engineers, designers, and advisors.' },
              { year: '2025', title: 'Scale & Expand', desc: 'Delivering AI-powered products and IoT solutions globally.' },
              { year: '2026', title: 'Platform Innovation', desc: 'Launching our proprietary development accelerator platform.' },
              { year: '2027+', title: 'Global Impact', desc: 'Becoming the go-to technical partner for 1000+ founders worldwide.' },
            ].map((item, i) => (
              <View key={i} style={styles.timelineItem}>
                <View style={styles.timelineDotCol}>
                  <LinearGradient colors={['#8b5cf6', '#eab308']} style={styles.timelineDot} />
                  {i < 3 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineYear}>{item.year}</Text>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#030712' },
  scroll: { paddingBottom: 60 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#030712',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },

  pageHero: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 24,
  },
  pageEyebrow: { fontSize: 11, color: '#eab308', fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  pageTitle: { fontSize: isWeb ? 42 : 28, fontWeight: '800', color: '#f8fafc', marginBottom: 12, letterSpacing: -0.5 },
  accentText: { color: '#eab308' },
  pageSubtitle: { fontSize: isWeb ? 17 : 14, color: '#94a3b8', lineHeight: 26 },

  visionContent: { paddingHorizontal: 20, gap: 24 },
  visionBigCard: {
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#2e1f3a',
    marginBottom: 8,
  },
  visionBigTitle: { fontSize: 22, fontWeight: '800', color: '#f8fafc', textAlign: 'center' },
  visionBigText: { fontSize: 14, color: '#94a3b8', lineHeight: 24, textAlign: 'center' },
  
  visionTimeline: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  visionTimelineTitle: { fontSize: 17, fontWeight: '700', color: '#f8fafc', marginBottom: 24 },
  timelineItem: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  timelineDotCol: { alignItems: 'center', width: 20 },
  timelineDot: { width: 16, height: 16, borderRadius: 8 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#1e293b', marginTop: 4 },
  timelineContent: { flex: 1, paddingBottom: 16 },
  timelineYear: { fontSize: 11, fontWeight: '700', color: '#eab308', letterSpacing: 1, marginBottom: 2 },
  timelineTitle: { fontSize: 15, fontWeight: '600', color: '#f8fafc', marginBottom: 4 },
  timelineDesc: { fontSize: 13, color: '#64748b', lineHeight: 20 },
});
