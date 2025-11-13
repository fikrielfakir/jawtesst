import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/theme/colors';
import { spacing, borderRadius, elevation } from '../../../constants/theme/spacing';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onPress,
  style,
  padding = spacing.cardPadding,
}) => {
  const cardStyle: ViewStyle = {
    backgroundColor: variant === 'elevated' ? colors.cardElevated : colors.card,
    borderRadius: borderRadius.medium,
    padding,
    ...(variant === 'elevated' ? elevation.small : {}),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
