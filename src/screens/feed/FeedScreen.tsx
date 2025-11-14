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

  const restaurants = [
    {
      id: '1',
      name: 'Restaurent name',
      location: 'Sophie, Tanger',
      image: require('../../../assets/home/fine_dining_elegant__246bdcc1.jpg'),
      likes: '2k',
      comments: 23,
      rating: 4.9,
    },
  ];

  const params = useLocalSearchParams();
  const category = (params.category as string) || 'cafe';
  const categoryTitle = categoryTitles[category] || 'Best Chef';

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

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
                <Heart size={18} color="#FFFFFF" />
                <Text style={styles.statText}>{restaurant.likes}</Text>
              </View>
              
              <View style={styles.statItem}>
                <MessageCircle size={18} color="#FFFFFF" />
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

  if (!fontsLoaded) {
    return null;
  }

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
    </LinearGradient>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: authDesign.colors.primaryicon,
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

  /* ---------- CATEGORY TITLE ---------- */
  categoryTitle: {
    fontSize: typography.heading.size,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    marginBottom: spacing.m,
  },

  /* ---------- CHEF STORY STYLE ---------- */
  chefList: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  chefItem: {
    alignItems: 'center',
    marginRight: 16,
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
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  chefName: {
    fontSize: typography.label.size,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },

  /* ---------- RESTAURANT CARD ---------- */
  restaurantList: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
    paddingBottom: spacing.xxxl * 2.5,
  },
  restaurantCard: {
    borderRadius: authDesign.sizes.cornerRadius,
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
    padding: 16,
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
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: typography.bodyMedium.size - 1,
    fontWeight: '400',
    color: colors.text,
  },

  /* ---------- RATING BADGE ---------- */
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: authDesign.colors.primaryicon,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: authDesign.sizes.cornerRadius,
    marginLeft: 'auto',
    gap: 4,
  },
  ratingText: {
    fontSize: typography.bodyMedium.size - 1,
    fontWeight: '600',
    color: colors.background,
  },
});
