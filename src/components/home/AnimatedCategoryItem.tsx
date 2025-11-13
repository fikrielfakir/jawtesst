import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { authDesign } from "@constants/theme/authDesign";
import type { Category } from "@constants/categories";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedCategoryItemProps {
  category: Category;
  isSelected: boolean;
  x: number;
  y: number;
  onPress: (categoryId: string) => void;
}

export const AnimatedCategoryItem: React.FC<AnimatedCategoryItemProps> = ({
  category,
  isSelected,
  x,
  y,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const textOpacity = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      scale.value = withTiming(1.1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      textOpacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0.9, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      textOpacity.value = withTiming(0.6, { duration: 200 });
    }
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const handlePress = () => {
    onPress(category.id);
  };

  return (
    <AnimatedTouchable
      style={[styles.categoryButton, { left: x, top: y }, animatedStyle]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={
          isSelected
            ? [
                `${authDesign.colors.primaryicon}FF`,
                `${authDesign.colors.primaryicon}CC`,
                `${authDesign.colors.primaryicon}66`,
              ]
            : ["rgba(139, 92, 246, 0.2)", "rgba(139, 92, 246, 0)", "rgba(139, 92, 246, 0)"]
        }
        style={[
          styles.categoryGlow,
          isSelected && styles.categoryGlowActive,
        ]}
      >
        <View
          style={[
            styles.categoryImageContainer,
            isSelected && styles.categoryImageContainerActive,
            !isSelected && styles.categoryImageContainerInactive,
          ]}
        >
          <Image
            source={category.image}
            style={[
              styles.categoryImage,
              !isSelected && styles.categoryImageDimmed,
            ]}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>
      <Animated.Text
        style={[
          styles.categoryName,
          isSelected && styles.categoryNameActive,
          textAnimatedStyle,
        ]}
      >
        {category.name}
      </Animated.Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    position: "absolute",
    alignItems: "center",
    width: 100,
    zIndex: 2,
  },
  categoryGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  categoryGlowActive: {
    filter: `drop-shadow(0px 0px 40px ${authDesign.colors.primaryicon})`,
  },
  categoryImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: authDesign.colors.backgroundDark,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  },
  categoryImageContainerActive: {
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
    filter: "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.3))",
  },
  categoryImageContainerInactive: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryImageDimmed: {
    opacity: 0.7,
  },
  categoryName: {
    color: authDesign.colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.3,
    marginTop: -3,
  },
  categoryNameActive: {
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
