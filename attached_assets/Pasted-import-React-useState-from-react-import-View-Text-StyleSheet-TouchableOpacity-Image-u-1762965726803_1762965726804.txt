import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SlidersHorizontal, MapPin, ChevronDown } from '@tamagui/lucide-icons';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const CafeImg = require('@assets/home/coffee_cup_cafe_latt_38a3b15f.jpg');
const MoroccoWayImg = require('@assets/home/moroccan_tagine_food_784bfa11.jpg');
const FineDiningImg = require('@assets/home/fine_dining_elegant__246bdcc1.jpg');
const DanceImg = require('@assets/home/nightclub_dance_floo_110473b2.jpg');
const LoungePubImg = require('@assets/home/bar_pub_beer_taps_lo_b72fe35e.jpg');
const ChiringuitoImg = require('@assets/home/beach_bar_chiringuit_9200470e.jpg');

const BottleIcon = () => (
  <Svg width="40" height="138" viewBox="0 0 40 138" fill="none">
    <Defs>
      <SvgLinearGradient id="bottleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#9C6CFF" stopOpacity="0.8" />
        <Stop offset="50%" stopColor="#9C6CFF" stopOpacity="0.5" />
        <Stop offset="100%" stopColor="#9C6CFF" stopOpacity="0.8" />
      </SvgLinearGradient>
    </Defs>
    <Path 
      d="M6.44748 137.733C4.72701 137.723 3.08095 136.987 1.87143 135.687C0.661904 134.388 -0.0120087 132.631 -0.00205622 130.804L0.373204 61.9074C0.448256 48.1281 7.00099 36.111 13.4974 34.4284L13.6663 3.42501C13.6713 2.51138 14.0178 1.63728 14.6296 0.994981C15.2414 0.352687 16.0684 -0.00518412 16.9286 9.82289e-05L23.4157 0.0399324C24.2759 0.0452148 25.0989 0.413217 25.7037 1.06298C26.3085 1.71275 26.6454 2.59105 26.6404 3.50468L26.4716 34.5081C32.9493 36.2704 39.3707 48.3671 39.2956 62.1464L38.9203 131.043C38.9104 132.87 38.2174 134.618 36.9938 135.903C35.7702 137.188 34.1162 137.903 32.3957 137.893L6.44748 137.733Z" 
      fill="url(#bottleGradient)"
    />
  </Svg>
);

const categories = [
  { 
    id: 'cafe', 
    name: 'Cafe', 
    angle: 270, 
    image: CafeImg
  },
  { 
    id: 'morocco-way', 
    name: 'Morocco Way', 
    angle: 210, 
    image: MoroccoWayImg
  },
  { 
    id: 'fine-dining', 
    name: 'Fine Dining', 
    angle: 330, 
    image: FineDiningImg
  },
  { 
    id: 'dance', 
    name: 'Dance', 
    angle: 150, 
    image: DanceImg
  },
  { 
    id: 'lounge-pub', 
    name: 'Loung & Pub', 
    angle: 30, 
    image: LoungePubImg
  },
  { 
    id: 'chiringuito', 
    name: 'Chiringuito', 
    angle: 90, 
    image: ChiringuitoImg
  },
];

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const [selectedLocation, setSelectedLocation] = useState('Tanger, Morocco');

  const handleCategoryPress = (categoryId: string) => {
    console.log('Category pressed:', categoryId);
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleLocationPress = () => {
    console.log('Location pressed');
  };

  const renderCategoryButton = (category: typeof categories[0]) => {
    const radius = Math.min(width, height * 0.6) * 0.32;
    const centerX = width / 2;
    const centerY = height * 0.42;
    
    const angleInRadians = (category.angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(angleInRadians) - 50;
    const y = centerY + radius * Math.sin(angleInRadians) - 50;

    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryButton, { left: x, top: y }]}
        onPress={() => handleCategoryPress(category.id)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(156, 108, 255, 0.8)', 'rgba(156, 108, 255, 0.3)', 'rgba(156, 108, 255, 0)']}
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
      colors={['#2C124D', '#1F0D35', '#12071E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={18} color="rgba(255, 255, 255, 0.9)" />
            <Text style={styles.filterText}>Filter Distance</Text>
          </TouchableOpacity>

          <Image
            source={require('@assets/jwa-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <TouchableOpacity 
            style={styles.locationButton}
            onPress={handleLocationPress}
            activeOpacity={0.7}
          >
            <MapPin size={16} color="rgba(255, 255, 255, 0.9)" />
            <Text style={styles.locationText}>{selectedLocation}</Text>
            <ChevronDown size={14} color="rgba(255, 255, 255, 0.9)" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Choose Category</Text>

          <View style={[styles.categoriesContainer, { width, height: height * 0.6 }]}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  filterText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  logo: {
    width: 85,
    height: 42,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  locationText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '500',
    maxWidth: 100,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  categoriesContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBottle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -69,
    marginLeft: -20,
    zIndex: 1,
    shadowColor: '#9C6CFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  categoryButton: {
    position: 'absolute',
    alignItems: 'center',
    width: 100,
    zIndex: 2,
  },
  categoryGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#9C6CFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  categoryImageContainer: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#1A0F2E',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.3,
  },
});
