import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../../constants/theme/colors';
import { sizing, borderRadius } from '../../../constants/theme/spacing';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'md',
  variant = 'default',
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 32;
      case 'md': return 40;
      case 'lg': return 48;
      default: return 40;
    }
  };

  const buttonSize = getSize();

  const buttonStyle: ViewStyle = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: variant === 'filled' ? colors.surface : 'transparent',
  };

  return (
    <TouchableOpacity style={[buttonStyle, style]} onPress={onPress} activeOpacity={0.7}>
      {icon}
    </TouchableOpacity>
  );
};
