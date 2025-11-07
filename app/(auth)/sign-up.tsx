import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Keyboard, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { authDesign } from '@constants/theme/authDesign';
import { CustomInput } from '@components/auth/CustomInput';
import { CustomButton } from '@components/auth/CustomButton';
import { SocialButton } from '@components/auth/SocialButton';
import { useAuth } from '@hooks/useAuth';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    Keyboard.dismiss();
    
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
      Alert.alert('Success', 'Account created! Please check your email for verification.');
      router.replace('/(auth)/sign-in');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = (provider: 'google' | 'facebook') => {
    Alert.alert('Coming Soon', `${provider} sign up will be available soon`);
  };

  return (
    <LinearGradient
      colors={['#4C3472', '#2F2342', '#0D0713']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('@assets/jwa-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

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
            />

            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="password"
            />

            <Text style={styles.passwordHint}>Must be at least 8 characters</Text>

            <CustomButton
              title="Sign Up"
              onPress={handleSignUp}
              loading={loading}
              disabled={loading}
            />
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account ? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
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
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingBottom: authDesign.spacing.paddingVertical,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 60,
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
