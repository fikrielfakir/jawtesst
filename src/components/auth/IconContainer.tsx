import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { authDesign } from '@constants/theme/authDesign';

interface IconContainerProps {
  children: ReactNode;
  size?: number;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  children,
  size = 80,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: authDesign.colors.border,
    backgroundColor: 'rgba(91, 82, 112, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
});
