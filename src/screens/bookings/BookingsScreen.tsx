import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ScreenContainer, TabBar, StatusBadge } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, typography, borderRadius } from '../../constants/theme/spacing';

const BookingCard = ({ restaurant, time, guests, section, status, date }: any) => (
  <View style={styles.bookingCard}>
    <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.restaurantImage} />
    <View style={styles.bookingInfo}>
      <Text style={styles.restaurantName}>{restaurant}</Text>
      <View style={styles.details}>
        <Text style={styles.detailText}>🕐 {time}</Text>
        <Text style={styles.detailText}>👥 Guests: {guests}</Text>
        <Text style={styles.detailText}>🍷 {section}</Text>
      </View>
      {status && <StatusBadge status={status} label={status.charAt(0).toUpperCase() + status.slice(1)} style={styles.statusBadge} />}
    </View>
    {status && (
      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuDots}>⋮</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const BookingsScreen = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const tabs = [
    { key: 'upcoming', label: 'Upcoming', icon: <Text style={styles.tabIcon}>⏳</Text> },
    { key: 'past', label: 'Past', icon: <Text style={styles.tabIcon}>🕐</Text> },
  ];

  const upcomingBookings = [
    { id: '1', section: 'Today', restaurant: 'The Golden Spon', time: '7:30 PM', guests: 2, vipSection: 'VIP Lounge', status: 'approved' as const },
    { id: '2', section: 'Tomorrow', restaurant: 'The Golden Spon', time: '7:30 PM', guests: 2, vipSection: 'VIP Lounge', status: 'pending' as const },
    { id: '3', section: '20/02/2026', restaurant: 'The Golden Spon', time: '7:30 PM', guests: 2, vipSection: 'VIP Lounge', status: 'closed' as const },
  ];

  const pastBookings = [
    { id: '1', section: 'Yesterday', restaurant: 'The Golden Spon', time: '7:30 PM', guests: 2, vipSection: 'VIP Lounge', status: undefined },
    { id: '2', section: 'Last week', restaurant: 'The Golden Spon', time: '7:30 PM', guests: 2, vipSection: 'VIP Lounge', status: undefined },
    { id: '3', section: 'last month', restaurant: 'The Golden Spon', time: '7:30 PM', guests: 2, vipSection: 'VIP Lounge', status: undefined },
  ];

  const bookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <ScreenContainer padding={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
      </View>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <View style={styles.content}>
        {bookings.map((booking) => (
          <View key={booking.id}>
            <Text style={styles.sectionTitle}>{booking.section}</Text>
            <BookingCard
              restaurant={booking.restaurant}
              time={booking.time}
              guests={booking.guests}
              section={booking.vipSection}
              status={booking.status}
            />
          </View>
        ))}
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
  tabIcon: {
    fontSize: 16,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.heading.size,
    fontWeight: typography.heading.weight as any,
    color: colors.text,
    marginBottom: spacing.m,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: spacing.m,
    marginBottom: spacing.l,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.medium,
    marginRight: spacing.m,
  },
  bookingInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  details: {
    gap: spacing.xxs,
  },
  detailText: {
    fontSize: typography.caption.size,
    color: colors.textSecondary,
  },
  statusBadge: {
    marginTop: spacing.xs,
  },
  menuButton: {
    padding: spacing.xs,
  },
  menuDots: {
    fontSize: 20,
    color: colors.textSecondary,
  },
});
