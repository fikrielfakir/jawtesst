import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ScreenContainer, Button } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, typography, borderRadius } from '../../constants/theme/spacing';

const NotificationItem = ({ avatar, name, message, time, thumbnail, action }: any) => (
  <View style={styles.notificationItem}>
    <Image source={{ uri: avatar || 'https://via.placeholder.com/40' }} style={styles.avatar} />
    <View style={styles.notificationContent}>
      <Text style={styles.message}>
        <Text style={styles.name}>{name}</Text> {message}
      </Text>
      <Text style={styles.time}>{time}</Text>
    </View>
    {thumbnail && (
      <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
    )}
    {action && (
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionText}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const NotificationsScreen = () => {
  const yesterdayNotifications = [
    { id: '1', name: 'Mohamed Johnson', message: 'just shared a new new reel.', time: '9h', thumbnail: 'https://via.placeholder.com/60' },
    { id: '2', name: 'Mohamed Johnson', message: 'just shared a new new reel.', time: '9h', thumbnail: 'https://via.placeholder.com/60' },
    { id: '3', name: 'Mohamed Johnson', message: 'just shared a new new reel.', time: '9h', action: 'Follow' },
  ];

  const last7DaysNotifications = [
    { id: '4', name: 'Mohamed Johnson', message: 'just shared a new new reel.', time: '9h', thumbnail: 'https://via.placeholder.com/60' },
    { id: '5', name: 'Mohamed Johnson', message: 'just shared a new new reel.', time: '9h', thumbnail: 'https://via.placeholder.com/60' },
    { id: '6', name: 'Mohamed Johnson', message: 'just shared a new new reel.', time: '9h', thumbnail: 'https://via.placeholder.com/60' },
    { id: '7', name: 'Mohamed Johnson', message: 'just shared a new new reel.', time: '9h', thumbnail: 'https://via.placeholder.com/60' },
    { id: '8', name: 'Mohamed Johnson', message: 'just shared a new new reel.', time: '9h', thumbnail: 'https://via.placeholder.com/60' },
    { id: '9', name: 'Mohamed Johnson', message: 'just shared a new new reel.', time: '9h', thumbnail: 'https://via.placeholder.com/60' },
  ];

  return (
    <ScreenContainer padding={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Notification</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yesterday</Text>
          {yesterdayNotifications.map(notif => (
            <NotificationItem key={notif.id} {...notif} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>last 7 days</Text>
          {last7DaysNotifications.map(notif => (
            <NotificationItem key={notif.id} {...notif} />
          ))}
        </View>

        <Button
          title="Show more"
          onPress={() => {}}
          variant="secondary"
          fullWidth
          style={styles.showMoreButton}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.screenHorizontal,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.title.size,
    fontWeight: typography.title.weight as any,
    color: colors.text,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.circle,
    marginRight: spacing.m,
  },
  notificationContent: {
    flex: 1,
  },
  message: {
    fontSize: typography.bodyMedium.size,
    color: colors.textSecondary,
  },
  name: {
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: typography.caption.size,
    color: colors.textTertiary,
    marginTop: spacing.xxs,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.medium,
    marginLeft: spacing.s,
  },
  actionButton: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.small,
    marginLeft: spacing.s,
  },
  actionText: {
    fontSize: typography.caption.size,
    fontWeight: '600',
    color: colors.white,
  },
  showMoreButton: {
    marginTop: spacing.l,
  },
});
