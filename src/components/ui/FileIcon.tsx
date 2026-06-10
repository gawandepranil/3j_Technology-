import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../../theme/tokens';

interface FileIconProps {
  type: string;
  size?: number;
}

const FILE_CONFIG: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  pdf:    { icon: 'document-text-outline', color: '#EF4444' },
  figma:  { icon: 'color-palette-outline', color: '#A259FF' },
  xd:     { icon: 'color-palette-outline', color: '#FF61F6' },
  zip:    { icon: 'archive-outline',       color: '#F59E0B' },
  rar:    { icon: 'archive-outline',       color: '#F59E0B' },
  png:    { icon: 'image-outline',         color: '#10B981' },
  jpg:    { icon: 'image-outline',         color: '#10B981' },
  jpeg:   { icon: 'image-outline',         color: '#10B981' },
  svg:    { icon: 'image-outline',         color: '#3B82F6' },
  mp4:    { icon: 'videocam-outline',      color: '#8B5CF6' },
  doc:    { icon: 'document-outline',      color: '#2563EB' },
  docx:   { icon: 'document-outline',      color: '#2563EB' },
  xls:    { icon: 'grid-outline',          color: '#16A34A' },
  xlsx:   { icon: 'grid-outline',          color: '#16A34A' },
  ppt:    { icon: 'easel-outline',         color: '#EA580C' },
  pptx:   { icon: 'easel-outline',         color: '#EA580C' },
};

const DEFAULT_CONFIG = { icon: 'document-outline' as keyof typeof Ionicons.glyphMap, color: Colors.textMuted };

export const FileIcon: React.FC<FileIconProps> = ({ type, size = 44 }) => {
  const config = FILE_CONFIG[type.toLowerCase()] ?? DEFAULT_CONFIG;
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size * 0.25, backgroundColor: config.color + '20' }]}>
      <Ionicons name={config.icon} size={size * 0.5} color={config.color} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
