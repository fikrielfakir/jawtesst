import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ScreenContainer, Input, Button, Divider, ListItem } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, typography, borderRadius } from '../../constants/theme/spacing';

export const AccountSettingsScreen = () => {
  const [name, setName] = useState('Khouala');
  const [email, setEmail] = useState('kha@gmail.com');
  const [phone, setPhone] = useState('+21212345678');

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Account Settings</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/96' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editBadge} activeOpacity={0.7}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>Khouala</Text>
        <Text style={styles.profileRole}>Restaurant owner</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          containerStyle={styles.inputSpacing}
        />
        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone"
          keyboardType="phone-pad"
          containerStyle={styles.inputSpacing}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <ListItem
          title="Chnge password"
          leftIcon={<Text style={styles.icon}>🔒</Text>}
          rightIcon={<Text style={styles.chevron}>›</Text>}
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paiment</Text>
        <ListItem
          title="Credit Crad"
          leftIcon={<Text style={styles.icon}>💳</Text>}
          rightIcon={<Text style={styles.chevron}>›</Text>}
          onPress={() => {}}
        />
      </View>

      <Button
        title="Delete Account"
        onPress={() => {}}
        variant="danger"
        fullWidth
        style={styles.deleteButton}
      />
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
  profileSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.m,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.circle,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  editIcon: {
    fontSize: 16,
  },
  profileName: {
    fontSize: typography.title.size,
    fontWeight: typography.title.weight as any,
    color: colors.text,
  },
  profileRole: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  form: {
    marginBottom: spacing.xxl,
  },
  inputSpacing: {
    marginTop: spacing.m,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.m,
  },
  icon: {
    fontSize: 20,
  },
  chevron: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  deleteButton: {
    marginTop: spacing.xl,
  },
});
