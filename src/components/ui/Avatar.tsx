import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme/tokens';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

const sizeMap = {
  sm: { container: 32, text: 12 },
  md: { container: 44, text: 16 },
  lg: { container: 56, text: 20 },
  xl: { container: 72, text: 26 },
};

const colorPalette = [
  ['#0066FF', '#0047B3'],
  ['#00D4AA', '#009E7F'],
  ['#8B5CF6', '#6D28D9'],
  ['#F59E0B', '#D97706'],
  ['#EF4444', '#DC2626'],
  ['#3B82F6', '#2563EB'],
];

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash;
  return colorPalette[hash % colorPalette.length];
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', style }) => {
  const dims = sizeMap[size];
  const [bg, bgDark] = getColor(name);
  return (
    <View
      style={[
        styles.container,
        {
          width: dims.container,
          height: dims.container,
          borderRadius: dims.container / 2,
          backgroundColor: bg,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: dims.text }]}>{getInitials(name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
  },
});
