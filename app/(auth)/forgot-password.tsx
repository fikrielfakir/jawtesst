import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { authDesign } from '@constants/theme/authDesign';
import { CustomInput } from '@components/auth/CustomInput';
import { CustomButton } from '@components/auth/CustomButton';
import { AuthScreenWrapper } from '@components/auth/AuthScreenWrapper';
import { IconContainer } from '@components/auth/IconContainer';
import { Fingerprint, ArrowLeft } from '@tamagui/lucide-icons';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push({
        pathname: '/(auth)/verify-email',
        params: { email }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenWrapper>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <IconContainer>
            <Fingerprint size={40} color={authDesign.colors.textPrimary} strokeWidth={1.5} />
          </IconContainer>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Forgot Your Password{'\n'}and Continue</Text>
          <Text style={styles.subtitle}>Enter your email to receive a verification code</Text>
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
          />

          <CustomButton
            title="Submit Now"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
          />

          <CustomButton
            title="back to Sign In"
            onPress={() => router.replace('/(auth)/sign-in')}
            variant="secondary"
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconWrapper: {
    alignItems: 'center',
    marginTop: 32,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: authDesign.typography.title.size,
    fontWeight: authDesign.typography.title.weight,
    color: authDesign.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: authDesign.typography.subtitle.size,
    fontWeight: authDesign.typography.subtitle.weight,
    color: authDesign.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    marginTop: 8,
  },
  secondaryButton: {
    marginTop: 12,
  },
});
