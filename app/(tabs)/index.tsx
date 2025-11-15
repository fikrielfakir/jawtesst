import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Animated,
  ActivityIndicator,
  Alert,
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
import { FilterBottomSheet } from "@components/bottomsheets/FilterBottomSheet";
import { LocationBottomSheet } from "@components/bottomsheets/LocationBottomSheet";
import { borderRadius } from "@/constants/theme/spacing";
import { supabase } from "@/lib/supabaseClient";

// Images mapped by display_order (index)
const categoryImagesByOrder: Record<number, any> = {
  0: require("@assets/home/coffee_cup_cafe_latt_38a3b15f.jpg"), // Cafe
  1: require("@assets/home/moroccan_tagine_food_784bfa11.jpg"), // Morocco Way
  2: require("@assets/home/fine_dining_elegant__246bdcc1.jpg"), // Fine Dining
  3: require("@assets/home/nightclub_dance_floo_110473b2.jpg"), // Dance
  4: require("@assets/home/bar_pub_beer_taps_lo_b72fe35e.jpg"), // Lounge & Pub
  5: require("@assets/home/beach_bar_chiringuit_9200470e.jpg"), // Chiringuito
};

// Angles mapped by display_order (index)
const categoryAnglesByOrder: Record<number, number> = {
  0: 270, // Top
  1: 210, // Top-left
  2: 330, // Top-right
  3: 150, // Bottom-left
  4: 30,  // Bottom-right
  5: 90,  // Bottom
};

// Radius adjustments by display_order
const categoryRadiusMultiplier: Record<number, number> = {
  0: 1.2,  // Cafe - further out
  5: 1.02, // Chiringuito - slightly further
};

interface Category {
  id: string;
  name: string;
  icon_url: string | null;
  is_active: boolean;
  display_order: number;
  description?: string | null;
  angle: number;
  image: any;
}

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

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("Tanger, Morocco");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [bottleRotation] = useState(new Animated.Value(270));
  const [filterVisible, setFilterVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState(5);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('id, name, icon_url, is_active, display_order, description')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) {
        throw new Error(`Failed to load categories: ${fetchError.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No categories found. Please add categories to the database.');
      }

      // Map categories using display_order for images and angles
      const mappedCategories: Category[] = data.map((cat) => {
        const order = cat.display_order ?? 0;
        
        return {
          id: cat.id,
          name: cat.name,
          icon_url: cat.icon_url,
          is_active: cat.is_active,
          display_order: order,
          description: cat.description,
          // Use display_order to get image and angle
          image: categoryImagesByOrder[order] || categoryImagesByOrder[0],
          angle: categoryAnglesByOrder[order] ?? (order * 60), // Fallback to evenly distributed
        };
      });

      setCategories(mappedCategories);
      
      // Set first category as selected by default
      if (mappedCategories.length > 0) {
        setSelectedCategoryId(mappedCategories[0].id);
        bottleRotation.setValue(mappedCategories[0].angle + 90);
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load categories.';
      setError(errorMessage);
      setCategories([]);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Retry', onPress: fetchCategories },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategoryId(category.id);
    
    const targetAngle = category.angle + 90;
    
    Animated.spring(bottleRotation, {
      toValue: targetAngle,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start(() => {
      router.push({
        pathname: '/feed',
        params: { 
          categoryId: category.id,
          categoryName: category.name 
        }
      });
    });
  };

  const containerSize = Math.min(width * 0.85, 400);
  const radius = containerSize * 0.45;

  const renderCategoryButton = (category: Category) => {
    const angleInRadians = (category.angle * Math.PI) / 180;

    // Use display_order to determine custom radius
    const radiusMultiplier = categoryRadiusMultiplier[category.display_order] || 1;
    const customRadius = radius * radiusMultiplier;

    const x = containerSize / 2 + customRadius * Math.cos(angleInRadians) - 50;
    const y = containerSize / 2 + customRadius * Math.sin(angleInRadians) - 50;
    const isSelected = selectedCategoryId === category.id;

    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryButton, { left: x, top: y }]}
        onPress={() => handleCategoryPress(category)}
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

  if (loading) {
    return (
      <LinearGradient
        colors={[...gradients.auth]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={authDesign.colors.primaryicon} />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error || categories.length === 0) {
    return (
      <LinearGradient
        colors={[...gradients.auth]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error || 'No categories available'}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchCategories}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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
              onPress={() => setFilterVisible(true)}
              activeOpacity={0.7}
            >
              <SlidersHorizontal size={18} color={authDesign.colors.primaryicon} />
              <Text style={styles.filterText}>{selectedDistance} km</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => setLocationVisible(true)}
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
            {categories.map(renderCategoryButton)}
          </View>
        </View>
      </SafeAreaView>

      <FilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        selectedDistance={selectedDistance}
        onDistanceChange={setSelectedDistance}
      />

      <LocationBottomSheet
        visible={locationVisible}
        onClose={() => setLocationVisible(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />
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
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: `${authDesign.colors.solidetransparent}`,
    borderRadius: borderRadius.large,
    borderWidth: 1.5,
    borderColor: `${authDesign.colors.solidetransparent}66`,
    minWidth: 100,
    justifyContent: "center",
  },
  filterText: {
    color: authDesign.colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  logo: { 
    width: 90, 
    height: 45,
    marginBottom: 20,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: `${authDesign.colors.solidetransparent}`,
    borderRadius: borderRadius.large,
    borderWidth: 1.5,
    borderColor: `${authDesign.colors.solidetransparent}`,
    minWidth: 100,
    justifyContent: "center",
  },
  locationText: {
    color: authDesign.colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    maxWidth: 200,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: authDesign.colors.textSecondary,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
    fontWeight: "600",
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: authDesign.colors.primaryicon,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});