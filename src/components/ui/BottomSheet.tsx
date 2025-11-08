import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { ChevronDown } from '@tamagui/lucide-icons';
import { authDesign } from '@constants/theme/authDesign';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 100;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
  showScrollIndicator?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  snapPoints = [0.5],
  showScrollIndicator = true,
}) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const active = useSharedValue(false);
  const [showChevron, setShowChevron] = useState(false);

  const initialHeight = SCREEN_HEIGHT * snapPoints[0];

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== 0;
    translateY.value = withSpring(destination, {
      damping: 50,
      stiffness: 300,
    });
  }, []);

  const snapToPoint = useCallback((currentY: number) => {
    'worklet';
    const snapPositions = snapPoints.map(point => -(SCREEN_HEIGHT * point - 100));
    snapPositions.push(0);

    let closestSnap = snapPositions[0];
    let minDistance = Math.abs(currentY - closestSnap);

    snapPositions.forEach(snap => {
      const distance = Math.abs(currentY - snap);
      if (distance < minDistance) {
        minDistance = distance;
        closestSnap = snap;
      }
    });

    if (closestSnap === 0) {
      runOnJS(onClose)();
    } else {
      scrollTo(closestSnap);
    }
  }, [snapPoints, onClose, scrollTo]);

  useEffect(() => {
    if (visible) {
      scrollTo(-(initialHeight - 100));
    } else {
      translateY.value = withTiming(0);
    }
  }, [visible, initialHeight, scrollTo]);

  const handleGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd((event) => {
      if (event.velocityY > 500) {
        runOnJS(onClose)();
      } else {
        snapToPoint(translateY.value);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(visible ? 1 : 0),
    };
  }, [visible]);

  const rBackdropOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y, 0],
        [0.7, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentSize, contentOffset } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setShowChevron(!isCloseToBottom && contentSize.height > layoutMeasurement.height);
  };

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    const containerHeight = initialHeight - 100;
    setShowChevron(contentHeight > containerHeight);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, rBackdropStyle, rBackdropOpacity]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <GestureDetector gesture={handleGesture}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
        </GestureDetector>

        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          onScroll={showScrollIndicator ? handleScroll : undefined}
          onContentSizeChange={showScrollIndicator ? handleContentSizeChange : undefined}
          scrollEventThrottle={16}
        >
          {children}
        </ScrollView>

        {showScrollIndicator && showChevron && (
          <View style={styles.chevronContainer}>
            <ChevronDown size={24} color="#9CA3AF" />
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: '#1F1F1F',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4A4A4A',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  chevronContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
});
