import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Search, ScanLine, Heart, MessageCircle, Star } from "@tamagui/lucide-icons";
import { authDesign } from "@constants/theme/authDesign";
import { gradients } from "@constants/theme/colors";
import { categories } from "@constants/categories";

const mockRestaurants = [
  {
    id: "1",
    name: "Restaurant name",
    location: "Sophie, Tanger",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    likes: "2k",
    comments: "23",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Moroccan Delight",
    location: "Medina, Tanger",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    likes: "1.5k",
    comments: "18",
    rating: 4.7,
  },
];

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const category = categories.find((cat) => cat.id === id);

  const handleBack = () => {
    router.back();
  };

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
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity style={styles.scanButton}>
            <ScanLine size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {mockRestaurants.map((restaurant) => (
            <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
              <Image
                source={{ uri: restaurant.image }}
                style={styles.restaurantImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
                style={styles.restaurantGradient}
              >
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantLocation}>
                    {restaurant.location}
                  </Text>
                  <View style={styles.restaurantStats}>
                    <View style={styles.statItem}>
                      <Heart size={18} color="#fff" fill="#fff" />
                      <Text style={styles.statText}>{restaurant.likes}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <MessageCircle size={18} color="#fff" />
                      <Text style={styles.statText}>{restaurant.comments}</Text>
                    </View>
                    <View style={[styles.statItem, styles.ratingItem]}>
                      <Star size={18} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingTop: 10,
    paddingBottom: 20,
  },
  logo: {
    width: 90,
    height: 45,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    marginBottom: 20,
    gap: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: authDesign.sizes.cornerRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
  },
  scanButton: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingBottom: 20,
  },
  restaurantCard: {
    width: "100%",
    height: 400,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  restaurantImage: {
    width: "100%",
    height: "100%",
  },
  restaurantGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: 20,
  },
  restaurantInfo: {
    gap: 4,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  restaurantLocation: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  restaurantStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  ratingItem: {
    marginLeft: "auto",
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
