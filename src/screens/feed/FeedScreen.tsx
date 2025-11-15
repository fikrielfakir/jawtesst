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
import { Bell, Heart, MessageCircle, Star, Filter, MapPin, X, ArrowLeft, BadgeCheck, Sparkles } from '@tamagui/lucide-icons';
import { authDesign } from '@constants/theme/authDesign';
import { supabase } from '../../lib/supabaseClient';
import { PostCommentsBottomSheet, ReviewsBottomSheet } from '../../components/bottomsheets/ReviewsBottomSheet';


interface Chef {
  id: string;
  name: string;
  avatar: any;
  borderColor: string;
}

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

const chefs: Chef[] = [
  { id: '1', name: 'Mohamed', avatar: require('../../../assets/chefs/mohamed.png'), borderColor: authDesign.colors.primaryicon },
  { id: '2', name: 'Janes', avatar: require('../../../assets/chefs/janes.png'), borderColor: '#ffffffff' },
  { id: '3', name: 'Moro', avatar: require('../../../assets/chefs/moro.png'), borderColor: '#ffffffff' },
  { id: '4', name: 'Khaoula', avatar: require('../../../assets/chefs/khaoula.png'), borderColor: '#ffffffff' },
  { id: '5', name: 'Michel', avatar: require('../../../assets/chefs/michel.png'), borderColor: '#f8f8faff' },
];

export function FeedScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string || 'Venues';

  const [venuePosts, setVenuePosts] = useState<VenuePost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<VenuePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [selectedVenueForReview, setSelectedVenueForReview] = useState<{ id: string; name: string } | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<{ id: string; venueName: string } | null>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    setSelectedCity(null);
    if (categoryId) {
      fetchVenuePostsByCategory();
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedCity) {
      setFilteredPosts(venuePosts.filter(post => post.venue.city === selectedCity));
    } else {
      setFilteredPosts(venuePosts);
    }
  }, [selectedCity, venuePosts]);

  useEffect(() => {
    if (currentUserId && venuePosts.length > 0) {
      fetchUserLikes();
    }
  }, [currentUserId, venuePosts]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    } catch (error) {
      console.error('Error getting current user:', error);
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

      if (error) {
        console.error('Error fetching likes:', error);
        return;
      }

      const likedPostIds = new Set((data || []).map(like => like.post_id));
      setLikedPosts(likedPostIds);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchVenuePostsByCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query venue_posts with venue details
      const { data: postsData, error: postsError } = await supabase
        .from('venue_posts')
        .select(`
          id,
          image_url,
          caption,
          content_type,
          created_at,
          venues!inner(
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
            is_active,
            price_ranges:price_range_id(symbol),
            venue_categories!inner(
              category_id
            )
          )
        `)
        .eq('venues.venue_categories.category_id', categoryId)
        .eq('venues.is_active', true)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching venue posts:', postsError);
        throw new Error('Failed to load posts. Please try again.');
      }

      if (!postsData || postsData.length === 0) {
        setVenuePosts([]);
        setFilteredPosts([]);
        setCities([]);
        return;
      }

      // Fetch like counts for all posts
      const postIds = postsData.map((post: any) => post.id);
      const { data: likeCounts } = await supabase
        .from('post_likes')
        .select('post_id')
        .in('post_id', postIds);

      // Count likes per post
      const likeCountMap = new Map<string, number>();
      (likeCounts || []).forEach((like: any) => {
        likeCountMap.set(like.post_id, (likeCountMap.get(like.post_id) || 0) + 1);
      });

      // Fetch comment counts (if post_comments table exists)
      const { data: commentCounts } = await supabase
        .from('post_comments')
        .select('post_id')
        .in('post_id', postIds);

      const commentCountMap = new Map<string, number>();
      (commentCounts || []).forEach((comment: any) => {
        commentCountMap.set(comment.post_id, (commentCountMap.get(comment.post_id) || 0) + 1);
      });

      // Fetch rating averages (if post_ratings table exists)
      const { data: ratings } = await supabase
        .from('post_ratings')
        .select('post_id, rating')
        .in('post_id', postIds);

      const ratingMap = new Map<string, { sum: number; count: number }>();
      (ratings || []).forEach((rating: any) => {
        const current = ratingMap.get(rating.post_id) || { sum: 0, count: 0 };
        ratingMap.set(rating.post_id, {
          sum: current.sum + rating.rating,
          count: current.count + 1,
        });
      });

      const parsedPostsData: VenuePost[] = postsData.map((post: any) => {
        const ratingData = ratingMap.get(post.id);
        const averageRating = ratingData ? ratingData.sum / ratingData.count : 0;

        return {
          id: post.id,
          image_url: post.image_url,
          caption: post.caption,
          content_type: post.content_type,
          created_at: post.created_at,
          like_count: likeCountMap.get(post.id) || 0,
          comment_count: commentCountMap.get(post.id) || 0,
          average_rating: averageRating,
          venue: {
            id: post.venues.id,
            name: post.venues.name,
            slug: post.venues.slug,
            description: post.venues.description,
            city: post.venues.city,
            state: post.venues.state,
            postal_code: post.venues.postal_code,
            address: post.venues.address,
            website: post.venues.website,
            average_rating: parseFloat(post.venues.average_rating) || 0,
            total_reviews: parseInt(post.venues.total_reviews) || 0,
            is_verified: post.venues.is_verified || false,
            is_featured: post.venues.is_featured || false,
            price_range: post.venues.price_ranges?.symbol || null,
          }
        };
      });

      setVenuePosts(parsedPostsData);
      setFilteredPosts(parsedPostsData);

      const uniqueCities = [...new Set(parsedPostsData.map((post: VenuePost) => post.venue.city))].sort();
      setCities(uniqueCities);

    } catch (error: any) {
      console.error('Error fetching venue posts:', error);
      setError(error.message || 'Failed to load posts. Please check your connection.');
      setVenuePosts([]);
      setFilteredPosts([]);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePress = async (postId: string) => {
    if (!currentUserId) {
      console.log('User not authenticated');
      return;
    }

    const isLiked = likedPosts.has(postId);

    // Optimistic update
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    // Update like count
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
      if (isLiked) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', currentUserId)
          .eq('post_id', postId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert({
            user_id: currentUserId,
            post_id: postId,
          });

        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);

      // Revert on error
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

  const handleCommentPress = (postId: string, venueName: string) => {
    console.log('Opening comments for post:', postId, 'venue:', venueName);
    
    if (!postId || postId === 'undefined') {
      console.error('Invalid postId passed to handleCommentPress');
      return;
    }
    
    setSelectedPostForComments({ id: postId, venueName });
    setCommentsModalVisible(true);
  };

  const handleRatingPress = (venueId: string, venueName: string) => {
    setSelectedVenueForReview({ id: venueId, name: venueName });
    setReviewsModalVisible(true);
  };

  const handleReviewsClose = async () => {
    setReviewsModalVisible(false);

    if (selectedVenueForReview) {
      try {
        const { data: venueData, error } = await supabase
          .from('venues')
          .select('average_rating, total_reviews')
          .eq('id', selectedVenueForReview.id)
          .single();

        if (!error && venueData) {
          setVenuePosts(prev => prev.map(post =>
            post.venue.id === selectedVenueForReview.id
              ? {
                  ...post,
                  venue: {
                    ...post.venue,
                    average_rating: parseFloat(venueData.average_rating) || 0,
                    total_reviews: parseInt(venueData.total_reviews) || 0,
                  }
                }
              : post
          ));

          setFilteredPosts(prev => prev.map(post =>
            post.venue.id === selectedVenueForReview.id
              ? {
                  ...post,
                  venue: {
                    ...post.venue,
                    average_rating: parseFloat(venueData.average_rating) || 0,
                    total_reviews: parseInt(venueData.total_reviews) || 0,
                  }
                }
              : post
          ));
        }
      } catch (error) {
        console.error('Error refreshing venue data:', error);
      }
    }

    setSelectedVenueForReview(null);
  };

  const handleCommentsClose = () => {
    setCommentsModalVisible(false);
    setSelectedPostForComments(null);
    // Refresh to update comment counts
    fetchVenuePostsByCategory();
  };

  const handleChefStoryPress = (chefId: string) => {
    router.push(`/chef-story/${chefId}`);
  };

  const renderChefItem = ({ item }: { item: Chef }) => (
    <TouchableOpacity 
      style={styles.chefItem}
      onPress={() => handleChefStoryPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.chefAvatarRing, { borderColor: item.borderColor }]}>
        <Image source={item.avatar} style={styles.chefAvatar} />
      </View>
      <Text style={styles.chefName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPostCard = (post: VenuePost) => (
    <TouchableOpacity
      key={post.id}
      style={styles.restaurantCard}
      activeOpacity={0.9}
      onPress={() => router.push(`/story/${post.id}`)}
    >
      <ImageBackground
        source={{ uri: post.image_url }}
        style={styles.restaurantImage}
        resizeMode="cover"
      >
        {post.venue.is_featured && (
          <View style={styles.featuredBadge}>
            <Sparkles size={16} color="#FFD700" fill="#FFD700" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.9)']}
          locations={[0, 0.5, 1]}
          style={styles.restaurantGradient}
        >
          <View style={styles.restaurantContent}>
            <View style={styles.nameRow}>
              <Text style={styles.restaurantName}>{post.venue.name}</Text>
              {post.venue.is_verified && (
                <BadgeCheck size={20} color="#4A9EFF" fill="#4A9EFF" />
              )}
            </View>
            <View style={styles.locationRow}>
              <MapPin size={16} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.restaurantLocation}>
                {post.venue.city}{post.venue.state ? `, ${post.venue.state}` : ''}
              </Text>
              {post.venue.price_range && (
                <Text style={styles.priceRange}> • {post.venue.price_range}</Text>
              )}
            </View>

            {post.caption && (
              <Text style={styles.postCaption} numberOfLines={2}>{post.caption}</Text>
            )}

            <View style={styles.restaurantStats}>
              {/* LIKE BUTTON - Individual per post */}
              <TouchableOpacity
                style={styles.statButton}
                onPress={() => handleLikePress(post.id)}
                activeOpacity={0.7}
              >
                <Heart
                  size={24}
                  color={likedPosts.has(post.id) ? authDesign.colors.primaryicon : "#FFFFFF"}
                  fill={likedPosts.has(post.id) ? authDesign.colors.primaryicon : 'transparent'}
                />
                <Text style={styles.statText}>
                  {post.like_count > 999 ? `${(post.like_count / 1000).toFixed(1)}k` : post.like_count}
                </Text>
              </TouchableOpacity>

              {/* COMMENT BUTTON - Individual per post */}
              <TouchableOpacity
                style={styles.statButton}
                onPress={() => {
                  console.log('Comment button pressed for post:', post.id);
                  handleCommentPress(post.id, post.venue.name);
                }}
                activeOpacity={0.7}
              >
                <MessageCircle size={24} color="#FFFFFF" />
                <Text style={styles.statText}>
                  {post.comment_count > 999
                    ? `${(post.comment_count / 1000).toFixed(1)}k`
                    : post.comment_count}
                </Text>
              </TouchableOpacity>

              {/* RATING BUTTON - Venue reviews */}
              <TouchableOpacity
                style={styles.ratingBadge}
                onPress={() => handleRatingPress(post.venue.id, post.venue.name)}
                activeOpacity={0.7}
              >
                <Star size={26} fill={authDesign.colors.yellow} color={authDesign.colors.yellow} />
                <Text style={styles.ratingText}>
                  {post.venue.average_rating > 0 ? post.venue.average_rating.toFixed(1) : '0.0'}
                </Text>
              </TouchableOpacity>
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
                onPress={() => fetchVenuePostsByCategory()}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredPosts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {selectedCity
                  ? `No ${categoryName} posts found in ${selectedCity}`
                  : `No ${categoryName} posts available yet`}
              </Text>
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
              {filteredPosts.map(renderPostCard)}
            </View>
          )}
        </ScrollView>

        {renderCityFilterModal()}

        {/* Venue Reviews Modal */}
        {selectedVenueForReview && (
          <ReviewsBottomSheet
            visible={reviewsModalVisible}
            onClose={handleReviewsClose}
            venueId={selectedVenueForReview.id}
            venueName={selectedVenueForReview.name}
          />
        )}

        {/* Post Comments Modal */}
        {selectedPostForComments && (
          <PostCommentsBottomSheet
            visible={commentsModalVisible}
            onClose={handleCommentsClose}
            postId={selectedPostForComments.id}
            venueName={selectedPostForComments.venueName}
          />
        )}
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
    paddingBottom: 100,
  },
  restaurantCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 380,
    marginBottom: 20,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    zIndex: 10,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
  },
  restaurantGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  restaurantContent: {
    padding: 20,
    paddingBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
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
  priceRange: {
    fontSize: 13,
    fontWeight: '600',
    color: authDesign.colors.primaryicon,
  },
  postCaption: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 20,
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