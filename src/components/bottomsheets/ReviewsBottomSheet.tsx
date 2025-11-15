import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { X, Star, Send } from '@tamagui/lucide-icons';
import { authDesign } from '@constants/theme/authDesign';
import { supabase } from '../../lib/supabaseClient';

interface Review {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    profile_image: string | null;
  };
  rating: number;
  comment: string | null;
  created_at: string;
}

interface ReviewsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  venueId: string;
  venueName: string;
}

export const ReviewsBottomSheet: React.FC<ReviewsBottomSheetProps> = ({
  visible,
  onClose,
  venueId,
  venueName,
}) => {
  const [slideAnim] = useState(new Animated.Value(600));
  const [backdropOpacity] = useState(new Animated.Value(0));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      fetchReviews();
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsModalVisible(false);
        setSelectedRating(0);
        setReviewText('');
      });
    }
  }, [visible]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          users:user_id (
            first_name,
            last_name,
            profile_image
          )
        `)
        .eq('venue_id', venueId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const parsedReviews: Review[] = (data || []).map((review: any) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        user: {
          first_name: review.users?.first_name || 'Anonymous',
          last_name: review.users?.last_name || 'User',
          profile_image: review.users?.profile_image,
        },
      }));

      setReviews(parsedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (selectedRating === 0) return;

    try {
      setSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Please sign in to submit a review');
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        venue_id: venueId,
        rating: selectedRating,
        comment: reviewText.trim() || null,
      });

      if (error) throw error;

      setSelectedRating(0);
      setReviewText('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const reviewDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - reviewDate.getTime()) / 60000);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return `${Math.floor(diffInMinutes / 10080)}w`;
  };

  const renderStars = (rating: number, size: number = 20, interactive: boolean = false) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!interactive}
            onPress={() => interactive && setSelectedRating(star)}
            activeOpacity={0.7}
          >
            <Star
              size={size}
              color={star <= rating ? authDesign.colors.yellow : 'rgba(255, 255, 255, 0.3)'}
              fill={star <= rating ? authDesign.colors.yellow : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>Reviews</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={authDesign.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={authDesign.colors.primaryicon} />
            </View>
          ) : reviews.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews yet</Text>
              <Text style={styles.emptySubtext}>Be the first to share your experience!</Text>
            </View>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.avatarContainer}>
                    {review.user.profile_image ? (
                      <Image
                        source={{ uri: review.user.profile_image }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarText}>
                          {review.user.first_name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.reviewInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.userName}>
                        {review.user.first_name} {review.user.last_name}
                      </Text>
                      <Text style={styles.timeAgo}>{getTimeAgo(review.created_at)}</Text>
                    </View>
                    {review.comment && (
                      <Text style={styles.reviewText}>{review.comment}</Text>
                    )}
                    {renderStars(review.rating, 18)}
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Rate your experience</Text>
          {renderStars(selectedRating, 40, true)}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.avatarInputContainer}>
            <View style={[styles.avatar, styles.avatarPlaceholder, styles.smallAvatar]}>
              <Text style={styles.avatarText}>U</Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Share your thoughts..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              selectedRating === 0 && styles.sendButtonDisabled,
            ]}
            onPress={handleSubmitReview}
            disabled={selectedRating === 0 || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: 300,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: authDesign.colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: authDesign.colors.textSecondary,
  },
  reviewItem: {
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    backgroundColor: authDesign.colors.primaryicon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reviewInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
  },
  timeAgo: {
    fontSize: 12,
    color: authDesign.colors.textSecondary,
  },
  reviewText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: authDesign.colors.textPrimary,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  avatarInputContainer: {
    alignSelf: 'flex-start',
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: authDesign.colors.textPrimary,
    maxHeight: 80,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: authDesign.colors.primaryicon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
