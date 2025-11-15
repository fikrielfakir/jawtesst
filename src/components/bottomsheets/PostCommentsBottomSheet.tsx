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
import { X, Send, Star } from '@tamagui/lucide-icons';
import { authDesign } from '@constants/theme/authDesign';
import { supabase } from '../../lib/supabaseClient';

interface Comment {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    profile_image: string | null;
  };
  comment: string;
  rating: number | null;
  created_at: string;
}

interface PostCommentsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  venueName: string;
}

export const PostCommentsBottomSheet: React.FC<PostCommentsBottomSheetProps> = ({
  visible,
  onClose,
  postId,
  venueName,
}) => {
  const [slideAnim] = useState(new Animated.Value(600));
  const [backdropOpacity] = useState(new Animated.Value(0));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      fetchComments();
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
        setCommentText('');
        setSelectedRating(0);
      });
    }
  }, [visible]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('first_name, last_name, profile_image')
          .eq('id', user.id)
          .single();
        
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // Validate postId before making the query
      if (!postId || postId === 'undefined') {
        console.error('Invalid postId:', postId);
        setComments([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          id,
          comment,
          rating,
          created_at,
          users:user_id (
            first_name,
            last_name,
            profile_image
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const parsedComments: Comment[] = (data || []).map((comment: any) => ({
        id: comment.id,
        comment: comment.comment,
        rating: comment.rating,
        created_at: comment.created_at,
        user: {
          first_name: comment.users?.first_name || 'Anonymous',
          last_name: comment.users?.last_name || 'User',
          profile_image: comment.users?.profile_image,
        },
      }));

      setComments(parsedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    const trimmedComment = commentText.trim();
    if (!trimmedComment && selectedRating === 0) return;

    try {
      setSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Please sign in to submit a comment');
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from('post_comments').insert({
        user_id: user.id,
        post_id: postId,
        comment: trimmedComment || null,
        rating: selectedRating > 0 ? selectedRating : null,
      });

      if (error) throw error;

      setCommentText('');
      setSelectedRating(0);
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / 60000);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return `${Math.floor(diffInMinutes / 10080)}w`;
  };

  const renderStars = (rating: number, size: number = 16, interactive: boolean = false) => {
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
          <View>
            <Text style={styles.title}>Reviews</Text>
            <Text style={styles.subtitle}>{venueName}</Text>
          </View>
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
          ) : comments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews yet</Text>
              <Text style={styles.emptySubtext}>Be the first to share your experience!</Text>
            </View>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <View style={styles.avatarContainer}>
                    {comment.user.profile_image ? (
                      <Image
                        source={{ uri: comment.user.profile_image }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarText}>
                          {comment.user.first_name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.commentInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.userName}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Text>
                      <Text style={styles.timeAgo}>{getTimeAgo(comment.created_at)}</Text>
                    </View>
                    {comment.comment && (
                      <Text style={styles.commentText}>{comment.comment}</Text>
                    )}
                    {comment.rating && comment.rating > 0 && (
                      <View style={styles.ratingRow}>
                        {renderStars(comment.rating, 16)}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Rate your experience</Text>
          {renderStars(selectedRating, 32, true)}
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <View style={styles.avatarInputContainer}>
            {currentUser?.profile_image ? (
              <Image
                source={{ uri: currentUser.profile_image }}
                style={[styles.avatar, styles.smallAvatar]}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder, styles.smallAvatar]}>
                <Text style={styles.avatarText}>
                  {currentUser?.first_name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Share your thoughts..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!commentText.trim() && selectedRating === 0) && styles.sendButtonDisabled,
            ]}
            onPress={handleSubmitComment}
            disabled={(!commentText.trim() && selectedRating === 0) || submitting}
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
    maxHeight: '85%',
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
    alignItems: 'flex-start',
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
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: authDesign.colors.textSecondary,
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: 250,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
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
  commentItem: {
    marginBottom: 20,
  },
  commentHeader: {
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
  commentInfo: {
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
  commentText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
    marginBottom: 8,
  },
  ratingRow: {
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: authDesign.colors.textPrimary,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
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