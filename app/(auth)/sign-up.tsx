import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Keyboard, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { authDesign } from '@constants/theme/authDesign';
import { gradients } from '@constants/theme/colors';
import { CustomInput } from '@components/auth/CustomInput';
import { CustomButton } from '@components/auth/CustomButton';
import { SocialButton } from '@components/auth/SocialButton';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { authService } from '@services/auth/auth.service';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    Keyboard.dismiss();
    
    // Client-side validation
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields to continue.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.signUp({
        email: email.toLowerCase().trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        userType: 'customer',
      });

      if (response.success) {
        // Show success message and navigate to sign-in
        Alert.alert(
          'Account Created! 🎉',
          response.message,
          [
            {
              text: 'Continue to Sign In',
              onPress: () => router.replace('/(auth)/sign-in'),
            },
          ],
          { cancelable: false }
        );
      } else {
        // Show error message
        Alert.alert('Sign Up Failed', response.message);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert(
        'Error',
        error.message || 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = (provider: 'google' | 'facebook') => {
    Alert.alert('Coming Soon', `Sign up with ${provider} will be available soon!`);
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
          <View style={styles.logoContainerHeader}>
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
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Sign Up Account</Text>
            <Text style={styles.subtitle}>Enter your personal data to create your account.</Text>
          </View>

          <View style={styles.socialButtonsContainer}>
            <SocialButton provider="google" onPress={() => handleSocialSignUp('google')} />
            <View style={styles.socialButtonSpacer} />
            <SocialButton provider="facebook" onPress={() => handleSocialSignUp('facebook')} />
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <CustomInput
                  label="First Name"
                  placeholder="eg.John"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
              <View style={styles.nameFieldSpacer} />
              <View style={styles.nameField}>
                <CustomInput
                  label="Last Name"
                  placeholder="eg.Francisco"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
            </View>

            <CustomInput
              label="Email"
              placeholder="eg.johnfran@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="password"
              autoCapitalize="none"
              editable={!loading}
            />

            <Text style={styles.passwordHint}>Must be at least 8 characters</Text>

            <CustomButton
              title={loading ? "Creating Account..." : "Sign Up"}
              onPress={handleSignUp}
              loading={loading}
              disabled={loading}
            />
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account ? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity disabled={loading}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
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
  logoContainerHeader: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingBottom: authDesign.spacing.paddingVertical,
  },
  logo: {
    width: 100,
    height: 50,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
    textAlign: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  socialButtonSpacer: {
    width: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: authDesign.colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: authDesign.typography.caption.size,
    color: authDesign.colors.textSecondary,
  },
  formContainer: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  nameField: {
    flex: 1,
  },
  nameFieldSpacer: {
    width: 12,
  },
  passwordHint: {
    fontSize: authDesign.typography.caption.size,
    color: authDesign.colors.textSecondary,
    marginTop: -16,
    marginBottom: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: authDesign.typography.caption.size,
    color: authDesign.colors.textSecondary,
  },
  footerLink: {
    fontSize: authDesign.typography.link.size,
    fontWeight: authDesign.typography.link.weight,
    color: authDesign.colors.textPrimary,
  },
});