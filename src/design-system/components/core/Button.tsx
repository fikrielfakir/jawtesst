import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { colors } from '../../../constants/theme/colors';
import { spacing, borderRadius, sizing, typography } from '../../../constants/theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: size === 'small' ? sizing.button.heightSmall : size === 'large' ? sizing.button.heightLarge : sizing.button.height,
      borderRadius: borderRadius.medium,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      gap: spacing.xs,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (variant === 'primary') {
      baseStyle.backgroundColor = disabled ? colors.darkGray : colors.buttonPrimary;
    } else if (variant === 'secondary') {
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = disabled ? colors.darkGray : colors.border;
    } else if (variant === 'tertiary') {
      baseStyle.backgroundColor = 'transparent';
    } else if (variant === 'danger') {
      baseStyle.backgroundColor = disabled ? colors.darkGray : colors.error;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: typography.body.size,
      fontWeight: '600',
      color: disabled ? colors.textMuted : colors.text,
    };

    if (variant === 'secondary' || variant === 'tertiary') {
      baseStyle.color = disabled ? colors.textMuted : colors.primary;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? colors.white : colors.primary} />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
