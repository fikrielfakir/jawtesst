import React from 'react';
import { TextInput, View, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { colors } from '../../../constants/theme/colors';
import { spacing, borderRadius, sizing, typography } from '../../../constants/theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          {...props}
        />
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: typography.caption.size,
    fontWeight: typography.caption.weight,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    height: sizing.input.height,
    paddingHorizontal: spacing.m,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: typography.body.size,
    color: colors.text,
    height: '100%',
  },
  iconContainer: {
    marginRight: spacing.s,
  },
  rightIconContainer: {
    marginLeft: spacing.s,
  },
  errorText: {
    fontSize: typography.caption.size,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
