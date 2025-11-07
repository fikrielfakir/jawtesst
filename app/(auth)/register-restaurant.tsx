import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Keyboard, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { authDesign } from '@constants/theme/authDesign';
import { gradients } from '@constants/theme/colors';
import { CustomInput } from '@components/auth/CustomInput';
import { CustomButton } from '@components/auth/CustomButton';
import { CustomSelect } from '@components/auth/CustomSelect';
import { ChevronLeft } from '@tamagui/lucide-icons';

const RESTAURANT_TYPES = [
  'Fine Dining',
  'Casual',
  'Cafe',
  'Fast Food',
  'Food Truck',
  'Bakery',
  'Bar & Grill',
];

const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return 'http://localhost:5000';
};

export default function RegisterRestaurantScreen() {
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [about, setAbout] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    Keyboard.dismiss();
    
    if (!restaurantName || !firstName || !lastName || !email || !phone || !address || !type || !cuisineType || !about || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/restaurants/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantName,
          email,
          phone,
          address,
          type,
          cuisineType,
          about,
          password,
          firstName,
          lastName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit registration');
      }

      Alert.alert(
        'Success',
        'Your restaurant registration request has been submitted! We will review it and get back to you soon.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/sign-in'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[...gradients.auth]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={28} color={authDesign.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image
              source={require('@assets/jwa-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.backButtonPlaceholder} />
        </View>

        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Register Restaurant</Text>
            <Text style={styles.subtitle}>Enter your restaurant details to submit a request</Text>
          </View>

          <View style={styles.formContainer}>
            <CustomInput
              label="Restaurant Name"
              placeholder="eg Romanes"
              value={restaurantName}
              onChangeText={setRestaurantName}
              autoCapitalize="words"
            />

            <View style={styles.rowContainer}>
              <View style={styles.rowField}>
                <CustomInput
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.rowSpacer} />
              <View style={styles.rowField}>
                <CustomInput
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.rowField}>
                <CustomInput
                  label="Email"
                  placeholder="exemple@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.rowSpacer} />
              <View style={styles.rowField}>
                <CustomInput
                  label="Phone"
                  placeholder="+21261234567"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <CustomInput
              label="Password"
              placeholder="Minimum 8 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <CustomInput
              label="Address"
              placeholder="eg 123 Main st, City"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
            />

            <CustomSelect
              label="Type"
              placeholder="Select Type"
              value={type}
              onSelect={setType}
              options={RESTAURANT_TYPES}
            />

            <CustomInput
              label="Cuisine type"
              placeholder="eg Italian, Mexican"
              value={cuisineType}
              onChangeText={setCuisineType}
              autoCapitalize="words"
            />

            <CustomInput
              label="About your business"
              placeholder="Description your restaurant"
              value={about}
              onChangeText={setAbout}
              multiline
            />

            <View style={styles.divider} />

            <CustomButton
              title="Submit"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonPlaceholder: {
    width: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 50,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingBottom: authDesign.spacing.paddingVertical,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: authDesign.typography.title.size,
    fontWeight: authDesign.typography.title.weight,
    color: authDesign.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: authDesign.typography.subtitle.size,
    fontWeight: authDesign.typography.subtitle.weight,
    color: authDesign.colors.textSecondary,
  },
  formContainer: {
    marginBottom: 24,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  rowField: {
    flex: 1,
  },
  rowSpacer: {
    width: 12,
  },
  divider: {
    height: 1,
    backgroundColor: authDesign.colors.divider,
    marginVertical: authDesign.spacing.dividerMarginVertical,
  },
});
