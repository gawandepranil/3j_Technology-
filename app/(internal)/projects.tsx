import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Avatar } from '../../src/components/ui/Avatar';
import { Button } from '../../src/components/ui/Button';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/theme/tokens';
import { MOCK_PROJECTS, MOCK_USERS } from '../../src/data/mockData';
import { useProjectStore } from '../../src/store/projectStore';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { Project, User } from '../../src/types';

export default function InternalProjectsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [localProjectsState, setLocalProjectsState] = useState<any>(null);

  const { projects: backendProjects, fetchProjects } = useProjectStore();
  const { employees, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const rawProjects = (backendProjects || []).length > 0 ? backendProjects : MOCK_PROJECTS;
  const mappedProjects = rawProjects.map((p: any) => {
    const isReal = typeof p.id === 'number';
    return {
      id: p.id,
      client_id: p.client_id,
      name: isReal ? p.title : p.name,
      client_name: isReal ? 'Client Partner' : p.client_name,
      status: p.status,
      budget: isReal ? 'PKR 450,000' : p.budget,
      timeline: isReal ? '2-3 Months' : p.timeline,
      progress: isReal ? (p.status === 'completed' ? 100 : p.status === 'in_progress' ? 55 : p.status === 'on_hold' ? 30 : 15) : p.progress,
      created_at: isReal ? new Date(p.created_at).toISOString().split('T')[0] : p.created_at,
      team_members: isReal ? [] : p.team_members,
    };
  });

  const projects = localProjectsState || mappedProjects;

  const rawEmployees = (employees || []).length > 0 ? employees.map((e: any) => ({
    id: e.id.toString(),
    full_name: e.name,
    role: e.designation.toLowerCase(),
    availability: 'available',
    experience_years: 3,
    skills: ['Engineering']
  })) : MOCK_USERS;

  const availableMembers = rawEmployees.filter(
    u => u.role !== 'client' && u.role !== 'hr' && u.role !== 'admin' &&
    (u.availability === 'available' || (u as any).project_assigned === selectedProject?.id)
  );

  const handleAssign = (member: any) => {
    Alert.alert(
      'Assign to Project',
      `Assign ${member.full_name} to ${selectedProject?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign',
          onPress: () => {
            setLocalProjectsState(projects.map((p: any) => {
              if (p.id !== selectedProject?.id) return p;
              const existing = p.team_members?.find((m: any) => m.user_id === member.id);
              if (existing) return p;
              return {
                ...p,
                team_members: [...(p.team_members || []), {
                  user_id: member.id,
                  name: member.full_name,
                  role: member.role.replace('_', ' '),
                }]
              };
            }));
            setShowAssignModal(false);
          }
        },
      ]
    );
  };

  const statusVariant: Record<string, any> = {
    requirement_analysis: 'info',
    design: 'warning',
    development: 'primary',
    testing: 'warning',
    deployment: 'success',
    completed: 'success',
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Projects"
        subtitle={`${projects.length} projects`}
        rightAction={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => Alert.alert('Create Project', 'Project creation form would open here.')}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {projects.map((project: any) => (
          <Card key={project.id} style={styles.projectCard}>
            {/* Project Header */}
            <View style={styles.projectHeader}>
              <View style={styles.projectTypeIcon}>
                <Ionicons name="code-slash-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectClient}>{project.client_name}</Text>
              </View>
              <Badge
                label={project.status.replace(/_/g, ' ')}
                variant={statusVariant[project.status] || 'neutral'}
              />
            </View>

            {/* Progress */}
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${project.progress}%` as any }]} />
              </View>
              <Text style={styles.progressText}>{project.progress}%</Text>
            </View>

            {/* Project Details */}
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Ionicons name="wallet-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.detailText}>{project.budget}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.detailText}>{project.timeline}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.detailText}>{project.created_at}</Text>
              </View>
            </View>

            {/* Team Members */}
            <View style={styles.teamSection}>
              <Text style={styles.teamLabel}>Assigned Team</Text>
              {project.team_members && project.team_members.length > 0 ? (
                <View style={styles.teamList}>
                  {project.team_members.map((member: any, i: number) => (
                    <View key={member.user_id} style={styles.memberRow}>
                      <Avatar name={member.name} size="sm" />
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberRole}>{member.role}</Text>
                      </View>
                      <Badge label="Active" variant="success" />
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noTeam}>No team assigned yet</Text>
              )}
            </View>

            {/* Assign Button */}
            <Button
              title="+ Assign Team Member"
              variant="ghost"
              size="sm"
              fullWidth
              onPress={() => { setSelectedProject(project); setShowAssignModal(true); }}
              style={{ marginTop: Spacing.sm }}
            />
          </Card>
        ))}
      </ScrollView>

      {/* Resource Allocation Modal */}
      <Modal visible={showAssignModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Team Member</Text>
              <Text style={styles.modalSubtitle}>{selectedProject?.name}</Text>
              <TouchableOpacity onPress={() => setShowAssignModal(false)} style={styles.modalClose}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {availableMembers.map((member) => {
                const isAssigned = selectedProject?.team_members?.some((m: any) => m.user_id === member.id);
                return (
                  <TouchableOpacity
                    key={member.id}
                    style={[styles.memberOption, isAssigned && styles.memberOptionAssigned]}
                    onPress={() => !isAssigned && handleAssign(member)}
                    disabled={isAssigned}
                  >
                    <Avatar name={member.full_name} size="md" />
                    <View style={styles.memberOptionInfo}>
                      <Text style={styles.memberOptionName}>{member.full_name}</Text>
                      <Text style={styles.memberOptionRole}>
                        {member.role.replace(/_/g, ' ')} · {member.experience_years ?? '?'}+ yrs
                      </Text>
                      {member.skills && (
                        <Text style={styles.memberSkills} numberOfLines={1}>
                          {member.skills.join(' · ')}
                        </Text>
                      )}
                    </View>
                    <View>
                      {isAssigned ? (
                        <Badge label="Assigned" variant="success" />
                      ) : (
                        <View style={[
                          styles.availabilityDot,
                          { backgroundColor: member.availability === 'available' ? Colors.success : Colors.warning }
                        ]}>
                          <Text style={styles.availabilityText}>
                            {member.availability === 'available' ? '✓ Free' : 'Busy'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: 100 },
  addBtn: {
    width: 36, height: 36,
    backgroundColor: Colors.primary, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  projectCard: { marginBottom: Spacing.md },
  projectHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.sm },
  projectTypeIcon: {
    width: 40, height: 40,
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  projectInfo: { flex: 1 },
  projectName: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.textPrimary },
  projectClient: { fontSize: Typography.size.xs, color: Colors.textSecondary, marginTop: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  progressTrack: { flex: 1, height: 6, backgroundColor: Colors.surfaceBorder, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  progressText: { fontSize: Typography.size.xs, color: Colors.primary, fontWeight: Typography.weight.semibold, width: 30 },
  detailsRow: { flexDirection: 'row', gap: Spacing.base, marginBottom: Spacing.base },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: Typography.size.xs, color: Colors.textSecondary },
  teamSection: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  teamLabel: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.textSecondary, marginBottom: Spacing.sm },
  teamList: { gap: Spacing.sm },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  memberInfo: { flex: 1 },
  memberName: { fontSize: Typography.size.sm, fontWeight: Typography.weight.medium, color: Colors.textPrimary },
  memberRole: { fontSize: Typography.size.xs, color: Colors.textSecondary, textTransform: 'capitalize' },
  noTeam: { fontSize: Typography.size.sm, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center', paddingVertical: Spacing.sm },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: '#000000BB', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    padding: Spacing.base,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
    position: 'relative',
  },
  modalTitle: { fontSize: Typography.size.lg, fontWeight: Typography.weight.bold, color: Colors.textPrimary },
  modalSubtitle: { fontSize: Typography.size.sm, color: Colors.textSecondary, marginTop: 2 },
  modalClose: {
    position: 'absolute', right: Spacing.base, top: Spacing.base,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  memberOption: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.base,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  memberOptionAssigned: { opacity: 0.6 },
  memberOptionInfo: { flex: 1 },
  memberOptionName: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.textPrimary },
  memberOptionRole: { fontSize: Typography.size.sm, color: Colors.textSecondary, textTransform: 'capitalize', marginTop: 2 },
  memberSkills: { fontSize: Typography.size.xs, color: Colors.accent, marginTop: 2 },
  availabilityDot: {
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  availabilityText: { fontSize: Typography.size.xs, color: Colors.white, fontWeight: Typography.weight.semibold },
});
