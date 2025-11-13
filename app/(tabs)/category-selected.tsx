import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  Star,
  Clock,
  DollarSign,
  Heart,
  ChevronLeft,
} from '@tamagui/lucide-icons';

// Using existing theme constants
const authDesign = {
  colors: {
    background: '#3D3A5C',
    backgroundDark: '#2D2640',
    primary: '#6C4AB6',
    primaryicon: '#B9A2E1',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textPlaceholder: '#9CA3AF',
    border: '#5A5270',
    inputBackground: '#372655',
  },
  spacing: {
    paddingHorizontal: 16,
  },
  sizes: {
    cornerRadius: 15,
    borderWidth: 1,
  },
};

const gradients = {
  auth: ['#47306F', '#2E214D', '#0A050F'],
};

// Mock restaurant data
const mockRestaurants = [
  {
    id: '1',
    name: 'Sophie, Tanger',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    rating: 4.9,
    reviews: 23,
    likes: 2000,
    category: 'cafe',
    priceRange: '$$',
    distance: '1.2 km',
    time: '15-20 min',
    tags: ['Coffee', 'Breakfast', 'Wifi'],
  },
  {
    id: '2',
    name: 'Le Café Bohème',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400',
    rating: 4.7,
    reviews: 156,
    likes: 1500,
    category: 'cafe',
    priceRange: '$$$',
    distance: '2.5 km',
    time: '20-25 min',
    tags: ['Brunch', 'Pastries', 'Terrace'],
  },
  {
    id: '3',
    name: 'Café Hafa',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    rating: 4.8,
    reviews: 342,
    likes: 3200,
    category: 'cafe',
    priceRange: '$',
    distance: '0.8 km',
    time: '10-15 min',
    tags: ['Traditional', 'Tea', 'View'],
  },
  {
    id: '4',
    name: 'Café Central',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400',
    rating: 4.6,
    reviews: 89,
    likes: 890,
    category: 'cafe',
    priceRange: '$$',
    distance: '3.1 km',
    time: '25-30 min',
    tags: ['Cozy', 'Books', 'Quiet'],
  },
];

export default function CategorySelectedScreen() {
  const [selectedCategory] = useState('cafe');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation] = useState('Tanger, Morocco');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { width } = useWindowDimensions();

  const handleBackPress = () => {
    console.log('Navigate back to home');
  };

  const handleFilterPress = () => {
    console.log('Open filter modal');
  };

  const handleLocationPress = () => {
    console.log('Open location picker');
  };

  const handleRestaurantPress = (id: string) => {
    console.log('Navigate to restaurant:', id);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredRestaurants = mockRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={[...gradients.auth]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <ChevronLeft size={28} color={authDesign.colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </Text>
            <Text style={styles.headerSubtitle}>
              {filteredRestaurants.length} places found
            </Text>
          </View>

          <View style={styles.headerRight} />
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color={authDesign.colors.textPlaceholder} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurants..."
              placeholderTextColor={authDesign.colors.textPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={20} color={authDesign.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Location Bar */}
        <View style={styles.locationBar}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleLocationPress}
            activeOpacity={0.7}
          >
            <MapPin size={16} color={authDesign.colors.primaryicon} />
            <Text style={styles.locationText}>{selectedLocation}</Text>
            <ChevronDown size={14} color={authDesign.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Restaurant List */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredRestaurants.map(restaurant => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantCard}
              onPress={() => handleRestaurantPress(restaurant.id)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: restaurant.image }}
                style={styles.restaurantImage}
                resizeMode="cover"
              />

              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(restaurant.id)}
                activeOpacity={0.7}
              >
                <Heart
                  size={20}
                  color={favorites.includes(restaurant.id) ? '#FF4444' : '#FFFFFF'}
                  fill={favorites.includes(restaurant.id) ? '#FF4444' : 'transparent'}
                />
              </TouchableOpacity>

              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName} numberOfLines={1}>
                  {restaurant.name}
                </Text>

                <View style={styles.restaurantMeta}>
                  <View style={styles.metaItem}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.metaText}>{restaurant.rating}</Text>
                    <Text style={styles.metaTextLight}>({restaurant.reviews})</Text>
                  </View>

                  <View style={styles.metaDivider} />

                  <View style={styles.metaItem}>
                    <DollarSign size={14} color={authDesign.colors.primaryicon} />
                    <Text style={styles.metaText}>{restaurant.priceRange}</Text>
                  </View>

                  <View style={styles.metaDivider} />

                  <View style={styles.metaItem}>
                    <Clock size={14} color={authDesign.colors.textSecondary} />
                    <Text style={styles.metaText}>{restaurant.time}</Text>
                  </View>
                </View>

                <View style={styles.tagsContainer}>
                  {restaurant.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.distanceContainer}>
                  <MapPin size={12} color={authDesign.colors.textSecondary} />
                  <Text style={styles.distanceText}>{restaurant.distance}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filteredRestaurants.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No restaurants found</Text>
              <Text style={styles.emptyStateSubtext}>Try adjusting your search</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: authDesign.colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    marginBottom: 16,
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: authDesign.colors.inputBackground,
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
    paddingHorizontal: 16,
    gap: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: authDesign.colors.textPrimary,
    height: '100%',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: authDesign.colors.inputBackground,
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationBar: {
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: authDesign.colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingBottom: 24,
  },
  restaurantCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    backgroundColor: authDesign.colors.backgroundDark,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: authDesign.colors.textPrimary,
  },
  metaTextLight: {
    fontSize: 13,
    fontWeight: '400',
    color: authDesign.colors.textSecondary,
  },
  metaDivider: {
    width: 1,
    height: 14,
    backgroundColor: authDesign.colors.border,
    marginHorizontal: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(185, 162, 225, 0.15)',
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: authDesign.colors.primaryicon,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '500',
    color: authDesign.colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: authDesign.colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: authDesign.colors.textSecondary,
  },
});