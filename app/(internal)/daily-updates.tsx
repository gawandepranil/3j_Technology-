import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { Card } from '../../src/components/ui/Card';
import { Avatar } from '../../src/components/ui/Avatar';
import { Button } from '../../src/components/ui/Button';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/theme/tokens';
import { MOCK_DAILY_UPDATES, MOCK_PROJECTS } from '../../src/data/mockData';
import { useDailyUpdateStore } from '../../src/store/dailyUpdateStore';
import { useProjectStore } from '../../src/store/projectStore';
import { DailyUpdate } from '../../src/types';
import { useAuthStore } from '../../src/store/authStore';

export default function DailyUpdatesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(MOCK_PROJECTS[0].id);
  const [todayWork, setTodayWork] = useState('');
  const [blockers, setBlockers] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [localUpdatesState, setLocalUpdatesState] = useState<any>(null);

  const { updates: backendUpdates, fetchDailyUpdates, createDailyUpdate } = useDailyUpdateStore();
  const { projects: backendProjects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchDailyUpdates();
    fetchProjects();
  }, []);

  const rawProjects = (backendProjects || []).length > 0 ? backendProjects : MOCK_PROJECTS;
  const projects = rawProjects.map((p: any) => ({
    id: p.id.toString(),
    name: p.title || p.name
  }));

  const rawUpdates = (backendUpdates || []).length > 0 ? backendUpdates.map((u: any) => {
    const isReal = typeof u.id === 'number';
    const pName = projects.find(p => p.id === u.project_id?.toString())?.name || 'Project';
    return {
      id: u.id.toString(),
      project_id: u.project_id?.toString() || 'p1',
      project_name: pName,
      user_id: u.employee_id?.toString() || 'u4',
      user_name: u.employee?.name || 'Team Member',
      user_role: u.employee?.designation || 'Developer',
      today_work: u.content || u.today_work,
      blockers: 'No blockers.',
      tomorrow_plan: 'Continue progress.',
      date: u.date || new Date().toISOString().split('T')[0]
    };
  }) : MOCK_DAILY_UPDATES;

  const updates = localUpdatesState || rawUpdates;

  const today = new Date().toISOString().split('T')[0];

  const filtered = filterProject === 'all'
    ? updates
    : updates.filter((u: any) => u.project_id === filterProject);

  const handleSubmit = async () => {
    if (!todayWork.trim()) {
      Alert.alert('Required', "Please fill in today's work.");
      return;
    }
    
    const response = await createDailyUpdate({
      content: todayWork.trim(),
      employee_id: 1,
    });

    if (response) {
      Alert.alert('✓ Update Submitted', 'Your daily standup has been submitted!');
      fetchDailyUpdates();
    } else {
      const newUpdate: DailyUpdate = {
        id: `du${Date.now()}`,
        project_id: selectedProject,
        project_name: projects.find(p => p.id === selectedProject)?.name ?? '',
        user_id: user?.id ?? 'u1',
        user_name: user?.full_name ?? 'Unknown',
        user_role: user?.role ?? 'developer',
        today_work: todayWork,
        blockers: blockers || 'No blockers.',
        tomorrow_plan: tomorrowPlan,
        date: today,
      };
      setLocalUpdatesState((prev: any) => [newUpdate, ...(prev || updates)]);
      Alert.alert('✓ Update Submitted', 'Your daily standup has been submitted locally!');
    }

    setShowSubmitModal(false);
    setTodayWork('');
    setBlockers('');
    setTomorrowPlan('');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Daily Updates"
        subtitle="Team standup reports"
        rightAction={
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowSubmitModal(true)}>
            <Ionicons name="add" size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      {/* Project Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filterProject === 'all' && styles.filterChipActive]}
          onPress={() => setFilterProject('all')}
        >
          <Text style={[styles.filterText, filterProject === 'all' && styles.filterTextActive]}>All Projects</Text>
        </TouchableOpacity>
        {projects.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.filterChip, filterProject === p.id && styles.filterChipActive]}
            onPress={() => setFilterProject(p.id)}
          >
            <Text style={[styles.filterText, filterProject === p.id && styles.filterTextActive]} numberOfLines={1}>
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Submit Banner */}
        <TouchableOpacity style={styles.submitBanner} onPress={() => setShowSubmitModal(true)} activeOpacity={0.8}>
          <LinearGradient colors={['#0047B3', '#0066FF']} style={styles.bannerGradient}>
            <Ionicons name="pencil-outline" size={20} color={Colors.white} />
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Submit Today's Update</Text>
              <Text style={styles.bannerSubtitle}>Share your progress with the team</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Updates List */}
        <Text style={styles.dateGroup}>{today === updates[0]?.date ? "Today's Updates" : "Recent Updates"}</Text>
        {filtered.map((update: any) => (
          <Card key={update.id} style={styles.updateCard}>
            {/* Header */}
            <View style={styles.updateHeader}>
              <Avatar name={update.user_name} size="md" />
              <View style={styles.updateUser}>
                <Text style={styles.updateUserName}>{update.user_name}</Text>
                <Text style={styles.updateUserRole}>{update.user_role} · {update.project_name}</Text>
              </View>
              <Text style={styles.updateDate}>{update.date}</Text>
            </View>

            {/* Today's Work */}
            <View style={styles.updateSection}>
              <View style={styles.sectionIcon}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.sectionLabel}>Today's Work</Text>
              </View>
              <Text style={styles.sectionContent}>{update.today_work}</Text>
            </View>

            {/* Blockers */}
            <View style={styles.updateSection}>
              <View style={styles.sectionIcon}>
                <Ionicons name="warning-outline" size={16} color={Colors.warning} />
                <Text style={styles.sectionLabel}>Blockers</Text>
              </View>
              <Text style={[styles.sectionContent,
                update.blockers !== 'No blockers.' && { color: Colors.warning }
              ]}>
                {update.blockers}
              </Text>
            </View>

            {/* Tomorrow's Plan */}
            {update.tomorrow_plan && (
              <View style={styles.updateSection}>
                <View style={styles.sectionIcon}>
                  <Ionicons name="arrow-forward-circle-outline" size={16} color={Colors.primary} />
                  <Text style={styles.sectionLabel}>Tomorrow's Plan</Text>
                </View>
                <Text style={styles.sectionContent}>{update.tomorrow_plan}</Text>
              </View>
            )}
          </Card>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="clipboard-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No updates for this project yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Submit Modal */}
      <Modal visible={showSubmitModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Daily Standup</Text>
                <Text style={styles.modalDate}>{today}</Text>
                <TouchableOpacity onPress={() => setShowSubmitModal(false)} style={styles.modalClose}>
                  <Ionicons name="close" size={22} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
                {/* Project Selector */}
                <Text style={styles.inputLabel}>Project *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.base }}>
                  {projects.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.projectChip, selectedProject === p.id && styles.projectChipActive]}
                      onPress={() => setSelectedProject(p.id)}
                    >
                      <Text style={[styles.projectChipText, selectedProject === p.id && styles.projectChipTextActive]}>
                        {p.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.inputLabel}>What did you work on today? *</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe your work today..."
                  placeholderTextColor={Colors.textMuted}
                  value={todayWork}
                  onChangeText={setTodayWork}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Text style={styles.inputLabel}>Any blockers?</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Any issues blocking your progress? (Leave blank if none)"
                  placeholderTextColor={Colors.textMuted}
                  value={blockers}
                  onChangeText={setBlockers}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <Text style={styles.inputLabel}>Tomorrow's Plan</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="What will you work on tomorrow?"
                  placeholderTextColor={Colors.textMuted}
                  value={tomorrowPlan}
                  onChangeText={setTomorrowPlan}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <Button
                  title="Submit Standup"
                  fullWidth
                  onPress={handleSubmit}
                  style={{ marginTop: Spacing.base, marginBottom: Spacing['2xl'] }}
                  icon={<Ionicons name="send-outline" size={16} color={Colors.white} />}
                />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  filterRow: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    marginRight: Spacing.sm, maxWidth: 160,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Typography.size.xs, color: Colors.textSecondary, fontWeight: Typography.weight.medium },
  filterTextActive: { color: Colors.white },
  submitBanner: { marginBottom: Spacing.base },
  bannerGradient: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderRadius: BorderRadius.xl, padding: Spacing.base,
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: Typography.size.base, fontWeight: Typography.weight.bold, color: Colors.white },
  bannerSubtitle: { fontSize: Typography.size.xs, color: Colors.white + 'AA', marginTop: 2 },
  dateGroup: {
    fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary, marginBottom: Spacing.sm,
  },
  updateCard: { marginBottom: Spacing.sm },
  updateHeader: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: Spacing.sm, marginBottom: Spacing.md,
  },
  updateUser: { flex: 1 },
  updateUserName: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.textPrimary },
  updateUserRole: { fontSize: Typography.size.xs, color: Colors.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  updateDate: { fontSize: Typography.size.xs, color: Colors.textMuted },
  updateSection: { marginBottom: Spacing.sm },
  sectionIcon: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  sectionLabel: { fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold, color: Colors.textSecondary },
  sectionContent: {
    fontSize: Typography.size.sm, color: Colors.textPrimary,
    paddingLeft: 22, lineHeight: 20,
  },
  empty: { alignItems: 'center', paddingVertical: Spacing['3xl'], gap: Spacing.base },
  emptyText: { fontSize: Typography.size.base, color: Colors.textMuted },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: '#000000BB', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    padding: Spacing.base,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
    position: 'relative',
  },
  modalTitle: { fontSize: Typography.size.lg, fontWeight: Typography.weight.bold, color: Colors.textPrimary },
  modalDate: { fontSize: Typography.size.sm, color: Colors.textSecondary, marginTop: 2 },
  modalClose: {
    position: 'absolute', right: Spacing.base, top: Spacing.base,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  modalScroll: { padding: Spacing.base },
  inputLabel: {
    fontSize: Typography.size.sm, fontWeight: Typography.weight.medium,
    color: Colors.textSecondary, marginBottom: Spacing.sm,
  },
  textArea: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    padding: Spacing.base,
    minHeight: 100,
    marginBottom: Spacing.base,
    textAlignVertical: 'top',
  },
  projectChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    marginRight: Spacing.sm,
  },
  projectChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  projectChipText: { fontSize: Typography.size.xs, color: Colors.textSecondary, fontWeight: Typography.weight.medium },
  projectChipTextActive: { color: Colors.white },
});
