import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, TouchableOpacity, Platform } from 'react-native';
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
import { authDesign } from '@constants/theme/authDesign';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 100;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  snapPoints = [0.4, 0.7, 0.95],
}) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const active = useSharedValue(false);

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

  const gesture = Gesture.Pan()
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

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {title && (
            <View style={styles.headerContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}

          <View style={styles.contentContainer}>
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
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
    backgroundColor: authDesign.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: 12,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: authDesign.colors.border,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: authDesign.colors.divider,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 8,
  },
});
