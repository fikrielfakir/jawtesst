import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Avatar } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, sizing, typography } from '../../constants/theme/spacing';

interface Chef {
  id: string;
  name: string;
  avatar: any;
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
  image: any;
  likes: string;
  photos: number;
  rating: number;
}

const chefs: Chef[] = [
  { id: '1', name: 'Mohamed', avatar: require('../../../assets/onboarding/dining-experience.png') },
  { id: '2', name: 'Janes', avatar: require('../../../assets/onboarding/restaurant-owners.png') },
  { id: '3', name: 'Moro', avatar: require('../../../assets/onboarding/booking-table.png') },
  { id: '4', name: 'Khaoula', avatar: require('../../../assets/onboarding/reviews-sharing.png') },
  { id: '5', name: 'Michel', avatar: require('../../../assets/onboarding/dining-experience.png') },
];

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Restaurant name',
    location: 'Sophie, Tanger',
    image: require('../../../assets/home/fine_dining_elegant__246bdcc1.jpg'),
    likes: '2k',
    photos: 23,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Restaurant name',
    location: 'Sophie, Tanger',
    image: require('../../../assets/home/moroccan_tagine_food_784bfa11.jpg'),
    likes: '1.5k',
    photos: 18,
    rating: 4.7,
  },
];

const categoryTitles: Record<string, string> = {
  'cafe': 'Best Cafes',
  'morocco-way': 'Best Morocco Way',
  'fine-dining': 'Best Fine Dining',
  'dance': 'Best Dance Clubs',
  'lounge-pub': 'Best Lounges & Pubs',
  'chiringuito': 'Best Chiringuitos',
};

export function FeedScreen() {
  const params = useLocalSearchParams();
  const category = (params.category as string) || 'cafe';
  const categoryTitle = categoryTitles[category] || 'Best Chef';
  const renderChefItem = ({ item }: { item: Chef }) => (
    <TouchableOpacity style={styles.chefItem}>
      <Avatar
        source={item.avatar}
        size="lg"
      />
      <Text style={styles.chefName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRestaurantCard = (restaurant: Restaurant) => (
    <View key={restaurant.id} style={styles.restaurantCard}>
      <Image
        source={restaurant.image}
        style={styles.restaurantImage}
        resizeMode="cover"
      />
      <View style={styles.restaurantOverlay}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.restaurantLocation}>{restaurant.location}</Text>
        
        <View style={styles.restaurantStats}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>♥</Text>
            <Text style={styles.statText}>{restaurant.likes}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🖼</Text>
            <Text style={styles.statText}>{restaurant.photos}</Text>
          </View>
          
          <View style={styles.ratingBadge}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Avatar
            source={require('../../../assets/onboarding/dining-experience.png')}
            size="md"
          />
        </TouchableOpacity>
        
        <Text style={styles.logo}>נשבר</Text>
        
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Title */}
        <Text style={styles.categoryTitle}>{categoryTitle}</Text>

        {/* Chef List */}
        <FlatList
          data={chefs}
          renderItem={renderChefItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chefList}
        />

        {/* Restaurant Cards */}
        <View style={styles.restaurantList}>
          {restaurants.map(renderRestaurantCard)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    paddingTop: spacing.xxxl,
    backgroundColor: colors.background,
  },
  logo: {
    fontSize: typography.title.size,
    fontWeight: '700',
    color: colors.text,
  },
  notificationButton: {
    position: 'relative',
  },
  bellIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: typography.heading.size,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: spacing.m,
    marginTop: spacing.l,
    marginBottom: spacing.m,
  },
  chefList: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.l,
  },
  chefItem: {
    alignItems: 'center',
    marginRight: spacing.m,
  },
  chefName: {
    fontSize: typography.caption.size,
    color: colors.text,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  restaurantList: {
    paddingHorizontal: spacing.m,
    gap: spacing.m,
    paddingBottom: 80,
  },
  restaurantCard: {
    borderRadius: spacing.s,
    overflow: 'hidden',
    marginBottom: spacing.m,
  },
  restaurantImage: {
    width: '100%',
    height: 300,
  },
  restaurantOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: spacing.m,
  },
  restaurantName: {
    fontSize: typography.heading.size,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  restaurantLocation: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
  restaurantStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    fontSize: typography.body.size,
    color: colors.text,
    fontWeight: '500',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.xs,
    marginLeft: 'auto',
    gap: spacing.xxs,
  },
  starIcon: {
    fontSize: 16,
  },
  ratingText: {
    fontSize: typography.body.size,
    color: colors.text,
    fontWeight: '700',
  },
});
