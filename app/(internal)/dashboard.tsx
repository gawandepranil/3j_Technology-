import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { useProjectStore } from '../../src/store/projectStore';
import { useLeadStore } from '../../src/store/leadStore';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { Card, SectionTitle } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Avatar } from '../../src/components/ui/Avatar';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/theme/tokens';
import { MOCK_PROJECTS, MOCK_LEADS, MOCK_USERS } from '../../src/data/mockData';

export default function InternalDashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const { projects, fetchProjects } = useProjectStore();
  const { leads, fetchLeads } = useLeadStore();
  const { employees, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    fetchProjects();
    fetchLeads();
    fetchEmployees();
  }, []);

  const totalProjectsCount = (projects || []).length > 0 ? projects.length : MOCK_PROJECTS.length;
  const activeProjectsCount = (projects || []).length > 0 ? projects.filter(p => p.status !== 'completed').length : MOCK_PROJECTS.filter(p => p.status !== 'completed').length;
  const newLeadsCount = (leads || []).length > 0 ? leads.filter(l => l.status === 'new').length : MOCK_LEADS.filter(l => l.status === 'new').length;
  const teamCount = (employees || []).length > 0 ? employees.length : MOCK_USERS.filter(u => u.role !== 'client').length;
  const availableMembers = (employees || []).length > 0 ? employees.length : MOCK_USERS.filter(u => u.availability === 'available' && u.role !== 'client').length;

  const rawLeads = (leads || []).length > 0 ? leads : MOCK_LEADS;
  const rawProjects = (projects || []).length > 0 ? projects : MOCK_PROJECTS;

  const recentLeads = rawLeads.slice(0, 3).map((l: any) => {
    const isReal = typeof l.id === 'number';
    return {
      id: l.id,
      client_name: isReal ? l.contact_name : l.client_name,
      company: l.company,
      service_interest: isReal ? 'Software Services' : l.service_interest,
      status: l.status
    };
  });

  const recentProjects = rawProjects.slice(0, 2).map((p: any) => {
    const isReal = typeof p.id === 'number';
    return {
      id: p.id,
      name: isReal ? p.title : p.name,
      client_name: isReal ? 'Client Partner' : p.client_name,
      status: p.status,
      progress: isReal ? (p.status === 'completed' ? 100 : p.status === 'in_progress' ? 55 : p.status === 'on_hold' ? 30 : 15) : p.progress,
      team_members: isReal ? [] : p.team_members
    };
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <LinearGradient colors={['#0A0F1E', '#0D1829']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Team Portal</Text>
              <Text style={styles.userName}>{user?.full_name ?? 'Admin'} 👋</Text>
              <Text style={styles.userRole}>{user?.role?.replace('_', ' ')?.toUpperCase()}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
                <View style={styles.notifDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={logout}>
                <Ionicons name="log-out-outline" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {[
              { label: 'Total Projects', value: totalProjectsCount, icon: 'folder', gradient: ['#0047B3', '#0066FF'] as [string,string] },
              { label: 'Active', value: activeProjectsCount, icon: 'trending-up', gradient: ['#007A60', '#00D4AA'] as [string,string] },
              { label: 'New Leads', value: newLeadsCount, icon: 'flash', gradient: ['#6D28D9', '#8B5CF6'] as [string,string] },
              { label: 'Available', value: availableMembers, icon: 'people', gradient: ['#D97706', '#F59E0B'] as [string,string] },
            ].map((stat) => (
              <LinearGradient key={stat.label} colors={stat.gradient} style={styles.statCard}>
                <Ionicons name={stat.icon as any} size={18} color={Colors.white} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </LinearGradient>
            ))}
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.content}>
          <SectionTitle title="Quick Actions" />
          <View style={styles.quickActions}>
            {[
              { icon: 'person-add-outline', label: 'New Lead', color: Colors.primary, route: '/(internal)/leads' },
              { icon: 'add-circle-outline', label: 'New Project', color: Colors.accent, route: '/(internal)/projects' },
              { icon: 'people-outline', label: 'Team', color: '#8B5CF6', route: '/(internal)/employees' },
              { icon: 'clipboard-outline', label: 'Updates', color: Colors.warning, route: '/(internal)/daily-updates' },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickAction}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Leads */}
          <SectionTitle
            title="Recent Leads"
            action={
              <TouchableOpacity onPress={() => router.push('/(internal)/leads' as any)}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            }
          />
          {recentLeads.map((lead) => {
            const statusVariantMap: Record<string, any> = {
              new: 'lead_new',
              meeting_scheduled: 'lead_meeting',
              proposal_sent: 'lead_proposal',
              approved: 'lead_approved',
              rejected: 'lead_rejected',
            };
            const statusLabelMap: Record<string, string> = {
              new: 'New',
              meeting_scheduled: 'Meeting',
              proposal_sent: 'Proposal',
              approved: 'Approved',
              rejected: 'Rejected',
            };
            return (
              <Card key={lead.id} style={styles.leadCard}>
                <View style={styles.leadRow}>
                  <Avatar name={lead.client_name} size="md" />
                  <View style={styles.leadInfo}>
                    <Text style={styles.leadName}>{lead.client_name}</Text>
                    <Text style={styles.leadCompany}>{lead.company}</Text>
                    <Text style={styles.leadService}>{lead.service_interest}</Text>
                  </View>
                  <Badge label={statusLabelMap[lead.status]} variant={statusVariantMap[lead.status]} size="md" />
                </View>
              </Card>
            );
          })}

          {/* Active Projects */}
          <SectionTitle
            title="Active Projects"
            action={
              <TouchableOpacity onPress={() => router.push('/(internal)/projects' as any)}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            }
          />
          {recentProjects.map((project) => (
            <Card key={project.id} style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Badge label={project.status.replace(/_/g, ' ')} variant="primary" />
              </View>
              <Text style={styles.projectClient}>{project.client_name}</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${project.progress}%` as any }]} />
                </View>
                <Text style={styles.progressText}>{project.progress}%</Text>
              </View>
              <View style={styles.teamRow}>
                {project.team_members?.slice(0, 4).map((m: any, i: number) => (
                  <Avatar key={m.user_id} name={m.name} size="sm"
                    style={{ marginLeft: i > 0 ? -8 : 0, borderWidth: 2, borderColor: Colors.surface }} />
                ))}
                <Text style={styles.teamCount}>
                  {project.team_members?.length ?? 0} members
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingTop: Spacing.base, marginBottom: Spacing.xl,
  },
  greeting: { fontSize: Typography.size.sm, color: Colors.textSecondary },
  userName: { fontSize: Typography.size.xl, fontWeight: Typography.weight.bold, color: Colors.textPrimary },
  userRole: { fontSize: Typography.size.xs, color: Colors.accent, fontWeight: Typography.weight.semibold, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40, height: 40,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 2, borderColor: Colors.surfaceElevated,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: {
    width: '47.5%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    alignItems: 'flex-start',
    gap: 4,
  },
  statValue: { fontSize: Typography.size['2xl'], fontWeight: Typography.weight.bold, color: Colors.white },
  statLabel: { fontSize: Typography.size.xs, color: Colors.white + 'BB' },
  content: { paddingHorizontal: Spacing.base },
  quickActions: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  quickAction: { flex: 1, alignItems: 'center', gap: 8 },
  quickActionIcon: {
    width: 56, height: 56, borderRadius: BorderRadius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  quickActionLabel: { fontSize: Typography.size.xs, color: Colors.textSecondary, textAlign: 'center' },
  seeAll: { fontSize: Typography.size.sm, color: Colors.primary, fontWeight: Typography.weight.medium },
  leadCard: { marginBottom: Spacing.sm },
  leadRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  leadInfo: { flex: 1 },
  leadName: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.textPrimary },
  leadCompany: { fontSize: Typography.size.sm, color: Colors.textSecondary, marginTop: 1 },
  leadService: { fontSize: Typography.size.xs, color: Colors.accent, marginTop: 2 },
  projectCard: { marginBottom: Spacing.sm },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  projectName: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.textPrimary, flex: 1, marginRight: 8 },
  projectClient: { fontSize: Typography.size.sm, color: Colors.textSecondary, marginBottom: Spacing.sm },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  progressTrack: { flex: 1, height: 6, backgroundColor: Colors.surfaceBorder, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  progressText: { fontSize: Typography.size.xs, color: Colors.primary, fontWeight: Typography.weight.semibold, width: 30 },
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  teamCount: { fontSize: Typography.size.xs, color: Colors.textSecondary, marginLeft: 8 },
});
