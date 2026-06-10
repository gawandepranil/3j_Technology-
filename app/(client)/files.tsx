import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to sign out?');
      if (confirmLogout) {
        logout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: logout },
        ]
      );
    }
  };



  const menuItems = [
    {
      section: 'Account',
      items: [
        { icon: 'person-outline' as const, label: 'Personal Information', color: '#eab308' },
        { icon: 'notifications-outline' as const, label: 'Notifications', color: '#3b82f6' },
        { icon: 'lock-closed-outline' as const, label: 'Security & Password', color: '#8b5cf6' },
      ],
    },
    {
      section: 'Projects',
      items: [
        { icon: 'folder-open-outline' as const, label: 'My Projects', color: '#10b981', route: '/(client)/projects' },
        { icon: 'document-text-outline' as const, label: 'My Files', color: '#f59e0b', route: '/(client)/files' },
        { icon: 'calendar-outline' as const, label: 'Meetings', color: '#ef4444', route: '/(client)/meetings' },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: 'help-circle-outline' as const, label: 'Help & FAQ', color: '#06b6d4' },
        { icon: 'chatbubble-ellipses-outline' as const, label: 'Contact Support', color: '#eab308' },
        { icon: 'star-outline' as const, label: 'Rate 3J Technologies', color: '#f97316' },
      ],
    },
  ];

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'CL';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile Header */}
        <LinearGradient colors={['#070b13', '#0d1829']} style={styles.profileHeader}>
          {/* Avatar */}
          <LinearGradient colors={['#eab308', '#f97316']} style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </LinearGradient>

          <Text style={styles.profileName}>{user?.full_name ?? 'Client User'}</Text>
          <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>

          <View style={styles.roleBadge}>
            <Ionicons name="person-outline" size={12} color="#eab308" />
            <Text style={styles.roleBadgeText}>Client</Text>
          </View>

          {/* Edit profile button */}
          <TouchableOpacity style={styles.editProfileBtn} activeOpacity={0.8}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
            <Ionicons name="pencil-outline" size={14} color="#eab308" />
          </TouchableOpacity>
        </LinearGradient>


        {/* Menu sections */}
        <View style={styles.menuContent}>
          {menuItems.map((section) => (
            <View key={section.section} style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>{section.section}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item, i) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[styles.menuItem, i < section.items.length - 1 && styles.menuItemBorder]}
                    onPress={() => {
                      if ((item as any).route) router.push((item as any).route);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.menuItemIcon, { backgroundColor: item.color + '20', borderColor: item.color + '30' }]}>
                      <Ionicons name={item.icon} size={18} color={item.color} />
                    </View>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#374151" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          {/* Version */}
          <Text style={styles.versionText}>3J Technologies · v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#070b13' },
  scroll: { paddingBottom: 100 },

  // Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  avatarRing: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#070b13', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 26, fontWeight: '800', color: '#eab308' },
  profileName: { fontSize: 22, fontWeight: '800', color: '#f8fafc', marginBottom: 4 },
  profileEmail: { fontSize: 13, color: '#6B7280', marginBottom: 10 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#eab30815', borderWidth: 1, borderColor: '#eab30830',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100, marginBottom: 16,
  },
  roleBadgeText: { fontSize: 11, color: '#eab308', fontWeight: '700' },
  editProfileBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#2e3d5c',
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10,
  },
  editProfileText: { fontSize: 13, color: '#eab308', fontWeight: '600' },

  // Stats
  statsRow: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, gap: 10,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  statCard: {
    flex: 1, alignItems: 'center', gap: 4,
    backgroundColor: '#0d1525', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#1e293b',
  },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#6B7280', fontWeight: '500' },

  // Menu
  menuContent: { paddingHorizontal: 16, paddingTop: 20 },
  menuSection: { marginBottom: 20 },
  menuSectionTitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
  menuCard: { backgroundColor: '#0d1525', borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  menuItemIcon: {
    width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  menuItemLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#f8fafc' },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#ef444415', borderWidth: 1, borderColor: '#ef444430',
    borderRadius: 14, paddingVertical: 14, marginBottom: 20,
  },
  logoutText: { fontSize: 14, color: '#ef4444', fontWeight: '700' },

  versionText: { textAlign: 'center', fontSize: 11, color: '#1f2937', marginBottom: 16 },

  // Book a Call CTA
  bookCallCard: { borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
  bookCallGrad: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  bookCallTitle: { fontSize: 14, fontWeight: '800', color: '#030712' },
  bookCallSub: { fontSize: 11, color: '#030712', opacity: 0.7, marginTop: 1 },

  // Portal links grid
  portalGrid: { gap: 0, backgroundColor: '#0d1525', borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', overflow: 'hidden' },
  portalCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  portalIcon: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  portalLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#f8fafc' },
});
