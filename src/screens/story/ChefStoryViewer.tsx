import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
  PanResponder,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from '@tamagui/lucide-icons';
import { colors } from '../../constants/theme/colors';
import { spacing, sizing } from '../../constants/theme/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ChefStory {
  id: string;
  venue_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  duration: number;
  views: number;
  status: 'active' | 'expired';
  expires_at: string;
  created_at: string;
}

interface ChefInfo {
  id: string;
  name: string;
  avatar: string;
  city: string;
}

const MOCK_STORIES: ChefStory[] = [
  {
    id: '1',
    venue_id: '1',
    media_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1080&h=1920&fit=crop',
    media_type: 'image',
    duration: 5,
    views: 123,
    status: 'active',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    venue_id: '1',
    media_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080&h=1920&fit=crop',
    media_type: 'image',
    duration: 5,
    views: 98,
    status: 'active',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    venue_id: '1',
    media_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1080&h=1920&fit=crop',
    media_type: 'image',
    duration: 5,
    views: 156,
    status: 'active',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

const MOCK_CHEF: ChefInfo = {
  id: '1',
  name: 'Chef Mohamed',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  city: 'Casablanca',
};

export const ChefStoryViewer: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const venueId = params.venueId as string;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const progressAnims = useRef(MOCK_STORIES.map(() => new Animated.Value(0))).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
      },
      onPanResponderGrant: () => {
        setIsPaused(true);
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsPaused(false);
        if (gestureState.dy > 100) {
          router.back();
        } else if (gestureState.dx > 100 && currentIndex > 0) {
          goToPreviousStory();
        } else if (gestureState.dx < -100 && currentIndex < MOCK_STORIES.length - 1) {
          goToNextStory();
        }
      },
    })
  ).current;

  const startStoryTimer = (index: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const duration = MOCK_STORIES[index].duration * 1000;
    
    Animated.timing(progressAnims[index], {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !isPaused) {
        if (index < MOCK_STORIES.length - 1) {
          goToNextStory();
        } else {
          router.back();
        }
      }
    });
  };

  const goToNextStory = () => {
    if (currentIndex < MOCK_STORIES.length - 1) {
      progressAnims[currentIndex].setValue(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      router.back();
    }
  };

  const goToPreviousStory = () => {
    if (currentIndex > 0) {
      progressAnims[currentIndex].setValue(0);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTapLeft = () => {
    if (currentIndex > 0) {
      goToPreviousStory();
    }
  };

  const handleTapRight = () => {
    if (currentIndex < MOCK_STORIES.length - 1) {
      goToNextStory();
    } else {
      router.back();
    }
  };

  useEffect(() => {
    if (!isPaused) {
      startStoryTimer(currentIndex);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, isPaused]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Image
        source={{ uri: MOCK_STORIES[currentIndex].media_url }}
        style={styles.storyImage}
        resizeMode="cover"
        onLoadEnd={() => setIsLoading(false)}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      )}

      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent']}
        style={styles.topGradient}
      />

      <View style={styles.progressBarContainer}>
        {MOCK_STORIES.map((_, index) => (
          <View key={index} style={styles.progressBarWrapper}>
            <View style={styles.progressBarBackground} />
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  opacity: index <= currentIndex ? 1 : 0.3,
                },
              ]}
            />
          </View>
        ))}
      </View>

      <View style={styles.header}>
        <View style={styles.chefInfo}>
          <Image
            source={{ uri: MOCK_CHEF.avatar }}
            style={styles.chefAvatar}
          />
          <View>
            <Text style={styles.chefName}>{MOCK_CHEF.name}</Text>
            <Text style={styles.chefCity}>{MOCK_CHEF.city}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.tapContainer} {...panResponder.panHandlers}>
        <TouchableOpacity
          style={styles.tapLeft}
          onPress={handleTapLeft}
          activeOpacity={1}
        />
        <TouchableOpacity
          style={styles.tapRight}
          onPress={handleTapRight}
          activeOpacity={1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  storyImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
  },
  progressBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.xl + spacing.m,
    gap: spacing.xs,
    zIndex: 2,
  },
  progressBarWrapper: {
    flex: 1,
    height: 3,
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  progressBarFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    zIndex: 2,
  },
  chefInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  chefAvatar: {
    width: sizing.avatar.sm,
    height: sizing.avatar.sm,
    borderRadius: sizing.avatar.sm / 2,
    borderWidth: 2,
    borderColor: colors.white,
  },
  chefName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  chefCity: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.white,
    opacity: 0.8,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 0,
  },
  tapLeft: {
    flex: 1,
  },
  tapRight: {
    flex: 1,
  },
});

