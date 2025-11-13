import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { colors } from '../../../constants/theme/colors';
import { sizing, borderRadius } from '../../../constants/theme/spacing';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  badge?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  style,
  badge,
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return sizing.avatar.sm;
      case 'md': return sizing.avatar.md;
      case 'lg': return sizing.avatar.lg;
      case 'xl': return sizing.avatar.xl;
      default: return sizing.avatar.md;
    }
  };

  const getInitials = () => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const avatarSize = getSize();

  return (
    <View style={[styles.container, { width: avatarSize, height: avatarSize }, style]}>
      {source ? (
        <Image source={source} style={[styles.image, { width: avatarSize, height: avatarSize }]} />
      ) : (
        <View style={[styles.placeholder, { width: avatarSize, height: avatarSize }]}>
          <Text style={[styles.initials, { fontSize: avatarSize * 0.4 }]}>{getInitials()}</Text>
        </View>
      )}
      {badge && <View style={styles.badge}>{badge}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    borderRadius: borderRadius.circle,
  },
  placeholder: {
    borderRadius: borderRadius.circle,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
