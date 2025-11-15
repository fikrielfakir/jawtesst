import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Star,
  MapPin,
  BadgeCheck,
  Share2,
  Bookmark,
} from '@tamagui/lucide-icons';
import { authDesign } from '@constants/theme/authDesign';
import { supabase } from '../../lib/supabaseClient';
import { PostCommentsBottomSheet } from '../../components/bottomsheets/ReviewsBottomSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

export function StoryDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const postId = params.postId as string;

  const [post, setPost] = useState<VenuePost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<VenuePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  useEffect(() => {
    if (currentUserId && post) {
      checkIfLiked();
    }
  }, [currentUserId, post]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchPostDetails = async () => {
    try {
      setLoading(true);

      const { data: postData, error: postError } = await supabase
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
            price_ranges:price_range_id(symbol)
          )
        `)
        .eq('id', postId)
        .single();

      if (postError) throw postError;

      const { data: likeCounts } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('post_id', postId);

      const { data: commentCounts } = await supabase
        .from('post_comments')
        .select('post_id')
        .eq('post_id', postId);

      const { data: ratings } = await supabase
        .from('post_ratings')
        .select('rating')
        .eq('post_id', postId);

      const avgRating = ratings && ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      const formattedPost: VenuePost = {
        id: postData.id,
        image_url: postData.image_url,
        caption: postData.caption,
        content_type: postData.content_type,
        created_at: postData.created_at,
        venue: {
          id: postData.venues.id,
          name: postData.venues.name,
          slug: postData.venues.slug,
          description: postData.venues.description,
          city: postData.venues.city,
          state: postData.venues.state,
          postal_code: postData.venues.postal_code,
          address: postData.venues.address,
          website: postData.venues.website,
          average_rating: parseFloat(postData.venues.average_rating) || 0,
          total_reviews: parseInt(postData.venues.total_reviews) || 0,
          is_verified: postData.venues.is_verified,
          is_featured: postData.venues.is_featured,
          price_range: postData.venues.price_ranges?.symbol || null,
        },
        like_count: likeCounts?.length || 0,
        comment_count: commentCounts?.length || 0,
        average_rating: avgRating,
      };

      setPost(formattedPost);

      fetchRelatedPosts(postData.venues.id);
    } catch (error) {
      console.error('Error fetching post details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (venueId: string) => {
    try {
      const { data: postsData, error } = await supabase
        .from('venue_posts')
        .select(`
          id,
          image_url,
          caption,
          content_type,
          created_at
        `)
        .eq('venue_id', venueId)
        .neq('id', postId)
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && postsData) {
        setRelatedPosts(postsData as any);
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const checkIfLiked = async () => {
    if (!currentUserId || !post) return;

    try {
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('post_id', post.id)
        .single();

      setIsLiked(!!data);
    } catch (error) {
      setIsLiked(false);
    }
  };

  const handleLikePress = async () => {
    if (!currentUserId || !post) return;

    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setPost({
      ...post,
      like_count: Math.max(0, post.like_count + (wasLiked ? -1 : 1)),
    });

    try {
      if (wasLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', currentUserId)
          .eq('post_id', post.id);
      } else {
        await supabase
          .from('post_likes')
          .insert({
            user_id: currentUserId,
            post_id: post.id,
          });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsLiked(wasLiked);
      setPost({
        ...post,
        like_count: Math.max(0, post.like_count + (wasLiked ? 1 : -1)),
      });
    }
  };

  const handleCommentsPress = () => {
    setCommentsModalVisible(true);
  };

  const handleCommentsClose = () => {
    setCommentsModalVisible(false);
    fetchPostDetails();
  };

  const handleSharePress = () => {
    console.log('Share functionality');
  };

  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={authDesign.colors.primaryicon} />
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Story not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{ uri: post.image_url }}
            style={styles.storyImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.4)', 'transparent', 'transparent', 'rgba(0, 0, 0, 0.7)']}
              locations={[0, 0.2, 0.6, 1]}
              style={styles.imageGradient}
            >
              <View style={styles.topBar}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.topBarButton}
                  activeOpacity={0.7}
                >
                  <ArrowLeft size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.topBarActions}>
                  <TouchableOpacity
                    onPress={handleSharePress}
                    style={styles.topBarButton}
                    activeOpacity={0.7}
                  >
                    <Share2 size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleBookmarkPress}
                    style={styles.topBarButton}
                    activeOpacity={0.7}
                  >
                    <Bookmark
                      size={24}
                      color="#FFFFFF"
                      fill={isBookmarked ? '#FFFFFF' : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.bottomInfo}>
                <View style={styles.actionBar}>
                  <TouchableOpacity
                    onPress={handleLikePress}
                    style={styles.actionButton}
                    activeOpacity={0.7}
                  >
                    <Heart
                      size={28}
                      color={isLiked ? authDesign.colors.primaryicon : '#FFFFFF'}
                      fill={isLiked ? authDesign.colors.primaryicon : 'transparent'}
                    />
                    <Text style={styles.actionText}>
                      {post.like_count > 999 ? `${(post.like_count / 1000).toFixed(1)}k` : post.like_count}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleCommentsPress}
                    style={styles.actionButton}
                    activeOpacity={0.7}
                  >
                    <MessageCircle size={28} color="#FFFFFF" />
                    <Text style={styles.actionText}>
                      {post.comment_count > 999 ? `${(post.comment_count / 1000).toFixed(1)}k` : post.comment_count}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.ratingButton}>
                    <Star size={28} fill={authDesign.colors.yellow} color={authDesign.colors.yellow} />
                    <Text style={styles.actionText}>
                      {post.venue.average_rating > 0 ? post.venue.average_rating.toFixed(1) : '0.0'}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.venueHeader}>
            <View style={styles.venueInfo}>
              <View style={styles.venueNameRow}>
                <Text style={styles.venueName}>{post.venue.name}</Text>
                {post.venue.is_verified && (
                  <BadgeCheck size={20} color="#4A9EFF" fill="#4A9EFF" />
                )}
              </View>
              <View style={styles.locationRow}>
                <MapPin size={16} color={authDesign.colors.textSecondary} />
                <Text style={styles.locationText}>
                  {post.venue.city}{post.venue.state ? `, ${post.venue.state}` : ''}
                </Text>
                {post.venue.price_range && (
                  <Text style={styles.priceRange}> • {post.venue.price_range}</Text>
                )}
              </View>
            </View>
          </View>

          {post.caption && (
            <View style={styles.captionContainer}>
              <Text style={styles.captionText}>{post.caption}</Text>
              <Text style={styles.timestamp}>{formatDate(post.created_at)}</Text>
            </View>
          )}

          {post.venue.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>About {post.venue.name}</Text>
              <Text style={styles.descriptionText}>{post.venue.description}</Text>
            </View>
          )}

          {relatedPosts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>More from {post.venue.name}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.relatedScroll}
              >
                {relatedPosts.map((relatedPost) => (
                  <TouchableOpacity
                    key={relatedPost.id}
                    onPress={() => router.replace(`/story/${relatedPost.id}`)}
                    style={styles.relatedPostCard}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: relatedPost.image_url }}
                      style={styles.relatedPostImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {post && (
        <PostCommentsBottomSheet
          visible={commentsModalVisible}
          onClose={handleCommentsClose}
          postId={post.id}
          venueName={post.venue.name}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authDesign.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: authDesign.colors.textPrimary,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: authDesign.colors.primaryicon,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 12,
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 20,
  },
  venueHeader: {
    marginBottom: 20,
  },
  venueInfo: {
    gap: 8,
  },
  venueNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  venueName: {
    fontSize: 24,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: authDesign.colors.textSecondary,
  },
  priceRange: {
    fontSize: 14,
    color: authDesign.colors.textSecondary,
    fontWeight: '600',
  },
  captionContainer: {
    marginBottom: 20,
  },
  captionText: {
    fontSize: 16,
    color: authDesign.colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: authDesign.colors.textSecondary,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: authDesign.colors.textSecondary,
    lineHeight: 22,
  },
  relatedSection: {
    marginTop: 8,
  },
  relatedScroll: {
    marginTop: 12,
  },
  relatedPostCard: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  relatedPostImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
});
