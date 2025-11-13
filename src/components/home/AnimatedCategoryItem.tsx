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
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      scale.value = withTiming(1.15, {
        duration: 300,
        easing: Easing.out(Easing.back(1.2)),
      });
    } else {
      scale.value = withTiming(1, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    }
    opacity.value = 1;
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
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
            : [
                `${authDesign.colors.primaryicon}99`,
                `${authDesign.colors.primaryicon}33`,
                `${authDesign.colors.primaryicon}00`,
              ]
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
          ]}
        >
          <Image
            source={category.image}
            style={styles.categoryImage}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>
      <Text
        style={[
          styles.categoryName,
          isSelected && styles.categoryNameActive,
        ]}
      >
        {category.name}
      </Text>
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
    filter: `drop-shadow(0px 0px 15px ${authDesign.colors.primaryicon}66)`,
  },
  categoryGlowActive: {
    filter: `drop-shadow(0px 0px 35px ${authDesign.colors.primaryicon})`,
  },
  categoryImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 46,
    backgroundColor: authDesign.colors.backgroundDark,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  },
  categoryImageContainerActive: {
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryName: {
    color: authDesign.colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
    marginTop: -3,
  },
  categoryNameActive: {
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
