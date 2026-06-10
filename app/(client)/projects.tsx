import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { useProjectStore } from '../../src/store/projectStore';
import { useAuthStore } from '../../src/store/authStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/theme/tokens';
import { MOCK_PROJECTS, MOCK_MILESTONES } from '../../src/data/mockData';

export default function ClientProjects() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedProjectState, setSelectedProjectState] = useState<any>(null);

  const { projects, fetchProjects } = useProjectStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  const myProjects = (projects || []).filter(
    (p) => p.client_id === (user?.id ? parseInt(user.id, 10) : null)
  );
  
  const activeProjects = myProjects.length > 0 ? myProjects : MOCK_PROJECTS;

  const mappedProjects = activeProjects.map((p: any) => {
    const isReal = typeof p.id === 'number';
    return {
      id: p.id,
      client_id: p.client_id,
      name: isReal ? p.title : p.name,
      type: isReal ? 'custom_development' : p.type,
      status: p.status,
      budget: isReal ? 'PKR 450,000' : p.budget,
      timeline: isReal ? '2-3 Months' : p.timeline,
      progress: isReal ? (p.status === 'completed' ? 100 : p.status === 'in_progress' ? 55 : p.status === 'on_hold' ? 30 : 15) : p.progress,
      team_members: isReal ? [] : p.team_members,
    };
  });

  const selectedProject = selectedProjectState || mappedProjects[0];

  const milestoneIcon = (status: string) => {
    if (status === 'completed') return { name: 'checkmark-circle', color: Colors.success };
    if (status === 'active') return { name: 'radio-button-on', color: Colors.primary };
    return { name: 'ellipse-outline', color: Colors.textMuted };
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="My Projects"
        subtitle={`${mappedProjects.length} active projects`}
        rightAction={
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => router.push('/(client)/submit-requirement' as any)}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Project Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectTabs}>
          {mappedProjects.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.projectTab, selectedProject?.id === p.id && styles.projectTabActive]}
              onPress={() => setSelectedProjectState(p)}
            >
              <Text style={[styles.projectTabText, selectedProject.id === p.id && styles.projectTabTextActive]}>
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected Project Detail */}
        <View style={styles.content}>
          {/* Project Header Card */}
          <Card style={styles.projectDetailCard}>
            <View style={styles.projectDetailHeader}>
              <View>
                <Text style={styles.projectDetailName}>{selectedProject.name}</Text>
                <Text style={styles.projectDetailType}>{selectedProject.type.replace(/_/g, ' ')}</Text>
              </View>
              <Badge
                label={selectedProject.status.replace(/_/g, ' ')}
                variant="primary"
                size="md"
              />
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="wallet-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>{selectedProject.budget}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.detailLabel}>Timeline</Text>
                <Text style={styles.detailValue}>{selectedProject.timeline}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailItem}>
                <Ionicons name="trending-up-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.detailLabel}>Progress</Text>
                <Text style={[styles.detailValue, { color: Colors.primary }]}>{selectedProject.progress}%</Text>
              </View>
            </View>
            {/* Progress Bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${selectedProject.progress}%` as any }]} />
            </View>
          </Card>

          {/* Milestone Tracker */}
          <Text style={styles.sectionTitle}>Project Timeline</Text>
          <Card style={styles.milestoneCard}>
            {MOCK_MILESTONES.map((milestone, index) => {
              const icon = milestoneIcon(milestone.status);
              const isLast = index === MOCK_MILESTONES.length - 1;
              return (
                <View key={milestone.id} style={styles.milestoneRow}>
                  <View style={styles.milestoneLeft}>
                    <Ionicons name={icon.name as any} size={24} color={icon.color} />
                    {!isLast && (
                      <View style={[
                        styles.milestoneLine,
                        { backgroundColor: milestone.status === 'completed' ? Colors.success : Colors.surfaceBorder }
                      ]} />
                    )}
                  </View>
                  <View style={styles.milestoneContent}>
                    <Text style={[
                      styles.milestoneName,
                      milestone.status === 'pending' && { color: Colors.textMuted }
                    ]}>
                      {milestone.name}
                    </Text>
                    <Text style={styles.milestoneDesc}>{milestone.description}</Text>
                    <Badge
                      label={milestone.status === 'completed' ? '✓ Done' : milestone.status === 'active' ? 'In Progress' : 'Pending'}
                      variant={milestone.status === 'completed' ? 'success' : milestone.status === 'active' ? 'primary' : 'neutral'}
                      style={{ marginTop: 4 }}
                    />
                  </View>
                </View>
              );
            })}
          </Card>

          {/* Team Members */}
          {selectedProject.team_members && selectedProject.team_members.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Assigned Team</Text>
              <Card>
                {selectedProject.team_members.map((member: any) => (
                  <View key={member.user_id} style={styles.teamMemberRow}>
                    <View style={styles.teamAvatar}>
                      <Text style={styles.teamAvatarText}>
                        {member.name.split(' ').map((n: string) => n[0]).join('')}
                      </Text>
                    </View>
                    <View style={styles.teamMemberInfo}>
                      <Text style={styles.teamMemberName}>{member.name}</Text>
                      <Text style={styles.teamMemberRole}>{member.role}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                  </View>
                ))}
              </Card>
            </>
          )}

          {/* Feedback Button */}
          <Button
            title="Send Feedback / Request Changes"
            variant="ghost"
            fullWidth
            style={{ marginTop: Spacing.xl }}
            icon={<Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />}
            onPress={() => Alert.alert('Feedback', 'Feedback sent to the project team!')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  newBtn: {
    width: 36, height: 36,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  projectTabs: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  projectTab: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginRight: Spacing.sm,
  },
  projectTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  projectTabText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  projectTabTextActive: { color: Colors.white },
  content: { paddingHorizontal: Spacing.base },
  projectDetailCard: { marginBottom: Spacing.base },
  projectDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
  },
  projectDetailName: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    maxWidth: '70%',
  },
  projectDetailType: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  detailItem: { flex: 1, alignItems: 'center', gap: 2 },
  divider: { width: 1, height: 40, backgroundColor: Colors.surfaceBorder },
  detailLabel: { fontSize: Typography.size.xs, color: Colors.textMuted },
  detailValue: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.textPrimary },
  progressTrack: { height: 8, backgroundColor: Colors.surfaceBorder, borderRadius: 4 },
  progressFill: { height: 8, backgroundColor: Colors.primary, borderRadius: 4 },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  milestoneCard: { marginBottom: Spacing.base },
  milestoneRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  milestoneLeft: { alignItems: 'center', width: 24 },
  milestoneLine: { width: 2, flex: 1, marginTop: 4, marginBottom: -4, minHeight: 24 },
  milestoneContent: { flex: 1, paddingBottom: Spacing.base },
  milestoneName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  milestoneDesc: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  teamMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  teamAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary + '30',
    alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  teamAvatarText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
  teamMemberInfo: { flex: 1 },
  teamMemberName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
  },
  teamMemberRole: { fontSize: Typography.size.xs, color: Colors.textSecondary },
});
