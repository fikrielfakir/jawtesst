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
import { authDesign } from '@constants/theme/authDesign';

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
  { id: '1', name: 'Mohamed', avatar: require('../../../assets/chefs/mohamed.png'), borderColor: authDesign.colors.primaryicon },
  { id: '2', name: 'Janes', avatar: require('../../../assets/chefs/janes.png'), borderColor: '#FF6B9D' },
  { id: '3', name: 'Moro', avatar: require('../../../assets/chefs/moro.png'), borderColor: '#FFD93D' },
  { id: '4', name: 'Khaoula', avatar: require('../../../assets/chefs/khaoula.png'), borderColor: '#6BCF7F' },
  { id: '5', name: 'Michel', avatar: require('../../../assets/chefs/michel.png'), borderColor: '#9B87F5' },
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
          colors={['transparent', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.9)']}
          locations={[0, 0.5, 1]}
          style={styles.restaurantGradient}
        >
          <View style={styles.restaurantContent}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantLocation}>{restaurant.location}</Text>
            
            <View style={styles.restaurantStats}>
              <View style={styles.statButton}>
                <Heart size={24} color="#FFFFFF" />
                <Text style={styles.statText}>{restaurant.likes}</Text>
              </View>
              
              <View style={styles.statButton}>
                <MessageCircle size={24} color="#FFFFFF" />
                <Text style={styles.statText}>{restaurant.comments}</Text>
              </View>
              
              <View style={styles.ratingBadge}>
                <Star size={26} fill={authDesign.colors.yellow} />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Image
              source={require('../../../assets/chefs/mohamed.png')}
              style={styles.userAvatar}
            />
          </TouchableOpacity>
          
          <Image
            source={require('../../../assets/jwa-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={26} color={authDesign.colors.textPrimary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.divider} />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingVertical: 16,
    backgroundColor: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  logo: {
    width: 90,
    height: 45,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
    marginHorizontal: authDesign.spacing.paddingHorizontal,
    marginTop: 20,
    marginBottom: 16,
  },
  chefList: {
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingBottom: 24,
  },
  chefItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  chefAvatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    padding: 3,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chefAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  chefName: {
    fontSize: 14,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
    textAlign: 'center',
  },
  restaurantList: {
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingBottom: 100,
  },
  restaurantCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 360,
    marginBottom: 16,
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
    padding: 20,
    paddingBottom: 16,
  },
  restaurantName: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  restaurantLocation: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
  },
  restaurantStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    gap: 6,
  },
  statText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: authDesign.colors.solidetransparent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 'auto',
    gap: 4,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
  },
});