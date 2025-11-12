import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
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
import { authDesign } from "@constants/theme/authDesign";
import { gradients } from "@constants/theme/colors";

const CafeImg = require("@assets/home/coffee_cup_cafe_latt_38a3b15f.jpg");
const MoroccoWayImg = require("@assets/home/moroccan_tagine_food_784bfa11.jpg");
const FineDiningImg = require("@assets/home/fine_dining_elegant__246bdcc1.jpg");
const DanceImg = require("@assets/home/nightclub_dance_floo_110473b2.jpg");
const LoungePubImg = require("@assets/home/bar_pub_beer_taps_lo_b72fe35e.jpg");
const ChiringuitoImg = require("@assets/home/beach_bar_chiringuit_9200470e.jpg");

const BottleIcon = () => (
  <Svg width="40" height="138" viewBox="0 0 40 138" fill="none">
    <Defs>
      <SvgLinearGradient id="bottleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop
          offset="0%"
          stopColor={authDesign.colors.primaryicon}
          stopOpacity="0.8"
        />
        <Stop
          offset="50%"
          stopColor={authDesign.colors.primaryicon}
          stopOpacity="0.5"
        />
        <Stop
          offset="100%"
          stopColor={authDesign.colors.primaryicon}
          stopOpacity="0.8"
        />
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
  const { width, height } = useWindowDimensions();
  const [selectedLocation, setSelectedLocation] = useState("Tanger, Morocco");

  const handleCategoryPress = (categoryId: string) => {
    console.log("Category pressed:", categoryId);
  };

  const handleFilterPress = () => {
    console.log("Filter pressed");
  };

  const handleLocationPress = () => {
    console.log("Location pressed");
  };

  const containerSize = Math.min(width * 0.85, 400);
  const radius = containerSize * 0.38;

  const renderCategoryButton = (category: (typeof categories)[0]) => {
    const angleInRadians = (category.angle * Math.PI) / 180;
    const x = containerSize / 2 + radius * Math.cos(angleInRadians) - 50;
    const y = containerSize / 2 + radius * Math.sin(angleInRadians) - 50;

    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryButton, { left: x, top: y }]}
        onPress={() => handleCategoryPress(category.id)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[
            `${authDesign.colors.primaryicon}CC`,
            `${authDesign.colors.primaryicon}4D`,
            `${authDesign.colors.primaryicon}00`,
          ]}
          style={styles.categoryGlow}
        >
          <View style={styles.categoryImageContainer}>
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
              <SlidersHorizontal
                size={authDesign.sizes.iconSize}
                color={authDesign.colors.textPrimary}
              />
              <Text style={styles.filterText}>Filter Distance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleLocationPress}
              activeOpacity={0.7}
            >
              <MapPin
                size={authDesign.sizes.iconSize}
                color={authDesign.colors.textPrimary}
              />
              <Text style={styles.locationText}>{selectedLocation}</Text>
              <ChevronDown size={14} color={authDesign.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Choose Category</Text>

          <View
            style={[
              styles.categoriesContainer,
              {
                width: containerSize,
                height: containerSize,
              },
            ]}
          >
            <View style={styles.centerBottle}>
              <BottleIcon />
            </View>

            {categories.map((category) => renderCategoryButton(category))}
          </View>
        </View>
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
    paddingVertical: authDesign.spacing.sectionGap,
    gap: 12,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: authDesign.spacing.inputPaddingHorizontal,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
  },
  filterText: {
    color: authDesign.colors.textPrimary,
    fontSize: authDesign.typography.caption.size,
    fontWeight: authDesign.typography.caption.weight,
  },
  logo: {
    width: 100,
    height: 50,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: authDesign.spacing.inputPaddingHorizontal,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
  },
  locationText: {
    color: authDesign.colors.textPrimary,
    fontSize: authDesign.typography.caption.size - 2,
    fontWeight: authDesign.typography.label.weight,
    maxWidth: 100,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: authDesign.typography.title.size,
    fontWeight: authDesign.typography.title.weight,
    color: authDesign.colors.textPrimary,
    marginBottom: 30,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  categoriesContainer: {
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
    boxShadow: `0 0 20px ${authDesign.colors.primaryicon}CC`,
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
    marginBottom: 8,
    boxShadow: `0 0 20px ${authDesign.colors.primaryicon}CC`,
  },
  categoryImageContainer: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: authDesign.colors.backgroundDark,
    borderWidth: authDesign.sizes.borderWidthFocus,
    borderColor: "rgba(255, 255, 255, 0.4)",
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryName: {
    color: authDesign.colors.textPrimary,
    fontSize: authDesign.typography.label.size,
    fontWeight: authDesign.typography.label.weight,
    textAlign: "center",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
    letterSpacing: 0.3,
  },
});
