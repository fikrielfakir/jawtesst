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

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    Keyboard.dismiss();
    
    // Client-side validation
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter your email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.signIn(
        email.toLowerCase().trim(),
        password
      );

      if (response.success) {
        // Success! Navigate to main app
        // No alert needed - smooth transition
        router.replace('/(tabs)');
      } else {
        // Show error message
        Alert.alert('Sign In Failed', response.message);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      Alert.alert(
        'Error',
        error.message || 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    Alert.alert('Coming Soon', `Sign in with ${provider} will be available soon!`);
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
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.socialButtonsContainer}>
            <SocialButton provider="google" onPress={() => handleSocialLogin('google')} />
            <View style={styles.socialButtonSpacer} />
            <SocialButton provider="facebook" onPress={() => handleSocialLogin('facebook')} />
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.formContainer}>
            <CustomInput
              label="Email"
              placeholder="eg.johnfran@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="email"
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

            <View style={styles.rememberForgotContainer}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
                accessibilityRole="checkbox"
                accessibilityLabel="Remember me"
                accessibilityState={{ checked: rememberMe }}
                disabled={loading}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity disabled={loading}>
                  <Text style={styles.forgotPassword}>Forget Password?</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <CustomButton
              title={loading ? "Signing In..." : "Sign In"}
              onPress={handleSignIn}
              loading={loading}
              disabled={loading}
            />
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account ? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity disabled={loading}>
                <Text style={styles.footerLink}>Sign Up</Text>
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
  passwordHint: {
    fontSize: authDesign.typography.caption.size,
    color: authDesign.colors.textSecondary,
    marginTop: -16,
    marginBottom: 16,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -8,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: authDesign.colors.border,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: authDesign.colors.primary,
    borderColor: authDesign.colors.primary,
  },
  checkmark: {
    color: authDesign.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  rememberMeText: {
    fontSize: authDesign.typography.caption.size,
    color: authDesign.colors.textSecondary,
  },
  forgotPassword: {
    fontSize: authDesign.typography.link.size,
    fontWeight: authDesign.typography.link.weight,
    color: authDesign.colors.textPrimary,
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