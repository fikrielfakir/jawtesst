import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { authDesign } from '@constants/theme/authDesign';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        (disabled || loading) && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? authDesign.colors.textPrimary : authDesign.colors.primary} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
            (disabled || loading) && styles.disabledButtonText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: authDesign.sizes.buttonHeight,
    borderRadius: authDesign.sizes.cornerRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: authDesign.spacing.buttonMarginTop,
  },
  primaryButton: {
    backgroundColor: authDesign.colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
  },
  disabledButton: {
    backgroundColor: authDesign.colors.disabled,
    opacity: 0.6,
  },
  buttonText: {
    fontSize: authDesign.typography.button.size,
    fontWeight: authDesign.typography.button.weight,
  },
  primaryButtonText: {
    color: authDesign.colors.textPrimary,
  },
  secondaryButtonText: {
    color: authDesign.colors.textSecondary,
  },
  disabledButtonText: {
    color: authDesign.colors.disabledText,
  },
});
