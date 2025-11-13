import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Mask,
  Rect,
} from "react-native-svg";
import { authDesign } from "@constants/theme/authDesign";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface AnimatedBottleProps {
  isSelected: boolean;
  onAnimationComplete?: () => void;
}

export const AnimatedBottle: React.FC<AnimatedBottleProps> = ({
  isSelected,
  onAnimationComplete,
}) => {
  const breathingOpacity = useSharedValue(0.7);
  const fillProgress = useSharedValue(0);
  const burstScale = useSharedValue(1);
  const burstOpacity = useSharedValue(1);

  useEffect(() => {
    breathingOpacity.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (isSelected) {
      fillProgress.value = withSequence(
        withTiming(1, {
          duration: 1000,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(1, { duration: 300 }),
        withTiming(1.1, {
          duration: 150,
          easing: Easing.out(Easing.back(1.5)),
        }),
        withTiming(1, {
          duration: 150,
        })
      );

      burstScale.value = withSequence(
        withTiming(1, { duration: 1450 }),
        withTiming(1.3, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        })
      );

      burstOpacity.value = withSequence(
        withTiming(1, { duration: 1450 }),
        withTiming(0, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        }, (finished) => {
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        })
      );
    }
  }, [isSelected]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: isSelected ? burstOpacity.value : breathingOpacity.value,
    transform: [{ scale: burstScale.value }],
  }));

  const fillHeight = useAnimatedStyle(() => ({
    height: `${fillProgress.value * 100}%`,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <AnimatedSvg width="40" height="125" viewBox="0 0 40 138" fill="none">
        <Defs>
          <SvgLinearGradient id="bottleGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor={authDesign.colors.primary} stopOpacity="0.4" />
            <Stop offset="50%" stopColor={authDesign.colors.primary} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={authDesign.colors.primary} stopOpacity="0.3" />
          </SvgLinearGradient>
          <SvgLinearGradient id="fillGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#A47DFF" stopOpacity="1" />
            <Stop offset="50%" stopColor="#8B5FE8" stopOpacity="1" />
            <Stop offset="100%" stopColor="#7C4DD8" stopOpacity="1" />
          </SvgLinearGradient>
          <Mask id="bottleMask">
            <Path
              d="M6.44748 137.733C4.72701 137.723 3.08095 136.987 1.87143 135.687C0.661904 134.388 -0.0120087 132.631 -0.00205622 130.804L0.373204 61.9074C0.448256 48.1281 7.00099 36.111 13.4974 34.4284L13.6663 3.42501C13.6713 2.51138 14.0178 1.63728 14.6296 0.994981C15.2414 0.352687 16.0684 -0.00518412 16.9286 9.82289e-05L23.4157 0.0399324C24.2759 0.0452148 25.0989 0.413217 25.7037 1.06298C26.3085 1.71275 26.6454 2.59105 26.6404 3.50468L26.4716 34.5081C32.9493 36.2704 39.3707 48.3671 39.4457 62.0667L39.821 130.964C39.831 132.791 39.1471 134.543 37.9306 135.836C36.7141 137.129 35.0643 137.857 33.344 137.857L6.44748 137.733Z"
              fill="white"
            />
          </Mask>
        </Defs>
        
        <Path
          d="M6.44748 137.733C4.72701 137.723 3.08095 136.987 1.87143 135.687C0.661904 134.388 -0.0120087 132.631 -0.00205622 130.804L0.373204 61.9074C0.448256 48.1281 7.00099 36.111 13.4974 34.4284L13.6663 3.42501C13.6713 2.51138 14.0178 1.63728 14.6296 0.994981C15.2414 0.352687 16.0684 -0.00518412 16.9286 9.82289e-05L23.4157 0.0399324C24.2759 0.0452148 25.0989 0.413217 25.7037 1.06298C26.3085 1.71275 26.6454 2.59105 26.6404 3.50468L26.4716 34.5081C32.9493 36.2704 39.3707 48.3671 39.4457 62.0667L39.821 130.964C39.831 132.791 39.1471 134.543 37.9306 135.836C36.7141 137.129 35.0643 137.857 33.344 137.857L6.44748 137.733Z"
          fill="url(#bottleGradient)"
        />
        
        <Rect
          x="0"
          y={138 * (1 - fillProgress.value)}
          width="40"
          height={138 * fillProgress.value}
          fill="url(#fillGradient)"
          mask="url(#bottleMask)"
        />
      </AnimatedSvg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
