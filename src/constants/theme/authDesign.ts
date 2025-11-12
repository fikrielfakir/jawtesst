export const authDesign = {
  colors: {
    background: '#3D3A5C',
    backgroundDark: '#2D2640',
    surface: '#FFFFFF',
    
    primary: '#6C4AB6',
    primaryDark: '#6B5CE7',
    primaryPressed: '#AE90EE',
    primaryicon: '#B9A2E1',
    
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textPlaceholder: '#9CA3AF',
    textLabel: '#E5E7EB',
    textDark: '#1F2937',
    
    border: '#5A5270',
    borderLight: '#D1D5DB',
    borderFocus: '#8B7FE8',
    
    inputBackground: '#372655',
    
    error: '#EF4444',
    disabled: '#D1D5DB',
    disabledText: '#9CA3AF',
    
    divider: '#5A5270',
    
    iconGray: '#9CA3AF',
  },
  
  typography: {
    title: {
      size: 26,
      weight: '700' as const,
      lineHeight: 32,
    },
    subtitle: {
      size: 16,
      weight: '400' as const,
      lineHeight: 24,
    },
    heading: {
      size: 22,
      weight: '700' as const,
      lineHeight: 28,
    },
    label: {
      size: 15,
      weight: '600' as const,
      lineHeight: 20,
    },
    input: {
      size: 18,
      weight: '400' as const,
      lineHeight: 24,
    },
    button: {
      size: 19,
      weight: '600' as const,
      lineHeight: 24,
    },
    error: {
      size: 12,
      weight: '400' as const,
      lineHeight: 16,
    },
    caption: {
      size: 14,
      weight: '400' as const,
      lineHeight: 20,
    },
    link: {
      size: 14,
      weight: '600' as const,
      lineHeight: 20,
    },
  },
  
  spacing: {
    fieldGap: 24,
    labelToInput: 8,
    sectionGap: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    inputPaddingHorizontal: 12,
    buttonMarginTop: 24,
    dividerMarginVertical: 24,
  },
  
  sizes: {
    inputHeight: 60,
    multiLineInputHeight: 100,
    buttonHeight: 64,
    socialButtonHeight: 48,
    cornerRadius: 15,
    borderWidth: 1,
    borderWidthFocus: 2,
    iconSize: 20,
    socialIconSize: 24,
  },
  
  accessibility: {
    minTouchTarget: 44,
    contrastRatio: 4.5,
  },
} as const;
