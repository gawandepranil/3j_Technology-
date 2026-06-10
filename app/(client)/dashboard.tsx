import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { projectService, Project } from '../../src/api/projectService';
import { meetingService, Meeting } from '../../src/api/meetingService';

const { width: SW } = Dimensions.get('window');

export default function ClientDashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();

  const [projects, setProjects] = useState<Project[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [allProjects, allMeetings] = await Promise.all([
        projectService.getProjects(),
        meetingService.getMeetings(),
      ]);

      const userId = user?.id ? parseInt(user.id, 10) : null;
      const myProjects = userId
        ? allProjects.filter((p) => p.client_id === userId)
        : allProjects;

      setProjects(myProjects);
      setMeetings(allMeetings);
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData(true);
  }, [fetchData]);

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'CL';

  const portalModules = [
    {
      icon: 'construct-outline' as const,
      title: 'Services',
      desc: 'Explore our technology capabilities in AI, Cloud, IoT, and custom Web development.',
      color: '#eab308',
      route: '/(client)/services',
    },
    {
      icon: 'rocket-outline' as const,
      title: 'Mission & Vision',
      desc: 'Learn about our core principles, project standards, and long-term technical roadmap.',
      color: '#3b82f6',
      route: '/(client)/mission',
    },
    {
      icon: 'star-outline' as const,
      title: 'Why Choose Us',
      desc: 'Discover our rigorous engineering standards, delivery process, and partnership model.',
      color: '#10b981',
      route: '/(client)/whyus',
    },
    {
      icon: 'document-text-outline' as const,
      title: 'Submit Requirements',
      desc: 'Have a new project idea or a feature request? Submit the details directly to our team.',
      color: '#f97316',
      route: '/(client)/submit-requirement',
    },
    {
      icon: 'mail-outline' as const,
      title: 'Contact & Support',
      desc: 'Send us a direct message or schedule a live consultation call with our engineers.',
      color: '#8b5cf6',
      route: '/(client)/contact',
    },
  ];

  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* ── Background Grid & Glowing Blobs ── */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.gridBackground} />
        <View style={[styles.glowBlob, styles.glowBlob1]} />
        <View style={[styles.glowBlob, styles.glowBlob2]} />
      </View>

      {/* ── Sticky Top Header row ── */}
      <View style={styles.headerRow}>
        <View style={styles.logoCol}>
          <LinearGradient colors={['#1e3a8a', '#eab308']} style={styles.logoIcon}>
            <Text style={styles.logoIconText}>3J</Text>
          </LinearGradient>
          <Text style={styles.logoTitle}>Client Portal</Text>
        </View>

        <TouchableOpacity 
          style={styles.headerProfile} 
          activeOpacity={0.8}
          onPress={() => router.push('/(client)/files' as any)}
        >
          <View style={styles.headerProfileTextCol}>
            <Text style={styles.headerWelcome}>Welcome back,</Text>
            <Text style={styles.headerName}>{user?.full_name ?? 'Client'}</Text>
          </View>
          <LinearGradient colors={['#eab308', '#f97316']} style={styles.avatarRing}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>{initials}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#eab308"
            colors={['#eab308']}
          />
        }
      >
        <View style={styles.contentContainer}>
          {/* ── Tagline Hero Section ── */}
          <View style={styles.heroSection}>
            <View style={styles.capsuleBadge}>
              <Ionicons name="sparkles" size={12} color="#0056cc" />
              <Text style={styles.capsuleBadgeText}>Founders Empowering Founders</Text>
            </View>

            <Text style={styles.heroTitle}>
              Turning Bold Ideas Into{'\n'}
              <Text style={styles.heroTitleBlue}>Breakthrough </Text>
              <Text style={styles.heroTitleGold}>Products</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              We combine deep technical expertise with relentless execution to transform visionary concepts into products that reshape industries and create lasting impact.
            </Text>

            <View style={styles.ctaButtonsRow}>
              <TouchableOpacity
                style={styles.primaryCta}
                onPress={() => router.push('/(client)/contact' as any)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#0f172a', '#ca8a04']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryCtaGrad}
                >
                  <Text style={styles.primaryCtaText}>Book a Consultation</Text>
                  <Ionicons name="arrow-forward" size={14} color="#ffffff" style={{ marginLeft: 6 }} />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryCta}
                onPress={() => router.push('/(client)/services' as any)}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryCtaText}>Explore Services</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Statistics Banner ── */}
          <View style={styles.statsBanner}>
            {[
              { value: '5+', label: 'Projects Delivered' },
              { value: '12+', label: 'Years Experience' },
              { value: '100%', label: 'Client Satisfaction' },
              { value: '24/7', label: 'Support Available' },
            ].map((stat, i) => (
              <View key={i} style={styles.statsBannerItem}>
                <Text style={styles.statsBannerValue}>{stat.value}</Text>
                <Text style={styles.statsBannerLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Interactive Client Portal Grid ── */}
          <View style={styles.gridSection}>
            <Text style={styles.gridSectionTitle}>Interactive Client Portal</Text>
            <View style={styles.gridContainer}>
              {portalModules.map((link, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.portalGridCard,
                    isWeb && SW > 768 ? styles.portalCardWeb : styles.portalCardMobile
                  ]}
                  onPress={() => router.push(link.route as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.portalIconBox, { backgroundColor: link.color + '12', borderColor: link.color + '25' }]}>
                    <Ionicons name={link.icon} size={22} color={link.color} />
                  </View>
                  <View style={styles.portalCardTextCol}>
                    <Text style={styles.portalCardTitle}>{link.title}</Text>
                    <Text style={styles.portalCardDesc}>{link.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94a3b8" style={styles.portalCardChevron} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── My Workspace Section (Dynamic Backend counts) ── */}
          <View style={styles.workspaceSection}>
            <Text style={styles.workspaceSectionTitle}>My Active Workspace</Text>
            <View style={styles.workspaceGrid}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#ca8a04" style={{ marginVertical: 24, flex: 1 }} />
              ) : (
                [
                  { label: 'Active Projects', value: projects.length.toString(), icon: 'folder-open-outline' as const, color: '#eab308', route: '/(client)/projects', note: 'View active contracts' },
                  { label: 'Upcoming Calls', value: meetings.length.toString(), icon: 'calendar-outline' as const, color: '#3b82f6', route: '/(client)/meetings', note: 'View scheduled calls' },
                  { label: 'Shared Documents', value: '12', icon: 'document-outline' as const, color: '#8b5cf6', route: '/(client)/files', note: 'View documents' },
                ].map((s) => (
                  <TouchableOpacity
                    key={s.label}
                    style={[
                      styles.workspaceCard,
                      isWeb && SW > 768 ? styles.workspaceCardWeb : styles.workspaceCardMobile
                    ]}
                    onPress={() => router.push(s.route as any)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.workspaceCardHeader}>
                      <View style={[styles.workspaceIconBox, { backgroundColor: s.color + '15' }]}>
                        <Ionicons name={s.icon} size={18} color={s.color} />
                      </View>
                      <Text style={[styles.workspaceValue, { color: s.color }]}>{s.value}</Text>
                    </View>
                    <Text style={styles.workspaceLabel}>{s.label}</Text>
                    <Text style={styles.workspaceNote}>{s.note}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc', overflow: 'hidden' },
  scroll: { paddingBottom: 100 },
  contentContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },

  // Grid background pattern
  gridBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.25,
    ...Platform.select({
      web: {
        backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      },
    }),
  },

  // Glowing background blobs
  glowBlob: {
    position: 'absolute',
    borderRadius: 500,
    ...Platform.select({
      web: {
        filter: 'blur(120px)',
      },
      default: {
        opacity: 0.1,
      }
    }),
  },
  glowBlob1: {
    top: -80,
    left: '10%',
    width: SW * 0.5,
    height: SW * 0.5,
    backgroundColor: '#3b82f6',
    opacity: 0.1,
  },
  glowBlob2: {
    bottom: -100,
    right: '10%',
    width: SW * 0.4,
    height: SW * 0.4,
    backgroundColor: '#eab308',
    opacity: 0.08,
  },

  // Sticky Header Row
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'rgba(248, 250, 252, 0.85)',
    zIndex: 10,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  logoCol: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: { fontSize: 13, fontWeight: '900', color: '#ffffff' },
  logoTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },

  headerProfile: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerProfileTextCol: {
    alignItems: 'flex-end',
    ...Platform.select({
      default: { display: SW > 480 ? 'flex' : 'none' },
    }),
  },
  headerWelcome: { fontSize: 10, color: '#64748b', fontWeight: '500' },
  headerName: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  avatarRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 12, fontWeight: '800', color: '#eab308' },

  // Tagline Hero Section
  heroSection: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 36,
  },
  capsuleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    marginBottom: 20,
    gap: 6,
  },
  capsuleBadgeText: { color: '#0056cc', fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  heroTitle: {
    fontSize: SW > 768 ? 52 : 32,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: SW > 768 ? 62 : 40,
    letterSpacing: -1,
    marginBottom: 16,
  },
  heroTitleBlue: { color: '#1e40af' },
  heroTitleGold: { color: '#ca8a04' },
  heroSubtitle: {
    fontSize: SW > 768 ? 16 : 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 720,
    marginBottom: 28,
  },

  ctaButtonsRow: {
    flexDirection: SW > 480 ? 'row' : 'column',
    gap: 12,
    width: SW > 480 ? 'auto' : '100%',
    justifyContent: 'center',
  },
  primaryCta: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#ca8a04',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryCtaGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  primaryCtaText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  secondaryCta: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCtaText: { color: '#334155', fontSize: 14, fontWeight: '600' },

  // Statistics Banner
  statsBanner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 40,
  },
  statsBannerItem: {
    flex: 1,
    minWidth: SW > 600 ? 120 : '50%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statsBannerValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e40af',
    marginBottom: 4,
  },
  statsBannerLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  // Interactive Client Portal Grid
  gridSection: {
    marginBottom: 36,
  },
  gridSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    marginLeft: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  portalGridCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  portalCardWeb: {
    flex: 1,
    minWidth: '31%',
  },
  portalCardMobile: {
    width: '100%',
  },
  portalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 14,
  },
  portalCardTextCol: { flex: 1, paddingRight: 8 },
  portalCardTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  portalCardDesc: { fontSize: 11, color: '#64748b', lineHeight: 16 },
  portalCardChevron: { marginLeft: 'auto' },

  // My Workspace Section
  workspaceSection: {
    marginBottom: 60,
  },
  workspaceSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    marginLeft: 4,
  },
  workspaceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  workspaceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  workspaceCardWeb: {
    flex: 1,
    minWidth: '30%',
  },
  workspaceCardMobile: {
    width: '100%',
  },
  workspaceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workspaceIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workspaceValue: { fontSize: 24, fontWeight: '800' },
  workspaceLabel: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  workspaceNote: { fontSize: 11, color: '#64748b' },
});
