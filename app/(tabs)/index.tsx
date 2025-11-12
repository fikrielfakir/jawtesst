import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SlidersHorizontal, MapPin, ChevronDown } from '@tamagui/lucide-icons';

const CafeImg = require('../../assets/home/coffee_cup_cafe_latt_38a3b15f.jpg');
const MoroccoWayImg = require('../../assets/home/moroccan_tagine_food_784bfa11.jpg');
const FineDiningImg = require('../../assets/home/fine_dining_elegant__246bdcc1.jpg');
const DanceImg = require('../../assets/home/nightclub_dance_floo_110473b2.jpg');
const LoungePubImg = require('../../assets/home/bar_pub_beer_taps_lo_b72fe35e.jpg');
const ChiringuitoImg = require('../../assets/home/beach_bar_chiringuit_9200470e.jpg');

const categories = [
  { 
    id: 'cafe', 
    name: 'Cafe', 
    angle: 0, 
    image: CafeImg
  },
  { 
    id: 'morocco-way', 
    name: 'Morocco Way', 
    angle: 240, 
    image: MoroccoWayImg
  },
  { 
    id: 'fine-dining', 
    name: 'Fine Dining', 
    angle: 120, 
    image: FineDiningImg
  },
  { 
    id: 'dance', 
    name: 'Dance', 
    angle: 300, 
    image: DanceImg
  },
  { 
    id: 'lounge-pub', 
    name: 'Loung & Pub', 
    angle: 60, 
    image: LoungePubImg
  },
  { 
    id: 'chiringuito', 
    name: 'Chiringuito', 
    angle: 180, 
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
          colors={['rgba(139, 92, 246, 0.5)', 'rgba(139, 92, 246, 0.1)']}
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
      colors={['#47306F', '#2E214D', '#0A050F']}
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
            <SlidersHorizontal size={20} color="#FFFFFF" />
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
            <MapPin size={16} color="#FFFFFF" />
            <Text style={styles.locationText}>{selectedLocation}</Text>
            <ChevronDown size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Choose Category</Text>

          <View style={[styles.categoriesContainer, { width, height: height * 0.6 }]}>
            <View style={styles.centerBottle}>
              <LinearGradient
                colors={[
                  'rgba(139, 92, 246, 0.4)', 
                  'rgba(139, 92, 246, 0.2)', 
                  'rgba(139, 92, 246, 0)', 
                  'rgba(139, 92, 246, 0.2)', 
                  'rgba(139, 92, 246, 0.4)'
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.bottleGradient}
              >
                <View style={styles.bottleNeck} />
                <View style={styles.bottleBody} />
                <View style={styles.bottleBase} />
              </LinearGradient>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  logo: {
    width: 80,
    height: 40,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
    maxWidth: 100,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
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
    marginTop: -100,
    marginLeft: -25,
    zIndex: 1,
  },
  bottleGradient: {
    width: 50,
    height: 200,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottleNeck: {
    width: 15,
    height: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.4)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: -1,
  },
  bottleBody: {
    width: 45,
    height: 120,
    backgroundColor: 'rgba(139, 92, 246, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: -1,
  },
  bottleBase: {
    width: 50,
    height: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.4)',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryButton: {
    position: 'absolute',
    alignItems: 'center',
    width: 100,
    zIndex: 2,
  },
  categoryGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2D2640',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
