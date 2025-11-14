import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  ScrollView,
  TextInput,
} from 'react-native';
import { MapPin, Search, X } from '@tamagui/lucide-icons';
import { authDesign } from '@constants/theme/authDesign';

interface LocationBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
}

const POPULAR_CITIES = [
  { id: '1', name: 'Tanger, Morocco', country: 'Morocco' },
  { id: '2', name: 'Casablanca, Morocco', country: 'Morocco' },
  { id: '3', name: 'Marrakech, Morocco', country: 'Morocco' },
  { id: '4', name: 'Rabat, Morocco', country: 'Morocco' },
  { id: '5', name: 'Fes, Morocco', country: 'Morocco' },
  { id: '6', name: 'Agadir, Morocco', country: 'Morocco' },
  { id: '7', name: 'Tetouan, Morocco', country: 'Morocco' },
  { id: '8', name: 'Meknes, Morocco', country: 'Morocco' },
];

export const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  visible,
  onClose,
  selectedLocation,
  onSelectLocation,
}) => {
  const [slideAnim] = useState(new Animated.Value(600));
  const [backdropOpacity] = useState(new Animated.Value(0));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState(POPULAR_CITIES);

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsModalVisible(false);
        setSearchQuery('');
        setFilteredCities(POPULAR_CITIES);
      });
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCities(POPULAR_CITIES);
    } else {
      const filtered = POPULAR_CITIES.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery]);

  const handleSelectLocation = (location: string) => {
    onSelectLocation(location);
    onClose();
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sheet}>
            <View style={styles.dragHandle} />

            <View style={styles.header}>
              <Text style={styles.title}>Select Location</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={authDesign.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color={authDesign.colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search cities..."
                placeholderTextColor={authDesign.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={18} color={authDesign.colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.citiesList} showsVerticalScrollIndicator={false}>
              {filteredCities.map((city) => (
                <TouchableOpacity
                  key={city.id}
                  style={[
                    styles.cityItem,
                    selectedLocation === city.name && styles.cityItemSelected,
                  ]}
                  onPress={() => handleSelectLocation(city.name)}
                >
                  <MapPin
                    size={20}
                    color={
                      selectedLocation === city.name
                        ? authDesign.colors.primary
                        : authDesign.colors.textSecondary
                    }
                  />
                  <View style={styles.cityInfo}>
                    <Text
                      style={[
                        styles.cityName,
                        selectedLocation === city.name && styles.cityNameSelected,
                      ]}
                    >
                      {city.name}
                    </Text>
                  </View>
                  {selectedLocation === city.name && (
                    <View style={styles.selectedDot} />
                  )}
                </TouchableOpacity>
              ))}
              {filteredCities.length === 0 && (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>No cities found</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheetContainer: {
    maxHeight: '80%',
  },
  sheet: {
    backgroundColor: authDesign.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: authDesign.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: authDesign.colors.background,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: authDesign.colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: authDesign.colors.textPrimary,
    padding: 0,
  },
  citiesList: {
    paddingHorizontal: 20,
    maxHeight: 400,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  cityItemSelected: {
    backgroundColor: `${authDesign.colors.primary}15`,
    borderWidth: 1,
    borderColor: authDesign.colors.primary,
  },
  cityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: authDesign.colors.textPrimary,
  },
  cityNameSelected: {
    color: authDesign.colors.primary,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: authDesign.colors.primary,
  },
  noResults: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: authDesign.colors.textSecondary,
  },
});
