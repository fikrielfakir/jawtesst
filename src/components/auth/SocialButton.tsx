import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { authDesign } from '@constants/theme/authDesign';

interface SocialButtonProps {
  provider: 'google' | 'facebook';
  onPress: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ provider, onPress }) => {
  const isGoogle = provider === 'google';
  
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconContainer}>
        {isGoogle ? (
          <View style={styles.googleIcon}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
        ) : (
          <View style={styles.facebookIcon}>
            <Text style={styles.facebookIconText}>f</Text>
          </View>
        )}
      </View>
      <Text style={styles.text}>
        {isGoogle ? 'Google' : 'Facebook'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: authDesign.sizes.socialButtonHeight,
    backgroundColor: 'transparent',
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: authDesign.spacing.inputPaddingHorizontal,
    flex: 1,
  },
  iconContainer: {
    marginRight: 8,
  },
  googleIcon: {
    width: authDesign.sizes.socialIconSize,
    height: authDesign.sizes.socialIconSize,
    borderRadius: authDesign.sizes.socialIconSize / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4285F4',
  },
  facebookIcon: {
    width: authDesign.sizes.socialIconSize,
    height: authDesign.sizes.socialIconSize,
    borderRadius: authDesign.sizes.socialIconSize / 2,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebookIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  text: {
    fontSize: authDesign.typography.input.size,
    fontWeight: authDesign.typography.label.weight,
    color: authDesign.colors.textPrimary,
  },
});
