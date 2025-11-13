import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, ListItem, Divider } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, typography, borderRadius } from '../../constants/theme/spacing';

export const SettingsScreen = () => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.group}>
          <ListItem
            title="Account Details"
            subtitle="Manage your account details"
            leftIcon={<View style={styles.iconBg}><Text style={styles.icon}>👤</Text></View>}
            rightIcon={<Text style={styles.chevron}>›</Text>}
            onPress={() => {}}
          />
          <ListItem
            title="Change Password"
            subtitle="Change your password"
            leftIcon={<View style={styles.iconBg}><Text style={styles.icon}>🔒</Text></View>}
            rightIcon={<Text style={styles.chevron}>›</Text>}
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.group}>
          <ListItem
            title="Notification Settings"
            subtitle="Customize your notification preferences"
            leftIcon={<View style={styles.iconBg}><Text style={styles.icon}>🔔</Text></View>}
            rightIcon={<Text style={styles.chevron}>›</Text>}
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.group}>
          <ListItem
            title="Privacy Settings"
            subtitle="Manage your privacy settings"
            leftIcon={<View style={styles.iconBg}><Text style={styles.icon}>🛡️</Text></View>}
            rightIcon={<Text style={styles.chevron}>›</Text>}
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.group}>
          <ListItem
            title="App Version"
            subtitle="1.2.3"
            leftIcon={<View style={styles.iconBg}><Text style={styles.icon}>ℹ️</Text></View>}
            rightIcon={<Text style={styles.chevron}>›</Text>}
            onPress={() => {}}
          />
          <ListItem
            title="Legal"
            subtitle="Terms of Service & Privacy Policy"
            leftIcon={<View style={styles.iconBg}><Text style={styles.icon}>📋</Text></View>}
            rightIcon={<Text style={styles.chevron}>›</Text>}
            onPress={() => {}}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.l,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.title.size,
    fontWeight: typography.title.weight as any,
    color: colors.text,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.heading.size,
    fontWeight: typography.heading.weight as any,
    color: colors.text,
    marginBottom: spacing.m,
  },
  group: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  chevron: {
    fontSize: 20,
    color: colors.textSecondary,
  },
});
