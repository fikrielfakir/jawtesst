import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { SlidersHorizontal, MapPin, ChevronDown } from "@tamagui/lucide-icons";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { useRouter } from "expo-router";
import { authDesign } from "@constants/theme/authDesign";
import { gradients } from "@constants/theme/colors";

const CafeImg = require("@assets/home/coffee_cup_cafe_latt_38a3b15f.jpg");
const MoroccoWayImg = require("@assets/home/moroccan_tagine_food_784bfa11.jpg");
const FineDiningImg = require("@assets/home/fine_dining_elegant__246bdcc1.jpg");
const DanceImg = require("@assets/home/nightclub_dance_floo_110473b2.jpg");
const LoungePubImg = require("@assets/home/bar_pub_beer_taps_lo_b72fe35e.jpg");
const ChiringuitoImg = require("@assets/home/beach_bar_chiringuit_9200470e.jpg");

const BottleIcon = () => (
  <Svg width="40" height="125" viewBox="0 0 40 138" fill="none">
    <Defs>
      <SvgLinearGradient id="bottleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor={authDesign.colors.primary} stopOpacity="1" />
        <Stop offset="50%" stopColor={authDesign.colors.primary} stopOpacity="1" />
        <Stop offset="100%" stopColor={authDesign.colors.primary} stopOpacity="1" />
      </SvgLinearGradient>
    </Defs>
    <Path
      d="M6.44748 137.733C4.72701 137.723 3.08095 136.987 1.87143 135.687C0.661904 134.388 -0.0120087 132.631 -0.00205622 130.804L0.373204 61.9074C0.448256 48.1281 7.00099 36.111 13.4974 34.4284L13.6663 3.42501C13.6713 2.51138 14.0178 1.63728 14.6296 0.994981C15.2414 0.352687 16.0684 -0.00518412 16.9286 9.82289e-05L23.4157 0.0399324C24.2759 0.0452148 25.0989 0.413217 25.7037 1.06298C26.3085 1.71275 26.6454 2.59105 26.6404 3.50468L26.4716 34.5081C32.9493 36.2704 39.3707 48.3671 39.4457 62.0667L39.821 130.964C39.831 132.791 39.1471 134.543 37.9306 135.836C36.7141 137.129 35.0643 137.857 33.344 137.857L6.44748 137.733Z"
      fill="url(#bottleGradient)"
    />
  </Svg>
);

const categories = [
  {
    id: "cafe",
    name: "Cafe",
    angle: 270,
    image: CafeImg,
  },
  {
    id: "morocco-way",
    name: "Morocco Way",
    angle: 210,
    image: MoroccoWayImg,
  },
  {
    id: "fine-dining",
    name: "Fine Dining",
    angle: 330,
    image: FineDiningImg,
  },
  {
    id: "dance",
    name: "Dance",
    angle: 150,
    image: DanceImg,
  },
  {
    id: "lounge-pub",
    name: "Lounge & Pub",
    angle: 30,
    image: LoungePubImg,
  },
  {
    id: "chiringuito",
    name: "Chiringuito",
    angle: 90,
    image: ChiringuitoImg,
  },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("Tanger, Morocco");
  const [selectedCategory, setSelectedCategory] = useState("cafe");
  const [bottleRotation] = useState(new Animated.Value(270)); // Start pointing at cafe

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log("Category pressed:", categoryId);
    
    // Find the angle of the selected category
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      // Animate bottle rotation to point at the selected category
      // Add 180 degrees to make the bottle top point towards the category
      const targetAngle = category.angle + 90;
      
      Animated.spring(bottleRotation, {
        toValue: targetAngle,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start(() => {
        // Navigate to feed screen after animation completes
        router.push({
          pathname: '/feed',
          params: { category: categoryId }
        });
      });
    }
  };

  const handleFilterPress = () => console.log("Filter pressed");
  const handleLocationPress = () => console.log("Location pressed");

  const containerSize = Math.min(width * 0.85, 400);
  const radius = containerSize * 0.45;

  const renderCategoryButton = (category: (typeof categories)[0]) => {
    const angleInRadians = (category.angle * Math.PI) / 180;

    const customRadius =
      category.id === "cafe"
        ? radius * 1.2 
        : category.id === "chiringuito"
        ? radius * 1.02
        : radius;

    const x = containerSize / 2 + customRadius * Math.cos(angleInRadians) - 50;
    const y = containerSize / 2 + customRadius * Math.sin(angleInRadians) - 50;
    const isSelected = selectedCategory === category.id;

    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryButton, { left: x, top: y }]}
        onPress={() => handleCategoryPress(category.id)}
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
        <Text style={styles.categoryName}>{category.name}</Text>
      </TouchableOpacity>
    );
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

          <View
            style={[
              styles.categoriesContainer,
              { width: containerSize, height: containerSize },
            ]}
          >
            <Animated.View 
              style={[
                styles.centerBottle,
                {
                  transform: [
                    { 
                      rotate: bottleRotation.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg']
                      })
                    }
                  ]
                }
              ]}
            >
              <BottleIcon />
            </Animated.View>
            {categories.map((category) => renderCategoryButton(category))}
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
    marginBottom: 28,
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
    marginBottom: 20,
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
    marginBottom: 70,
  },
  categoriesContainer: {
    marginTop: 65,
    position: "relative",
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
  categoryImage: { width: "100%", height: "100%" },
  categoryName: {
    color: authDesign.colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.8)",
    letterSpacing: 0.3,
    marginTop: -3,
  },
});