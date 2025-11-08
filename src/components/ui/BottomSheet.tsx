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
  snapPoints = [0.48],
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
    } else {
      translateY.value = withTiming(0, { duration: 250 });
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
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;
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
            <View style={styles.chevronBackground}>
              <ChevronDown size={22} color="#7A7A7A" strokeWidth={2.5} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.94)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCCCCC',
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 60,
  },
  optionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginBottom: 14,
    minHeight: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#2C124D',
    borderColor: '#4A2870',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
    lineHeight: 22,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chevronContainer: {
    position: 'absolute',
    bottom: 14,
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
