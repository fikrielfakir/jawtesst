import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Heart, MessageCircle, Star } from '@tamagui/lucide-icons';
import { colors } from '@constants/theme/colors';
import { spacing, borderRadius, sizing, typography } from '@constants/theme/spacing';

interface Chef {
  id: string;
  name: string;
  avatar: any;
  borderColor: string;
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
  image: any;
  likes: string;
  comments: number;
  rating: number;
}

const chefs: Chef[] = [
  { id: '1', name: 'Mohamed', avatar: require('../../../assets/onboarding/dining-experience.png'), borderColor: colors.accent.red },
  { id: '2', name: 'Janes', avatar: require('../../../assets/onboarding/restaurant-owners.png'), borderColor: colors.accent.teal },
  { id: '3', name: 'Moro', avatar: require('../../../assets/onboarding/booking-table.png'), borderColor: colors.accent.yellow },
  { id: '4', name: 'Khaoula', avatar: require('../../../assets/onboarding/reviews-sharing.png'), borderColor: colors.accent.mint },
  { id: '5', name: 'Michel', avatar: require('../../../assets/onboarding/dining-experience.png'), borderColor: colors.accent.pink },
];

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Restaurant name',
    location: 'Sophie, Tanger',
    image: require('../../../assets/home/fine_dining_elegant__246bdcc1.jpg'),
    likes: '2k',
    comments: 23,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Restaurant name',
    location: 'Sophie, Tanger',
    image: require('../../../assets/home/moroccan_tagine_food_784bfa11.jpg'),
    likes: '1.5k',
    comments: 18,
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
      <View style={[styles.chefAvatarRing, { borderColor: item.borderColor }]}>
        <Image source={item.avatar} style={styles.chefAvatar} />
      </View>
      <Text style={styles.chefName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRestaurantCard = (restaurant: Restaurant) => (
    <View key={restaurant.id} style={styles.restaurantCard}>
      <ImageBackground
        source={restaurant.image}
        style={styles.restaurantImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', colors.overlay.black, colors.overlay.blackHeavy]}
          locations={[0, 0.5, 1]}
          style={styles.restaurantGradient}
        >
          <View style={styles.restaurantContent}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantLocation}>{restaurant.location}</Text>
            
            <View style={styles.restaurantStats}>
              <View style={styles.statItem}>
                <Heart size={sizing.icon.sm} color={colors.text} />
                <Text style={styles.statText}>{restaurant.likes}</Text>
              </View>
              
              <View style={styles.statItem}>
                <MessageCircle size={sizing.icon.sm} color={colors.text} />
                <Text style={styles.statText}>{restaurant.comments}</Text>
              </View>
              
              <View style={styles.ratingBadge}>
                <Star size={sizing.icon.xs} color={colors.rating} fill={colors.rating} />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image
            source={require('../../../assets/onboarding/dining-experience.png')}
            style={styles.userAvatar}
          />
        </TouchableOpacity>
        
        <Text style={styles.logo}>נשבר</Text>
        
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={sizing.icon.md} color={colors.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.categoryTitle}>{categoryTitle}</Text>

        <FlatList
          data={chefs}
          renderItem={renderChefItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chefList}
        />

        <View style={styles.restaurantList}>
          {restaurants.map(renderRestaurantCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.m,
    paddingTop: spacing.xxl,
    backgroundColor: colors.background,
  },
  userAvatar: {
    width: sizing.avatar.sm,
    height: sizing.avatar.sm,
    borderRadius: borderRadius.circle,
  },
  logo: {
    fontSize: typography.title.size,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -(spacing.xxs / 2),
    right: -(spacing.xxs / 2),
    backgroundColor: colors.error,
    borderRadius: borderRadius.small,
    width: spacing.s,
    height: spacing.s,
  },
  scrollView: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: typography.heading.size,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    marginBottom: spacing.m,
  },
  chefList: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  chefItem: {
    alignItems: 'center',
    marginRight: spacing.l,
  },
  chefAvatarRing: {
    width: spacing.xxxl * 2,
    height: spacing.xxxl * 2,
    borderRadius: borderRadius.circle,
    borderWidth: spacing.xxs,
    padding: spacing.xxs / 2,
    marginBottom: spacing.xxs,
  },
  chefAvatar: {
    width: sizing.avatar.md,
    height: sizing.avatar.md,
    borderRadius: borderRadius.circle,
  },
  chefName: {
    fontSize: typography.label.size,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  restaurantList: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
    paddingBottom: spacing.xxxl * 2.5,
  },
  restaurantCard: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    height: spacing.xxxl * 8,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  restaurantGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  restaurantContent: {
    padding: spacing.m,
  },
  restaurantName: {
    fontSize: typography.heading.size - 2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  restaurantLocation: {
    fontSize: typography.bodyMedium.size - 1,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
  restaurantStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  statText: {
    fontSize: typography.bodyMedium.size - 1,
    fontWeight: '400',
    color: colors.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.rating,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.medium,
    marginLeft: 'auto',
    gap: spacing.xxs,
  },
  ratingText: {
    fontSize: typography.bodyMedium.size - 1,
    fontWeight: '600',
    color: colors.background,
  },
});
