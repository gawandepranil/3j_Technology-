import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/tokens';

interface SkillChipProps {
  label: string;
  color?: string;
}

export const SkillChip: React.FC<SkillChipProps> = ({ label, color = Colors.primary }) => (
  <View style={[styles.chip, { backgroundColor: color + '18', borderColor: color + '35' }]}>
    <Text style={[styles.label, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },
});
