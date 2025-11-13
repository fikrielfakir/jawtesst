import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { AnimatedCategoryItem } from "./AnimatedCategoryItem";
import { categories, type Category } from "@constants/categories";

interface CategoryRingProps {
  selectedCategory: string | null;
  onCategoryPress: (categoryId: string) => void;
}

export const CategoryRing: React.FC<CategoryRingProps> = ({
  selectedCategory,
  onCategoryPress,
}) => {
  const { width } = useWindowDimensions();
  const containerSize = Math.min(width * 0.85, 400);
  const radius = containerSize * 0.45;

  const calculatePosition = (category: Category) => {
    const angleInRadians = (category.angle * Math.PI) / 180;
    const customRadius =
      category.id === "cafe"
        ? radius * 1.2
        : category.id === "chiringuito"
        ? radius * 1.02
        : radius;

    const x = containerSize / 2 + customRadius * Math.cos(angleInRadians) - 50;
    const y = containerSize / 2 + customRadius * Math.sin(angleInRadians) - 50;

    return { x, y };
  };

  return (
    <View
      style={[
        styles.container,
        { width: containerSize, height: containerSize },
      ]}
    >
      {categories.map((category) => {
        const { x, y } = calculatePosition(category);
        return (
          <AnimatedCategoryItem
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            x={x}
            y={y}
            onPress={onCategoryPress}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 65,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
});
