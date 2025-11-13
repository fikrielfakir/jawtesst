export const spacing = {
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  
  screenHorizontal: 16,
  screenVertical: 20,
  bottomNav: 24,
  sectionGap: 24,
  cardPadding: 16,
} as const;

export const borderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 24,
  circle: 9999,
  pill: 9999,
} as const;

export const sizing = {
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
  },
  avatar: {
    sm: 40,
    md: 56,
    lg: 72,
    xl: 96,
  },
  button: {
    height: 52,
    heightSmall: 40,
    heightLarge: 60,
  },
  input: {
    height: 52,
    heightSmall: 40,
  },
} as const;

export const typography = {
  display: { size: 32, weight: '700' as const, lineHeight: 40 },
  title: { size: 24, weight: '600' as const, lineHeight: 32 },
  heading: { size: 20, weight: '600' as const, lineHeight: 28 },
  body: { size: 16, weight: '400' as const, lineHeight: 24 },
  bodyMedium: { size: 15, weight: '400' as const, lineHeight: 22 },
  caption: { size: 13, weight: '400' as const, lineHeight: 18 },
  label: { size: 12, weight: '600' as const, lineHeight: 16 },
  tiny: { size: 11, weight: '400' as const, lineHeight: 14 },
} as const;

export const elevation = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
