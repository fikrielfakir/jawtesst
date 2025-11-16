import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Search, Heart, MessageCircle, Star, MapPin, BadgeCheck, Sparkles } from '@tamagui/lucide-icons';
import { authDesign } from '@constants/theme/authDesign';
import { supabase } from '../../lib/supabaseClient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Venue {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  address: string;
  website: string | null;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_featured: boolean;
  price_range?: string | null;
}

interface VenuePost {
  id: string;
  image_url: string;
  caption: string | null;
  content_type: string;
  created_at: string;
  venue: Venue;
  like_count: number;
  comment_count: number;
  average_rating: number;
}

interface Category {
  id: string;
  name: string;
}

export function DiscoverScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const hasLoadedInitialData = useRef(false);

  const selectedVenueId = params.venueId as string;
  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string || 'Discover';

  const [venuePosts, setVenuePosts] = useState<VenuePost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<VenuePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categoryId || null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);

  useEffect(() => {
    getCurrentUser();
    fetchCategories();
  }, []);

  const fetchVenuePostsByCategory = async () => {
    if (selectedCategoryId) {
      await fetchVenuePostsByCategoryId(selectedCategoryId);
    }
  };

  useEffect(() => {
    if (selectedCategoryId && hasLoadedInitialData.current) {
      fetchVenuePostsByCategory();
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (currentUserId && venuePosts.length > 0) {
      fetchUserLikes();
    }
  }, [currentUserId, venuePosts]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(venuePosts);
    } else {
      const filtered = venuePosts.filter(post =>
        post.venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.venue.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, venuePosts]);

  useEffect(() => {
    if (selectedVenueId && venuePosts.length > 0 && filteredPosts.length > 0) {
      const index = filteredPosts.findIndex(post => post.venue.id === selectedVenueId);
      if (index !== -1) {
        setSelectedCardIndex(index);
        
        setTimeout(() => {
          const CARD_HEIGHT = 280;
          const CARD_MARGIN = 16;
          const CARDS_PER_ROW = 2;
          const ROW_HEIGHT = CARD_HEIGHT + CARD_MARGIN;
          
          const rowIndex = Math.floor(index / CARDS_PER_ROW);
          const yOffset = rowIndex * ROW_HEIGHT;
          
          scrollViewRef.current?.scrollTo({
            y: yOffset,
            animated: true,
          });
        }, 300);
      }
    }
  }, [selectedVenueId, filteredPosts]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);

      if (!data || data.length === 0) {
        setLoading(false);
        hasLoadedInitialData.current = true;
        return;
      }

      if (!hasLoadedInitialData.current) {
        let targetCategoryId: string;

        if (categoryId) {
          const categoryExists = data.some(cat => cat.id === categoryId);
          if (categoryExists) {
            targetCategoryId = categoryId;
          } else {
            targetCategoryId = data[0].id;
          }
        } else {
          targetCategoryId = data[0].id;
        }

        await fetchVenuePostsByCategoryId(targetCategoryId);

        if (selectedCategoryId !== targetCategoryId) {
          setSelectedCategoryId(targetCategoryId);
          setTimeout(() => {
            hasLoadedInitialData.current = true;
          }, 100);
        } else {
          hasLoadedInitialData.current = true;
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
      hasLoadedInitialData.current = true;
    }
  };

  const fetchVenuePostsByCategoryId = async (catId: string) => {
    try {
      setLoading(true);

      const { data: venuesData, error: venuesError } = await supabase
        .from('venue_categories')
        .select(`
          venue_id,
          venues (
            id,
            name,
            slug,
            description,
            city,
            state,
            postal_code,
            address,
            website,
            average_rating,
            total_reviews,
            is_verified,
            is_featured,
            price_range
          )
        `)
        .eq('category_id', catId);

      if (venuesError) throw venuesError;

      const venueIds = venuesData
        .filter(item => item.venues)
        .map(item => (item.venues as any).id);

      if (venueIds.length === 0) {
        setVenuePosts([]);
        setFilteredPosts([]);
        setLoading(false);
        return;
      }

      const { data: postsData, error: postsError } = await supabase
        .from('venue_posts')
        .select(`
          id,
          venue_id,
          image_url,
          caption,
          content_type,
          created_at,
          like_count,
          comment_count
        `)
        .in('venue_id', venueIds)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      const postsWithVenues = postsData.map(post => {
        const venueData = venuesData.find(v => (v.venues as any)?.id === post.venue_id);
        return {
          ...post,
          venue: venueData?.venues as unknown as Venue,
          average_rating: (venueData?.venues as any)?.average_rating || 0,
        };
      }).filter(post => post.venue);

      setVenuePosts(postsWithVenues);
      setFilteredPosts(postsWithVenues);
    } catch (error: any) {
      console.error('Error fetching venue posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikes = async () => {
    if (!currentUserId) return;

    try {
      const postIds = venuePosts.map(post => post.id);

      const { data, error } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', currentUserId)
        .in('post_id', postIds);

      if (error) throw error;

      const likedPostIds = new Set(data.map(like => like.post_id));
      setLikedPosts(likedPostIds);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  const handleLikePress = async (postId: string) => {
    if (!currentUserId) {
      console.log('User not logged in');
      return;
    }

    const isLiked = likedPosts.has(postId);

    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    setVenuePosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, like_count: Math.max(0, post.like_count + (isLiked ? -1 : 1)) }
        : post
    ));

    setFilteredPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, like_count: Math.max(0, post.like_count + (isLiked ? -1 : 1)) }
        : post
    ));

    try {
      const post = venuePosts.find(p => p.id === postId);
      if (!post) return;

      if (isLiked) {
        const { error: deleteError } = await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', currentUserId)
          .eq('post_id', postId);

        if (deleteError) throw deleteError;

        const { error: updateError } = await supabase
          .from('venue_posts')
          .update({ like_count: Math.max(0, post.like_count - 1) })
          .eq('id', postId);

        if (updateError) {
          console.warn('Failed to update like count:', updateError);
        }
      } else {
        const { error: insertError } = await supabase
          .from('post_likes')
          .insert({
            user_id: currentUserId,
            post_id: postId,
          });

        if (insertError) throw insertError;

        const { error: updateError } = await supabase
          .from('venue_posts')
          .update({ like_count: post.like_count + 1 })
          .eq('id', postId);

        if (updateError) {
          console.warn('Failed to update like count:', updateError);
        }
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);

      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });

      setVenuePosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, like_count: Math.max(0, post.like_count + (isLiked ? 1 : -1)) }
          : post
      ));

      setFilteredPosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, like_count: Math.max(0, post.like_count + (isLiked ? 1 : -1)) }
          : post
      ));
    }
  };

  const handleCategoryPress = (catId: string) => {
    setSelectedCategoryId(catId);
    setSelectedCardIndex(0);
  };

  const handleCardPress = (post: VenuePost) => {
    router.push(`/story/${post.id}`);
  };

  const renderCard = (post: VenuePost, index: number) => {
    const isSelected = selectedVenueId ? post.venue.id === selectedVenueId : index === selectedCardIndex;

    return (
      <TouchableOpacity
        key={post.id}
        style={[
          styles.card,
          isSelected && styles.selectedCard
        ]}
        activeOpacity={0.9}
        onPress={() => handleCardPress(post)}
      >
        <ImageBackground
          source={{ uri: post.image_url }}
          style={styles.cardImage}
          resizeMode="cover"
        >
          {post.venue.is_featured && (
            <View style={styles.featuredBadge}>
              <Sparkles size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.9)']}
            locations={[0, 0.5, 1]}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={styles.nameRow}>
                <Text style={styles.venueName} numberOfLines={1}>{post.venue.name}</Text>
                {post.venue.is_verified && (
                  <BadgeCheck size={18} color="#4A9EFF" fill="#4A9EFF" />
                )}
              </View>
              <View style={styles.locationRow}>
                <MapPin size={14} color="rgba(255, 255, 255, 0.7)" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {post.venue.city}{post.venue.state ? `, ${post.venue.state}` : ''}
                </Text>
              </View>

              <View style={styles.statsRow}>
                <TouchableOpacity
                  style={styles.statButton}
                  onPress={() => handleLikePress(post.id)}
                  activeOpacity={0.7}
                >
                  <Heart
                    size={20}
                    color={likedPosts.has(post.id) ? authDesign.colors.primaryicon : "#FFFFFF"}
                    fill={likedPosts.has(post.id) ? authDesign.colors.primaryicon : 'transparent'}
                  />
                  <Text style={styles.statText}>{post.like_count > 999 ? `${(post.like_count / 1000).toFixed(1)}k` : post.like_count}</Text>
                </TouchableOpacity>

                <View style={styles.statButton}>
                  <MessageCircle size={20} color="#FFFFFF" />
                  <Text style={styles.statText}>{post.comment_count}</Text>
                </View>

                <View style={styles.ratingBadge}>
                  <Star size={20} fill={authDesign.colors.yellow} color={authDesign.colors.yellow} />
                  <Text style={styles.ratingText}>
                    {post.venue.average_rating > 0 ? post.venue.average_rating.toFixed(1) : '0.0'}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={authDesign.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Search size={20} color={authDesign.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${categoryName}...`}
            placeholderTextColor={authDesign.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryTab,
              selectedCategoryId === cat.id && styles.selectedCategoryTab
            ]}
            onPress={() => handleCategoryPress(cat.id)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategoryId === cat.id && styles.selectedCategoryTabText
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={authDesign.colors.primaryicon} />
            <Text style={styles.loadingText}>Loading {categoryName}...</Text>
          </View>
        ) : filteredPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No results found' : `No ${categoryName} available`}
            </Text>
          </View>
        ) : (
          <View style={styles.cardsGrid}>
            {filteredPosts.map((post, index) => renderCard(post, index))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authDesign.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: authDesign.colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: authDesign.colors.textPrimary,
  },
  categoryTabs: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 60,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: authDesign.colors.backgroundDark,
    marginRight: 12,
  },
  selectedCategoryTab: {
    backgroundColor: authDesign.colors.primaryicon,
  },
  categoryTabText: {
    fontSize: 14,
    color: authDesign.colors.textSecondary,
    fontWeight: '500',
  },
  selectedCategoryTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (SCREEN_WIDTH - 48) / 2,
    height: 280,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: authDesign.colors.backgroundDark,
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: authDesign.colors.primaryicon,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  ratingText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  featuredText: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: authDesign.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: authDesign.colors.textSecondary,
    textAlign: 'center',
  },
});
