export const FIXED = {
  purple: '#7C3AED',
  sos: '#FF4D6D',
} as const;

export const DARK = {
  bgPrimary: '#120F1E',
  bgDeep: '#0C0A1E',
  bgSos: '#08061A',
  bgSurface: '#1E1B30',
  bgCard: 'rgba(255, 255, 255, 0.04)',
  bgCardBorder: 'rgba(255, 255, 255, 0.06)',
  accent: '#A78BFA',
  accentSoft: '#C4B5FD',
  accentBg: 'rgba(124, 58, 237, 0.12)',
  accentBorder: 'rgba(167, 139, 250, 0.22)',
  emerald: '#10B981',
  emeraldBg: 'rgba(16, 185, 129, 0.10)',
  emeraldBorder: 'rgba(16, 185, 129, 0.18)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.55)',
  textMuted: 'rgba(255, 255, 255, 0.25)',
  textDisabled: 'rgba(255, 255, 255, 0.12)',
  navBg: '#120F1E',
  navBorder: 'rgba(255, 255, 255, 0.05)',
  divider: 'rgba(255, 255, 255, 0.05)',
  dividerStrong: 'rgba(255, 255, 255, 0.10)',
} as const;

export const LIGHT = {
  bgPrimary: '#F8F7FF',
  bgDeep: '#EDE9FC',
  bgSos: '#F0EEFF',
  bgSurface: '#FFFFFF',
  bgCard: 'rgba(124, 58, 237, 0.05)',
  bgCardBorder: 'rgba(124, 58, 237, 0.08)',
  accent: '#7C3AED',
  accentSoft: '#6D28D9',
  accentBg: 'rgba(124, 58, 237, 0.08)',
  accentBorder: 'rgba(124, 58, 237, 0.18)',
  emerald: '#059669',
  emeraldBg: 'rgba(5, 150, 105, 0.07)',
  emeraldBorder: 'rgba(5, 150, 105, 0.18)',
  textPrimary: '#0F0C1E',
  textSecondary: 'rgba(15, 12, 30, 0.55)',
  textMuted: 'rgba(15, 12, 30, 0.35)',
  textDisabled: 'rgba(15, 12, 30, 0.15)',
  navBg: '#FFFFFF',
  navBorder: 'rgba(124, 58, 237, 0.10)',
  divider: 'rgba(15, 12, 30, 0.06)',
  dividerStrong: 'rgba(15, 12, 30, 0.12)',
} as const;

export const FONTS = {
  regular: { fontFamily: 'Poppins_400Regular' },
  bold: { fontFamily: 'Poppins_700Bold' },
  black: { fontFamily: 'Poppins_800ExtraBold' },
} as const;

export const RADII = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;
