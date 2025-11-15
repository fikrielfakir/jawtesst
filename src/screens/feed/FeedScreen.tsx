import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Heart, MessageCircle, Star, Filter, MapPin, X, ArrowLeft } from '@tamagui/lucide-icons';
import { authDesign } from '@constants/theme/authDesign';
import { supabase } from '../../lib/supabaseClient';

interface Chef {
  id: string;
  name: string;
  avatar: any;
  borderColor: string;
}

interface Venue {
  id: string;
  name: string;
  description: string | null;
  city: string;
  address: string;
  average_rating: number;
  total_reviews: number;
}

const chefs: Chef[] = [
  { id: '1', name: 'Mohamed', avatar: require('../../../assets/chefs/mohamed.png'), borderColor: authDesign.colors.primaryicon },
  { id: '2', name: 'Janes', avatar: require('../../../assets/chefs/janes.png'), borderColor: '#FF6B9D' },
  { id: '3', name: 'Moro', avatar: require('../../../assets/chefs/moro.png'), borderColor: '#FFD93D' },
  { id: '4', name: 'Khaoula', avatar: require('../../../assets/chefs/khaoula.png'), borderColor: '#6BCF7F' },
  { id: '5', name: 'Michel', avatar: require('../../../assets/chefs/michel.png'), borderColor: '#9B87F5' },
];

export function FeedScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string || 'Venues';

  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    setSelectedCity(null);
    if (categoryId) {
      fetchVenuesByCategory();
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedCity) {
      setFilteredVenues(venues.filter(v => v.city === selectedCity));
    } else {
      setFilteredVenues(venues);
    }
  }, [selectedCity, venues]);

  const fetchVenuesByCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query venues by category using join
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select(`
          id,
          name,
          description,
          city,
          address,
          average_rating,
          total_reviews,
          venue_categories!inner(
            categories!inner(
              id,
              name
            )
          )
        `)
        .eq('venue_categories.category_id', categoryId)
        .eq('is_active', true)
        .order('average_rating', { ascending: false });

      if (venuesError) {
        console.error('Error fetching venues:', venuesError);
        throw new Error('Failed to load venues. Please try again.');
      }

      const parsedVenuesData: Venue[] = (venuesData || []).map((venue: any) => ({
        id: venue.id,
        name: venue.name,
        description: venue.description,
        city: venue.city,
        address: venue.address,
        average_rating: parseFloat(venue.average_rating) || 0,
        total_reviews: parseInt(venue.total_reviews) || 0,
      }));
      
      setVenues(parsedVenuesData);
      setFilteredVenues(parsedVenuesData);

      const uniqueCities = [...new Set(parsedVenuesData.map((v: Venue) => v.city))].sort();
      setCities(uniqueCities);

    } catch (error: any) {
      console.error('Error fetching venues:', error);
      setError(error.message || 'Failed to load venues. Please check your connection.');
      setVenues([]);
      setFilteredVenues([]);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const renderChefItem = ({ item }: { item: Chef }) => (
    <TouchableOpacity style={styles.chefItem}>
      <View style={[styles.chefAvatarRing, { borderColor: item.borderColor }]}>
        <Image source={item.avatar} style={styles.chefAvatar} />
      </View>
      <Text style={styles.chefName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderVenueCard = (venue: Venue) => (
    <TouchableOpacity 
      key={venue.id} 
      style={styles.restaurantCard}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={require('../../../assets/home/fine_dining_elegant__246bdcc1.jpg')}
        style={styles.restaurantImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.9)']}
          locations={[0, 0.5, 1]}
          style={styles.restaurantGradient}
        >
          <View style={styles.restaurantContent}>
            <Text style={styles.restaurantName}>{venue.name}</Text>
            <View style={styles.locationRow}>
              <MapPin size={16} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.restaurantLocation}>{venue.city}</Text>
            </View>
            
            <View style={styles.restaurantStats}>
              <View style={styles.statButton}>
                <Heart size={24} color="#FFFFFF" />
                <Text style={styles.statText}>{Math.floor(venue.total_reviews / 10)}k</Text>
              </View>
              
              <View style={styles.statButton}>
                <MessageCircle size={24} color="#FFFFFF" />
                <Text style={styles.statText}>{venue.total_reviews}</Text>
              </View>
              
              <View style={styles.ratingBadge}>
                <Star size={26} fill={authDesign.colors.yellow} color={authDesign.colors.yellow} />
                <Text style={styles.ratingText}>{venue.average_rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderCityFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter by City</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <X size={24} color={authDesign.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.cityList}>
            <TouchableOpacity
              style={[styles.cityItem, !selectedCity && styles.cityItemSelected]}
              onPress={() => {
                setSelectedCity(null);
                setFilterModalVisible(false);
              }}
            >
              <Text style={[styles.cityText, !selectedCity && styles.cityTextSelected]}>
                All Cities
              </Text>
            </TouchableOpacity>

            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.cityItem, selectedCity === city && styles.cityItemSelected]}
                onPress={() => {
                  setSelectedCity(city);
                  setFilterModalVisible(false);
                }}
              >
                <Text style={[styles.cityText, selectedCity === city && styles.cityTextSelected]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={28} color={authDesign.colors.textPrimary} />
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
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{categoryName}</Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Filter size={20} color={authDesign.colors.textPrimary} />
              {selectedCity && <View style={styles.filterActiveDot} />}
            </TouchableOpacity>
          </View>

          {selectedCity && (
            <View style={styles.filterChip}>
              <MapPin size={14} color={authDesign.colors.primaryicon} />
              <Text style={styles.filterChipText}>{selectedCity}</Text>
              <TouchableOpacity onPress={() => setSelectedCity(null)}>
                <X size={16} color={authDesign.colors.textPrimary} />
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={chefs}
            renderItem={renderChefItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chefList}
          />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={authDesign.colors.primaryicon} />
              <Text style={styles.loadingText}>Loading {categoryName}...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => fetchVenuesByCategory()}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredVenues.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No {categoryName} venues found</Text>
              {selectedCity && (
                <TouchableOpacity
                  style={styles.clearFilterButton}
                  onPress={() => setSelectedCity(null)}
                >
                  <Text style={styles.clearFilterText}>Clear Filter</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.restaurantList}>
              {filteredVenues.map(renderVenueCard)}
            </View>
          )}
        </ScrollView>

        {renderCityFilterModal()}
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
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: authDesign.spacing.paddingHorizontal,
    marginTop: 20,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
  },
  filterButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  filterActiveDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: authDesign.colors.primaryicon,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(123, 97, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: authDesign.spacing.paddingHorizontal,
    marginBottom: 8,
    gap: 6,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: authDesign.colors.textPrimary,
  },
  chefList: {
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingBottom: 24,
    paddingTop: 8,
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: authDesign.colors.textSecondary,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    gap: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    fontWeight: '600',
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: authDesign.colors.primaryicon,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    color: authDesign.colors.textSecondary,
    fontWeight: '600',
  },
  clearFilterButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: authDesign.colors.primaryicon,
    borderRadius: 12,
    marginTop: 8,
  },
  clearFilterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  restaurantLocation: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
  },
  cityList: {
    padding: 20,
  },
  cityItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cityItemSelected: {
    backgroundColor: authDesign.colors.primaryicon,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
    color: authDesign.colors.textSecondary,
  },
  cityTextSelected: {
    color: '#FFFFFF',
  },
});