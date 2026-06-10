// Color palette and design tokens for 3J Technologies
export const Colors = {
  // Primary brand colors
  primary: '#eab308',
  primaryLight: '#fef08a',
  primaryDark: '#ca8a04',

  // Accent
  accent: '#f59e0b',
  accentLight: '#fef08a',
  accentDark: '#b45309',

  // Backgrounds
  background: '#070b13',
  surface: '#0f172a',
  surfaceElevated: '#1e293b',
  surfaceBorder: '#2e3d5c',

  // Text
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textInverse: '#070b13',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Gradients (used as array for LinearGradient)
  gradientPrimary: ['#eab308', '#f97316'] as [string, string],
  gradientDark: ['#070b13', '#0f172a'] as [string, string],
  gradientCard: ['#1e293b', '#0f172a'] as [string, string],
  gradientBlue: ['#ca8a04', '#eab308'] as [string, string],

  // Lead status
  leadNew: '#3B82F6',
  leadMeeting: '#F59E0B',
  leadProposal: '#8B5CF6',
  leadApproved: '#10B981',
  leadRejected: '#EF4444',

  // Milestone status
  milestoneComplete: '#10B981',
  milestoneActive: '#0066FF',
  milestonePending: '#374151',

  // White/Black
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const Typography = {
  // Font families (will rely on system fonts; use Outfit if loaded)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  // Font sizes
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },

  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: {
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
};
