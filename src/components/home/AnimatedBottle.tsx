import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

interface AnimatedBottleProps {
  selectedCategoryId: string | null;
  categoryGradient: string[];
  onAnimationComplete?: () => void;
  onPress?: () => void;
}

export const AnimatedBottle: React.FC<AnimatedBottleProps> = ({
  selectedCategoryId,
  categoryGradient,
  onAnimationComplete,
  onPress,
}) => {
  const rotation = useSharedValue(0);
  const [currentGradient, setCurrentGradient] = useState(categoryGradient);
  const gradientTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);

  const clearAllTimeouts = () => {
    if (gradientTimeoutRef.current) {
      clearTimeout(gradientTimeoutRef.current);
      gradientTimeoutRef.current = null;
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
  };

  const handleAnimationComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    
    clearAllTimeouts();
    
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  useEffect(() => {
    clearAllTimeouts();
    completedRef.current = false;

    if (selectedCategoryId) {
      gradientTimeoutRef.current = setTimeout(() => {
        setCurrentGradient(categoryGradient);
      }, 200);

      rotation.value = withTiming(
        rotation.value + 360,
        {
          duration: 600,
          easing: Easing.inOut(Easing.ease),
        },
        (finished) => {
          if (finished && !completedRef.current) {
            runOnJS(handleAnimationComplete)();
          }
        }
      );

      fallbackTimeoutRef.current = setTimeout(() => {
        rotation.value = withTiming(rotation.value, { duration: 0 });
        runOnJS(handleAnimationComplete)();
      }, 1000);
    } else {
      setCurrentGradient(categoryGradient);
      rotation.value = withTiming(rotation.value, { duration: 0 });
    }

    return () => {
      clearAllTimeouts();
      rotation.value = withTiming(rotation.value, { duration: 0 });
    };
  }, [selectedCategoryId, categoryGradient]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Pressable onPress={onPress} disabled={selectedCategoryId !== null}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Svg width="40" height="138" viewBox="0 0 40 138" fill="none">
          <Defs>
            <SvgLinearGradient id="bottleGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor={currentGradient[2]} stopOpacity="1" />
              <Stop offset="50%" stopColor={currentGradient[1]} stopOpacity="1" />
              <Stop offset="100%" stopColor={currentGradient[0]} stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <Path
            d="M6.44748 137.733C4.72701 137.723 3.08095 136.987 1.87143 135.687C0.661904 134.388 -0.0120087 132.631 -0.00205622 130.804L0.373204 61.9074C0.448256 48.1281 7.00099 36.111 13.4974 34.4284L13.6663 3.42501C13.6713 2.51138 14.0178 1.63728 14.6296 0.994981C15.2414 0.352687 16.0684 -0.00518412 16.9286 9.82289e-05L23.4157 0.0399324C24.2759 0.0452148 25.0989 0.413217 25.7037 1.06298C26.3085 1.71275 26.6454 2.59105 26.6404 3.50468L26.4716 34.5081C32.9493 36.2704 39.3707 48.3671 39.4457 62.0667L39.821 130.964C39.831 132.791 39.1471 134.543 37.9306 135.836C36.7141 137.129 35.0643 137.857 33.344 137.857L6.44748 137.733Z"
            fill="url(#bottleGradient)"
          />
        </Svg>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 40,
    height: 138,
  },
});
