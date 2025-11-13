import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenContainer, Button, TabBar } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, typography, borderRadius } from '../../constants/theme/spacing';

export const ProfileScreen = ({ variant = 'user' }: { variant?: 'user' | 'owner' }) => {
  const [activeTab, setActiveTab] = useState(variant === 'owner' ? 'posts' : 'favorite');

  const ownerTabs = [
    { key: 'posts', label: 'Posts', icon: <Text style={styles.tabIcon}>📋</Text> },
    { key: 'favorite', label: 'Favorite', icon: <Text style={styles.tabIcon}>❤️</Text> },
    { key: 'reviews', label: 'Reviews', icon: <Text style={styles.tabIcon}>⭐</Text> },
  ];

  const userTabs = [
    { key: 'favorite', label: 'Favorite', icon: <Text style={styles.tabIcon}>❤️</Text> },
    { key: 'bookmark', label: 'Bookmark', icon: <Text style={styles.tabIcon}>🔖</Text> },
  ];

  const tabs = variant === 'owner' ? ownerTabs : userTabs;

  return (
    <ScreenContainer padding={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity style={styles.settingsIcon}>
          <Text style={styles.icon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/96' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Khouala</Text>
        <Text style={styles.role}>Restaurant owner</Text>
        <Text style={styles.bio}>
          Le lorem ipsum est, en imprimerie, une suite de mots sans signification
        </Text>

        <View style={styles.actions}>
          <Button
            title="Edit Profile"
            onPress={() => {}}
            variant="tertiary"
            style={styles.actionButton}
          />
          <Button
            title="Insight"
            onPress={() => {}}
            variant="tertiary"
            style={styles.actionButton}
          />
        </View>
      </View>

      {variant === 'owner' && (
        <View style={styles.restaurantSection}>
          <Text style={styles.sectionTitle}>My Restaurant</Text>
          <View style={styles.restaurantGrid}>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.restaurantItem}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/100' }}
                  style={styles.restaurantImage}
                />
                <Text style={styles.restaurantName}>Restaurant 01</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <View style={styles.gallery}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Image
            key={i}
            source={{ uri: 'https://via.placeholder.com/120' }}
            style={styles.galleryImage}
          />
        ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.screenHorizontal,
  },
  title: {
    fontSize: typography.title.size,
    fontWeight: typography.title.weight as any,
    color: colors.text,
  },
  settingsIcon: {
    padding: spacing.xs,
  },
  icon: {
    fontSize: 24,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.circle,
    marginBottom: spacing.m,
  },
  name: {
    fontSize: typography.title.size,
    fontWeight: typography.title.weight as any,
    color: colors.text,
  },
  role: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  bio: {
    fontSize: typography.bodyMedium.size,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.s,
    lineHeight: typography.bodyMedium.lineHeight,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.m,
    marginTop: spacing.l,
  },
  actionButton: {
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  restaurantSection: {
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.heading.size,
    fontWeight: typography.heading.weight as any,
    color: colors.text,
    marginBottom: spacing.m,
  },
  restaurantGrid: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  restaurantItem: {
    alignItems: 'center',
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.xs,
  },
  restaurantName: {
    fontSize: typography.caption.size,
    color: colors.text,
  },
  tabIcon: {
    fontSize: 16,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.xxs,
  },
  galleryImage: {
    width: '33.33%',
    aspectRatio: 1,
    padding: spacing.xxs,
  },
});
