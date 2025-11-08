import React, { useEffect, useCallback, useState, useRef } from 'react';
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
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 100;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
  showScrollIndicator?: boolean;
  selectedIndex?: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  snapPoints = [0.55],
  showScrollIndicator = true,
  selectedIndex = -1,
}) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const active = useSharedValue(false);
  const [showTopChevron, setShowTopChevron] = useState(false);
  const [showBottomChevron, setShowBottomChevron] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const initialHeight = SCREEN_HEIGHT * snapPoints[0];

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== 0;
    translateY.value = withSpring(destination, {
      damping: 50,
      stiffness: 400,
      mass: 0.8,
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
      // Scroll to selected item after a small delay to ensure layout is complete
      if (selectedIndex >= 0) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: selectedIndex * 56, // 44dp height + 12dp margin
            animated: true,
          });
        }, 300);
      }
    } else {
      translateY.value = withTiming(0, { duration: 250 });
    }
  }, [visible, initialHeight, scrollTo, selectedIndex]);

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
      opacity: withTiming(visible ? 1 : 0, { duration: 200 }),
    };
  }, [visible]);

  const rBackdropOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y, 0],
        [0.5, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentSize, contentOffset } = event.nativeEvent;
    
    // Check if we can scroll up (not at top)
    const canScrollUp = contentOffset.y > 20;
    setShowTopChevron(canScrollUp);
    
    // Check if we can scroll down (not at bottom)
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    const canScrollDown = !isCloseToBottom && contentSize.height > layoutMeasurement.height;
    setShowBottomChevron(canScrollDown);
  };

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    const containerHeight = initialHeight - 100;
    setShowBottomChevron(contentHeight > containerHeight);
    setShowTopChevron(false);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
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
          ref={scrollViewRef}
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

        {showScrollIndicator && showTopChevron && (
          <View style={styles.topChevronContainer}>
            <View style={styles.chevronBackground}>
              <ChevronUp size={20} color="#7D729C" strokeWidth={2.5} />
            </View>
          </View>
        )}

        {showScrollIndicator && showBottomChevron && (
          <View style={styles.bottomChevronContainer}>
            <View style={styles.chevronBackground}>
              <ChevronDown size={20} color="#7D729C" strokeWidth={2.5} />
            </View>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

interface BottomSheetOptionProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export const BottomSheetOption: React.FC<BottomSheetOptionProps> = ({
  label,
  selected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.optionContainer, 
        selected && styles.optionSelected
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
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
    backgroundColor: 'rgba(14, 14, 14, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#555555',
    opacity: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 60,
  },
  optionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginBottom: 12,
    width: '100%',
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#2E2147',
    borderWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
    lineHeight: 24,
    color: '#D9D3E6',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  topChevronContainer: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  bottomChevronContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  chevronBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
});