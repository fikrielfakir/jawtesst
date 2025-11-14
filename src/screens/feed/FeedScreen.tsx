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
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

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
  { id: '1', name: 'Mohamed', avatar: require('../../../assets/onboarding/dining-experience.png'), borderColor: '#FF6B6B' },
  { id: '2', name: 'Janes', avatar: require('../../../assets/onboarding/restaurant-owners.png'), borderColor: '#4ECDC4' },
  { id: '3', name: 'Moro', avatar: require('../../../assets/onboarding/booking-table.png'), borderColor: '#FFE66D' },
  { id: '4', name: 'Khaoula', avatar: require('../../../assets/onboarding/reviews-sharing.png'), borderColor: '#A8E6CF' },
  { id: '5', name: 'Michel', avatar: require('../../../assets/onboarding/dining-experience.png'), borderColor: '#FF8B94' },
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
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.9)']}
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
                <Star size={16} color="#F8C123" fill="#F8C123" />
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
          <Bell size={24} color="#FFFFFF" />
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
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 32,
    backgroundColor: '#000000',
  },
  userAvatar: {
    width: sizing.avatar.sm,
    height: sizing.avatar.sm,
    borderRadius: borderRadius.circle,
  },
  logo: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B3B',
    borderRadius: 6,
    width: 12,
    height: 12,
  },

  /* ---------- CATEGORY TITLE ---------- */
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
  },

  /* ---------- CHEF STORY STYLE ---------- */
  chefList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  chefItem: {
    alignItems: 'center',
    marginRight: spacing.l,
  },
  chefAvatarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    padding: 2,
    marginBottom: 6,
  },
  chefAvatar: {
    width: sizing.avatar.md,
    height: sizing.avatar.md,
    borderRadius: borderRadius.circle,
  },
  chefName: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  /* ---------- RESTAURANT CARD ---------- */
  restaurantList: {
    paddingHorizontal: 24,
    gap: 24,
    paddingBottom: 100,
  },
  restaurantCard: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    height: 320,
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
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  restaurantLocation: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#D0D0D0',
    marginBottom: 12,
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
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#FFFFFF',
  },

  /* ---------- RATING BADGE ---------- */
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
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
  },
});
