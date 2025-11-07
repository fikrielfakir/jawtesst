export const spacing = {
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  
  screenHorizontal: 16,
  screenVertical: 20,
  bottomNav: 24,
} as const;

export const borderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 24,
  circle: 9999,
  pill: 9999,
} as const;

export const typography = {
  h1: { size: 32, weight: '700' as const, lineHeight: 1.2 },
  h2: { size: 28, weight: '700' as const, lineHeight: 1.2 },
  h3: { size: 24, weight: '600' as const, lineHeight: 1.3 },
  h4: { size: 20, weight: '600' as const, lineHeight: 1.3 },
  h5: { size: 18, weight: '600' as const, lineHeight: 1.3 },
  bodyLarge: { size: 16, weight: '400' as const, lineHeight: 1.5 },
  bodyMedium: { size: 15, weight: '400' as const, lineHeight: 1.5 },
  bodySmall: { size: 14, weight: '400' as const, lineHeight: 1.5 },
  caption: { size: 13, weight: '400' as const, lineHeight: 1.4 },
  smallCaption: { size: 12, weight: '400' as const, lineHeight: 1.4 },
  tiny: { size: 11, weight: '400' as const, lineHeight: 1.4 },
} as const;
