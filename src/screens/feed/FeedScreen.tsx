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

// IMPORTANT — Lucide icons (not Tamagui)
import { Bell, Heart, MessageCircle, Star } from "@tamagui/lucide-icons";

export function FeedScreen() {
  const chefs = [
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
  const category = (params.category as string) || 'feed';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image
            source={require('../../../assets/onboarding/dining-experience.png')}
            style={styles.userAvatar}
          />
        </TouchableOpacity>

         <Image
                    source={require("@assets/jwa-logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                  />

        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#FFFFFF" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* ---------- CONTENT ---------- */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.categoryTitle}>Best Chef</Text>

        {/* ---------- CHEF LIST ---------- */}
        <FlatList
          data={chefs}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.chefItem}>
              <View style={[styles.chefAvatarRing, { borderColor: item.borderColor }]}>
                <Image source={item.avatar} style={styles.chefAvatar} />
              </View>
              <Text style={styles.chefName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chefList}
        />

        {/* ---------- RESTAURANT CARDS ---------- */}
        <View style={styles.restaurantList}>
          {restaurants.map((restaurant) => (
            <View key={restaurant.id} style={styles.restaurantCard}>
              <ImageBackground
                source={restaurant.image}
                style={styles.restaurantImage}
              >
                <LinearGradient
                  colors={[
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0.4)',
                    'rgba(0, 0, 0, 0.9)',
                  ]}
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
                        <Star size={16} color="#000" fill="#000" />
                        <Text style={styles.ratingText}>{restaurant.rating}</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  /* ---------- HEADER ---------- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  notificationButton: { position: 'relative' },
  notificationBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: '#FF3B3B',
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  /* ---------- CATEGORY TITLE ---------- */
  categoryTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    marginTop: 24,
    marginLeft: 24,
    marginBottom: 8,
  },
  logo: { 
    width: 90, 
    height: 45,
    marginBottom: 20,
  },

  /* ---------- CHEF STORY STYLE ---------- */
  chefList: {
    paddingLeft: 24,
    paddingBottom: 16,
  },
  chefItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  chefAvatarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  chefAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  chefName: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
  },

  /* ---------- RESTAURANT CARD ---------- */
  restaurantList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  restaurantCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 320,
    marginBottom: 24,
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
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  restaurantLocation: {
    fontSize: 14,
    color: '#D0D0D0',
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },

  restaurantStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
  },

  /* ---------- RATING BADGE ---------- */
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8C123',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 'auto',
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Bold',
  },
});
