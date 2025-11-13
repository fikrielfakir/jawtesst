import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../../constants/theme/colors';
import { spacing, borderRadius, typography } from '../../../constants/theme/spacing';

interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'closed';
  label: string;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, style }) => {
  const getBackgroundColor = () => {
    switch (status) {
      case 'approved': return colors.status.approved;
      case 'pending': return colors.status.pending;
      case 'closed': return colors.status.closed;
      default: return colors.darkGray;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getBackgroundColor() }, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.small,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.label.size,
    fontWeight: typography.label.weight,
    color: colors.background,
  },
});
