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
import { supabase } from '@/lib/supabaseClient';

const RESTAURANT_TYPES = [
  'Fine Dining',
  'Casual Dining',
  'Fast Food',
  'Cafe',
  'Bar & Grill',
  'Food Truck',
  'Bakery',
  'Buffet',
];

export default function RegisterRestaurantScreen() {
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
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
    
    // Validate all fields
    if (!restaurantName || !firstName || !lastName || !email || !phone || !address || !city || !country || !type || !cuisineType || !about || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Validate password
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Step 2: Create user profile in public.users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          user_type: 'restaurant_owner',
          is_verified: false,
        });

      if (userError) {
        console.error('User profile error:', userError);
        throw new Error('Failed to create user profile');
      }

      // Step 3: Create restaurant entry
      const { error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          owner_id: authData.user.id,
          name: restaurantName.trim(),
          description: about.trim(),
          address: address.trim(),
          city: city.trim(),
          country: country.trim(),
          phone: phone.trim(),
          email: email.toLowerCase().trim(),
          category: type,
          is_active: false, // Needs admin approval
          is_premier: false,
          rating: '0',
          total_reviews: 0,
        });

      if (restaurantError) {
        console.error('Restaurant creation error:', restaurantError);
        throw new Error('Failed to register restaurant');
      }

      // Success! Navigate to success screen
      router.replace('/(auth)/registration-success');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Failed to submit registration. Please try again.';
      
      if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered. Please use a different email.';
      } else if (error.message?.includes('Invalid')) {
        errorMessage = error.message;
      }
      
      Alert.alert('Registration Failed', errorMessage);
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
            disabled={loading}
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
              placeholder="eg. Romanes"
              value={restaurantName}
              onChangeText={setRestaurantName}
              autoCapitalize="words"
              editable={!loading}
            />

            <View style={styles.rowContainer}>
              <View style={styles.rowField}>
                <CustomInput
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  editable={!loading}
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
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.rowField}>
                <CustomInput
                  label="Email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
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
                  editable={!loading}
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
              editable={!loading}
            />

            <CustomInput
              label="Address"
              placeholder="eg. 123 Main St"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
              editable={!loading}
            />

            <View style={styles.rowContainer}>
              <View style={styles.rowField}>
                <CustomInput
                  label="City"
                  placeholder="eg. Fes"
                  value={city}
                  onChangeText={setCity}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
              <View style={styles.rowSpacer} />
              <View style={styles.rowField}>
                <CustomInput
                  label="Country"
                  placeholder="eg. Morocco"
                  value={country}
                  onChangeText={setCountry}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
            </View>

            <CustomSelect
              label="Restaurant Type"
              placeholder="Select Type"
              value={type}
              onSelect={setType}
              options={RESTAURANT_TYPES}
            />

            <CustomInput
              label="Cuisine Type"
              placeholder="eg. Italian, Mexican"
              value={cuisineType}
              onChangeText={setCuisineType}
              autoCapitalize="words"
              editable={!loading}
            />

            <CustomInput
              label="About Your Business"
              placeholder="Describe your restaurant"
              value={about}
              onChangeText={setAbout}
              multiline
              editable={!loading}
            />

            <View style={styles.divider} />

            <CustomButton
              title={loading ? "Submitting..." : "Submit"}
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