export const colors = {
  primary: '#FF6B35',
  primaryLight: '#FF8F65',
  secondary: '#2EC4B6',
  accent: '#E71D36',
  background: ['#FFF5F0', '#FFE8D6', '#F0E6FF'] as const,
  card: 'rgba(255, 255, 255, 0.55)',
  cardBorder: 'rgba(255, 255, 255, 0.8)',
  text: '#1A1A2E',
  textSecondary: '#555577',
  textLight: '#8888AA',
  white: '#FFFFFF',
  black: '#1A1A2E',
  success: '#2EC4B6',
  danger: '#E71D36',
  warning: '#FFB627',
  online: '#2EC4B6',
  offline: '#CCCCDD',
  vegGreen: '#22AA22',
  nonVegRed: '#CC3333',
  allergenBg: '#FFF0E0',
  allergenText: '#AA6600',
  chipBg: 'rgba(255, 107, 53, 0.12)',
  chipActiveBg: '#FF6B35',
  chipText: '#FF6B35',
  chipActiveText: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 17, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, color: colors.textSecondary },
  caption: { fontSize: 11, fontWeight: '500' as const, color: colors.textLight },
  button: { fontSize: 16, fontWeight: '600' as const },
};
