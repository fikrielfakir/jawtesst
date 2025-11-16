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
import { colors } from '@constants/theme/colors';
import { spacing, borderRadius, sizing, typography } from '@constants/theme/spacing';
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
            price_range_id
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
              <Sparkles size={sizing.icon.sm} color={colors.gold} fill={colors.gold} />
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
                <Text style={styles.venueName}>{post.venue.name}</Text>
                {post.venue.is_verified && (
                  <BadgeCheck size={sizing.icon.sm} color="#4A9EFF" fill="#4A9EFF" />
                )}
              </View>
              <View style={styles.locationRow}>
                <MapPin size={sizing.icon.xs} color="rgba(255, 255, 255, 0.7)" />
                <Text style={styles.locationText}>
                  {post.venue.city}{post.venue.state ? `, ${post.venue.state}` : ''}
                </Text>
                {post.venue.price_range && (
                  <Text style={styles.priceRange}> • {post.venue.price_range}</Text>
                )}
              </View>

              {post.caption && (
                <Text style={styles.postCaption} numberOfLines={2}>{post.caption}</Text>
              )}

              <View style={styles.statsRow}>
                <TouchableOpacity
                  style={styles.statButton}
                  onPress={() => handleLikePress(post.id)}
                  activeOpacity={0.7}
                >
                  <Heart
                    size={sizing.icon.md}
                    color={likedPosts.has(post.id) ? authDesign.colors.primaryicon : colors.white}
                    fill={likedPosts.has(post.id) ? authDesign.colors.primaryicon : 'transparent'}
                  />
                  <Text style={styles.statText}>
                    {post.like_count > 999 ? `${(post.like_count / 1000).toFixed(1)}k` : post.like_count}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.statButton}
                  activeOpacity={0.7}
                >
                  <MessageCircle size={sizing.icon.md} color={colors.white} />
                  <Text style={styles.statText}>
                    {post.comment_count > 999
                      ? `${(post.comment_count / 1000).toFixed(1)}k`
                      : post.comment_count}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.ratingBadge} activeOpacity={0.7}>
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
          <View style={styles.cardsList}>
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.s,
    gap: spacing.s,
  },
  backButton: {
    padding: spacing.xxs,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body.size,
    color: colors.text,
  },
  categoryTabs: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.s,
    maxHeight: 60,
  },
  categoryTab: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.large,
    backgroundColor: colors.surface,
    marginRight: spacing.s,
  },
  selectedCategoryTab: {
    backgroundColor: authDesign.colors.primaryicon,
  },
  categoryTabText: {
    fontSize: typography.caption.size,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  selectedCategoryTabText: {
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.screenHorizontal,
  },
  cardsList: {
    gap: spacing.m,
  },
  card: {
    width: '100%',
    height: 380,
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    backgroundColor: colors.card,
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
    padding: spacing.m,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginBottom: spacing.xxs,
  },
  venueName: {
    fontSize: typography.heading.size,
    fontWeight: typography.heading.weight,
    color: colors.white,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginBottom: spacing.xs,
  },
  locationText: {
    fontSize: typography.caption.size,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  priceRange: {
    fontSize: typography.caption.size,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  postCaption: {
    fontSize: typography.caption.size,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: typography.caption.lineHeight,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  statText: {
    fontSize: typography.label.size,
    color: colors.white,
    fontWeight: typography.label.weight,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginLeft: 'auto',
  },
  ratingText: {
    fontSize: typography.caption.size,
    color: colors.white,
    fontWeight: '700',
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.s,
    right: spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.overlay.black,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: spacing.xxs + 2,
    borderRadius: borderRadius.medium,
    gap: spacing.xxs,
  },
  featuredText: {
    fontSize: typography.tiny.size,
    color: colors.gold,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: spacing.s,
    fontSize: typography.body.size,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
