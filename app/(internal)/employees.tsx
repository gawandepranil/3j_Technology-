import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Avatar } from '../../src/components/ui/Avatar';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/theme/tokens';
import { MOCK_USERS } from '../../src/data/mockData';
import { useEmployeeStore } from '../../src/store/employeeStore';
import { UserRole } from '../../src/types';

const ROLE_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Developers', value: 'developer' },
  { label: 'Designers', value: 'designer' },
  { label: 'Testers', value: 'tester' },
  { label: 'PMs', value: 'project_manager' },
];

const AVAILABILITY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'On Project', value: 'on_project' },
];

export default function EmployeesScreen() {
  const insets = useSafeAreaInsets();
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [availFilter, setAvailFilter] = useState('all');

  const { employees, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const rawEmployees = (employees || []).length > 0 ? employees.map((e: any) => {
    let role = 'developer';
    const desc = e.designation.toLowerCase();
    if (desc.includes('manager')) role = 'project_manager';
    else if (desc.includes('designer')) role = 'designer';
    else if (desc.includes('qa') || desc.includes('test')) role = 'tester';
    
    return {
      id: e.id.toString(),
      full_name: e.name,
      role: role as any,
      department: e.department || 'Engineering',
      availability: 'available',
      skills: e.department === 'Design' ? ['Figma', 'UI/UX'] : ['TypeScript', 'React Native'],
      experience_years: 3,
    };
  }) : MOCK_USERS.filter(u => u.role !== 'client');

  const internalUsers = rawEmployees;

  const filtered = internalUsers.filter(u => {
    const roleMatch = roleFilter === 'all' || u.role === roleFilter;
    const availMatch = availFilter === 'all' || u.availability === availFilter;
    return roleMatch && availMatch;
  });

  const availableCount = internalUsers.filter(u => u.availability === 'available').length;
  const onProjectCount = internalUsers.filter(u => u.availability === 'on_project').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Team Members"
        subtitle={`${internalUsers.length} members`}
      />

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryDot, { backgroundColor: Colors.success }]} />
          <Text style={styles.summaryText}>{availableCount} Available</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <View style={[styles.summaryDot, { backgroundColor: Colors.warning }]} />
          <Text style={styles.summaryText}>{onProjectCount} On Project</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Ionicons name="people" size={14} color={Colors.primary} />
          <Text style={styles.summaryText}>{internalUsers.length} Total</Text>
        </View>
      </View>

      {/* Role Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {ROLE_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterChip, roleFilter === f.value && styles.filterChipActive]}
            onPress={() => setRoleFilter(f.value)}
          >
            <Text style={[styles.filterText, roleFilter === f.value && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Availability Filter */}
      <View style={styles.availRow}>
        {AVAILABILITY_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.availChip, availFilter === f.value && styles.availChipActive]}
            onPress={() => setAvailFilter(f.value)}
          >
            <Text style={[styles.availText, availFilter === f.value && styles.availTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filtered.map((user) => (
          <Card key={user.id} style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <Avatar name={user.full_name} size="lg" />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{user.full_name}</Text>
                <Text style={styles.memberRole}>{user.role.replace(/_/g, ' ')}</Text>
                {user.department && (
                  <Text style={styles.memberDept}>{user.department}</Text>
                )}
              </View>
              <View style={styles.availabilityBadge}>
                <View style={[
                  styles.availDot,
                  { backgroundColor: user.availability === 'available' ? Colors.success : Colors.warning }
                ]} />
                <Text style={[
                  styles.availLabel,
                  { color: user.availability === 'available' ? Colors.success : Colors.warning }
                ]}>
                  {user.availability === 'available' ? 'Available' : 'On Project'}
                </Text>
              </View>
            </View>

            {user.skills && user.skills.length > 0 && (
              <View style={styles.skillsRow}>
                {user.skills.map((skill) => (
                  <View key={skill} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.memberFooter}>
              {user.experience_years !== undefined && (
                <View style={styles.footerItem}>
                  <Ionicons name="star-outline" size={13} color={Colors.warning} />
                  <Text style={styles.footerText}>{user.experience_years}+ years exp.</Text>
                </View>
              )}
              {(user as any).project_assigned && (
                <View style={styles.footerItem}>
                  <Ionicons name="folder-outline" size={13} color={Colors.primary} />
                  <Text style={styles.footerText}>Assigned to project</Text>
                </View>
              )}
            </View>
          </Card>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="person-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No members match filters</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: 100 },
  summary: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  summaryItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  summaryDot: { width: 8, height: 8, borderRadius: 4 },
  summaryText: { fontSize: Typography.size.xs, color: Colors.textSecondary, fontWeight: Typography.weight.medium },
  summaryDivider: { width: 1, height: 20, backgroundColor: Colors.surfaceBorder },
  filterRow: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    marginRight: Spacing.sm,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Typography.size.xs, color: Colors.textSecondary, fontWeight: Typography.weight.medium },
  filterTextActive: { color: Colors.white },
  availRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  availChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  availChipActive: { backgroundColor: Colors.accent + '20', borderColor: Colors.accent },
  availText: { fontSize: Typography.size.xs, color: Colors.textSecondary },
  availTextActive: { color: Colors.accent, fontWeight: Typography.weight.semibold },
  memberCard: { marginBottom: Spacing.sm },
  memberHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  memberInfo: { flex: 1 },
  memberName: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.textPrimary },
  memberRole: { fontSize: Typography.size.sm, color: Colors.textSecondary, textTransform: 'capitalize', marginTop: 2 },
  memberDept: { fontSize: Typography.size.xs, color: Colors.accent, marginTop: 2 },
  availabilityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  availLabel: { fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.sm },
  skillChip: {
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  skillText: { fontSize: Typography.size.xs, color: Colors.primary, fontWeight: Typography.weight.medium },
  memberFooter: { flexDirection: 'row', gap: Spacing.base },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: Typography.size.xs, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingVertical: Spacing['3xl'], gap: Spacing.base },
  emptyText: { fontSize: Typography.size.base, color: Colors.textMuted },
});
