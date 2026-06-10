import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyUpdate } from '../../types';
import { Avatar } from './Avatar';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/tokens';

interface UpdateCardProps {
  update: DailyUpdate;
}

export const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => (
  <View style={styles.card}>
    {/* Header */}
    <View style={styles.header}>
      <Avatar name={update.user_name} size="sm" />
      <View style={styles.headerInfo}>
        <Text style={styles.userName}>{update.user_name}</Text>
        <Text style={styles.userRole}>{update.user_role}</Text>
      </View>
      <View style={styles.projectTag}>
        <Text style={styles.projectTagText} numberOfLines={1}>{update.project_name}</Text>
      </View>
    </View>

    {/* Sections */}
    <UpdateSection
      icon="checkmark-circle-outline"
      color={Colors.success}
      label="Today"
      text={update.today_work}
    />
    {update.blockers && update.blockers !== 'No blockers.' ? (
      <UpdateSection
        icon="alert-circle-outline"
        color={Colors.warning}
        label="Blockers"
        text={update.blockers}
      />
    ) : (
      <View style={styles.noBlockers}>
        <Ionicons name="shield-checkmark-outline" size={12} color={Colors.success} />
        <Text style={styles.noBlockersText}>No blockers</Text>
      </View>
    )}
    <UpdateSection
      icon="arrow-forward-circle-outline"
      color={Colors.info}
      label="Tomorrow"
      text={update.tomorrow_plan}
    />

    {/* Footer */}
    <View style={styles.footer}>
      <Ionicons name="calendar-outline" size={11} color={Colors.textMuted} />
      <Text style={styles.date}>{update.date}</Text>
    </View>
  </View>
);

const UpdateSection = ({
  icon, color, label, text,
}: { icon: keyof typeof Ionicons.glyphMap; color: string; label: string; text: string }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={13} color={color} />
      <Text style={[styles.sectionLabel, { color }]}>{label}</Text>
    </View>
    <Text style={styles.sectionText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerInfo: { flex: 1, marginLeft: Spacing.sm },
  userName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  userRole: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  projectTag: {
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    maxWidth: 120,
  },
  projectTagText: {
    fontSize: Typography.size.xs,
    color: Colors.primary,
    fontWeight: Typography.weight.medium,
  },
  section: { marginBottom: Spacing.sm },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  sectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    paddingLeft: 17,
  },
  noBlockers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
    paddingLeft: 0,
  },
  noBlockersText: {
    fontSize: Typography.size.xs,
    color: Colors.success,
    fontWeight: Typography.weight.medium,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  date: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
});
