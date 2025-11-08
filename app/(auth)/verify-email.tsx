import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authDesign } from '@constants/theme/authDesign';
import { CustomButton } from '@components/auth/CustomButton';
import { AuthScreenWrapper } from '@components/auth/AuthScreenWrapper';
import { IconContainer } from '@components/auth/IconContainer';
import { OTPInput } from '@components/auth/OTPInput';
import { Mail } from '@tamagui/lucide-icons';

export default function VerifyEmailScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleContinue = async () => {
    Keyboard.dismiss();

    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const { authService } = await import('@services/auth/auth.service');
      const result = await authService.verifyResetOtp(email, code);
      
      if (result.success) {
        router.push({
          pathname: '/(auth)/enter-new-password',
          params: { email, code }
        });
      } else {
        Alert.alert('Error', result.message || 'Invalid verification code');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      const { authService } = await import('@services/auth/auth.service');
      const result = await authService.resetPassword(email);
      
      if (result.success && result.otp) {
        Alert.alert(
          'New Verification Code',
          `Your new 6-digit code is: ${result.otp}\n\n(This is for testing only. In production, this will be sent to your email.)`,
          [{ text: 'OK' }]
        );
        setResendTimer(60);
        setCode('');
      } else {
        Alert.alert('Error', result.message || 'Failed to resend code');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend code');
    }
  };

  return (
    <AuthScreenWrapper>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <IconContainer>
            <Mail size={40} color={authDesign.colors.textPrimary} strokeWidth={1.5} />
          </IconContainer>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Verify Your Email to</Text>
          <Text style={styles.subtitle}>Enter the 6 digit verification code</Text>
        </View>

        <OTPInput
          length={6}
          value={code}
          onChangeText={setCode}
          onComplete={(completedCode) => {
            setCode(completedCode);
          }}
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            disabled={loading || code.length !== 6}
          />
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive any code?{' '}
          </Text>
          <TouchableOpacity onPress={handleResendCode} disabled={resendTimer > 0}>
            <Text style={[styles.resendLink, resendTimer > 0 && styles.resendDisabled]}>
              Resend Code {resendTimer > 0 && `(${resendTimer}s)`}
            </Text>
          </TouchableOpacity>
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
    marginBottom: 8,
  },
  title: {
    fontSize: authDesign.typography.title.size,
    fontWeight: authDesign.typography.title.weight,
    color: authDesign.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: authDesign.typography.subtitle.size,
    fontWeight: authDesign.typography.subtitle.weight,
    color: authDesign.colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },
  resendText: {
    fontSize: authDesign.typography.caption.size,
    color: authDesign.colors.textSecondary,
  },
  resendLink: {
    fontSize: authDesign.typography.link.size,
    fontWeight: authDesign.typography.link.weight,
    color: authDesign.colors.textPrimary,
  },
  resendDisabled: {
    color: authDesign.colors.textSecondary,
    opacity: 0.6,
  },
});
