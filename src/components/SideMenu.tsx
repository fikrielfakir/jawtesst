import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch } from 'react-native';
import { colors } from '../constants/theme/colors';
import { spacing, typography, borderRadius } from '../constants/theme/spacing';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, value, onPress, rightElement }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuLeft}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    {value && <Text style={styles.menuValue}>{value}</Text>}
    {rightElement}
  </TouchableOpacity>
);

export const SideMenu = () => {
  const [darkTheme, setDarkTheme] = React.useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          source={{ uri: 'https://via.placeholder.com/56' }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Khouala</Text>
          <Text style={styles.username}>@khoula_els</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <MenuItem
          icon={<Text style={styles.emoji}>👤</Text>}
          label="Profile"
          onPress={() => {}}
        />
        <MenuItem
          icon={<Text style={styles.emoji}>📅</Text>}
          label="Bookings"
          onPress={() => {}}
        />
        <MenuItem
          icon={<Text style={styles.emoji}>🔔</Text>}
          label="Notifications"
          onPress={() => {}}
        />
      </View>

      <View style={styles.menuSection}>
        <MenuItem
          icon={<Text style={styles.emoji}>💎</Text>}
          label="Premier Plan"
          onPress={() => {}}
        />
        <MenuItem
          icon={<Text style={styles.emoji}>🤝</Text>}
          label="Become partner"
          onPress={() => {}}
        />
      </View>

      <View style={styles.menuSection}>
        <MenuItem
          icon={<Text style={styles.emoji}>🌐</Text>}
          label="Language"
          value="English"
          onPress={() => {}}
        />
        <MenuItem
          icon={<Text style={styles.emoji}>🌙</Text>}
          label="Dark Theme"
          rightElement={
            <Switch
              value={darkTheme}
              onValueChange={setDarkTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          }
        />
        <MenuItem
          icon={<Text style={styles.emoji}>⚙️</Text>}
          label="Settings"
          onPress={() => {}}
        />
      </View>

      <View style={styles.menuSection}>
        <MenuItem
          icon={<Text style={styles.emoji}>💬</Text>}
          label="Contact Us"
          onPress={() => {}}
        />
        <MenuItem
          icon={<Text style={styles.emoji}>📋</Text>}
          label="Terms & Conditions"
          onPress={() => {}}
        />
        <MenuItem
          icon={<Text style={styles.emoji}>❓</Text>}
          label="FAQ"
          onPress={() => {}}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>JAW (v0.1)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xxl,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.l,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.circle,
    marginRight: spacing.m,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: typography.heading.size,
    fontWeight: typography.heading.weight as any,
    color: colors.text,
  },
  username: {
    fontSize: typography.bodyMedium.size,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  menuSection: {
    marginBottom: spacing.l,
    paddingHorizontal: spacing.screenHorizontal,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.m,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 24,
    marginRight: spacing.m,
  },
  emoji: {
    fontSize: 18,
  },
  menuLabel: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
  },
  menuValue: {
    fontSize: typography.body.size,
    color: colors.textTertiary,
    marginRight: spacing.s,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.screenHorizontal,
  },
  version: {
    fontSize: typography.caption.size,
    color: colors.textMuted,
  },
});
