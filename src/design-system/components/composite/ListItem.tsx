import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../../constants/theme/colors';
import { spacing, borderRadius, typography } from '../../../constants/theme/spacing';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  style,
}) => {
  const Content = (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.xs,
  },
  leftIcon: {
    marginRight: spacing.m,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.body.size,
    fontWeight: '400',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.caption.size,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  rightIcon: {
    marginLeft: spacing.m,
  },
});
