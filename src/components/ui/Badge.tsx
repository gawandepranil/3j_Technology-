import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/tokens';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' |
  'lead_new' | 'lead_meeting' | 'lead_proposal' | 'lead_approved' | 'lead_rejected';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  primary: { bg: '#0066FF20', text: Colors.primary, border: '#0066FF40' },
  success: { bg: '#10B98120', text: Colors.success, border: '#10B98140' },
  warning: { bg: '#F59E0B20', text: Colors.warning, border: '#F59E0B40' },
  error: { bg: '#EF444420', text: Colors.error, border: '#EF444440' },
  info: { bg: '#3B82F620', text: Colors.info, border: '#3B82F640' },
  neutral: { bg: '#37415120', text: Colors.textSecondary, border: '#37415140' },
  lead_new: { bg: '#3B82F620', text: '#3B82F6', border: '#3B82F640' },
  lead_meeting: { bg: '#F59E0B20', text: '#F59E0B', border: '#F59E0B40' },
  lead_proposal: { bg: '#8B5CF620', text: '#8B5CF6', border: '#8B5CF640' },
  lead_approved: { bg: '#10B98120', text: Colors.success, border: '#10B98140' },
  lead_rejected: { bg: '#EF444420', text: Colors.error, border: '#EF444440' },
};

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', size = 'sm', style }) => {
  const colors = variantColors[variant];
  return (
    <View
      style={[
        styles.badge,
        size === 'md' ? styles.badgeMd : styles.badgeSm,
        { backgroundColor: colors.bg, borderColor: colors.border },
        style,
      ]}
    >
      <Text style={[styles.text, size === 'md' ? styles.textMd : styles.textSm, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  badgeMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  text: {
    fontWeight: Typography.weight.semibold,
  },
  textSm: { fontSize: Typography.size.xs },
  textMd: { fontSize: Typography.size.sm },
});
