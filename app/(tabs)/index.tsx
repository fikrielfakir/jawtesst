import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { SlidersHorizontal, MapPin, ChevronDown } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { authDesign } from "@constants/theme/authDesign";
import { gradients } from "@constants/theme/colors";
import { AnimatedBottle } from "@components/home/AnimatedBottle";
import { CategoryRing } from "@components/home/CategoryRing";

export default function HomeScreen() {
  const [selectedLocation, setSelectedLocation] = useState("Tanger, Morocco");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAnimationComplete = () => {
    if (selectedCategory) {
      router.push(`/(tabs)/categories/${selectedCategory}`);
    }
  };

  const handleFilterPress = () => console.log("Filter pressed");
  const handleLocationPress = () => console.log("Location pressed");

  return (
    <LinearGradient
      colors={[...gradients.auth]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Image
            source={require("@assets/jwa-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={handleFilterPress}
              activeOpacity={0.7}
            >
              <SlidersHorizontal size={18} color="#d0d0d0" />
              <Text style={styles.filterText}>Filter Distance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleLocationPress}
              activeOpacity={0.7}
            >
              <MapPin size={18} color="#d0d0d0" />
              <Text style={styles.locationText}>{selectedLocation}</Text>
              <ChevronDown size={14} color="#d0d0d0" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Choose Category</Text>

          <View style={styles.categoriesContainer}>
            <View style={styles.centerBottle}>
              <AnimatedBottle
                selectedCategoryId={selectedCategory}
                onAnimationComplete={handleAnimationComplete}
              />
            </View>
            <CategoryRing
              selectedCategory={selectedCategory}
              onCategoryPress={handleCategoryPress}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
   header: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingTop: 10,
    paddingBottom: 0,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 2,
    marginBottom: 28, // 🟩 space between controlsRow and "Choose Category"
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
  },
  filterText: {
    color: "#d0d0d0",
    fontSize: 12,
    fontWeight: "600",
  },
logo: { 
    width: 90, 
    height: 45,
    marginBottom: 20, // 🟩 space between logo and controlsRow
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
  },
  locationText: {
    color: "#d0d0d0",
    fontSize: 12,
    fontWeight: "600",
    maxWidth: 100,
  },
  content: { 
    flex: 1, 
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: authDesign.colors.textPrimary,
    letterSpacing: 0.5,
    textAlign: "center",
    marginBottom: 70, // 🟩 space between "Choose Category" and categoriesContainer
  },
  categoriesContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerBottle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -69,
    marginLeft: -20,
    zIndex: 1,
    filter: `drop-shadow(0px 0px 30px ${authDesign.colors.primaryicon})`,
  },
});
