import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authDesign } from '@constants/theme/authDesign';
import { CustomButton } from '@components/auth/CustomButton';
import { AuthScreenWrapper } from '@components/auth/AuthScreenWrapper';
import { IconContainer } from '@components/auth/IconContainer';
import { ShieldCheck, ArrowLeft, Mail } from '@tamagui/lucide-icons';
import { authService } from '@services/auth/auth.service';
import { OTPInput } from '@components/auth/OTPInput';

const OTP_LENGTH = 6;

export default function VerifyOtpScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async () => {
    Keyboard.dismiss();

    if (code.length !== OTP_LENGTH) {
      Alert.alert('Error', `Please enter the complete ${OTP_LENGTH}-digit code`);
      return;
    }

    setLoading(true);
    try {
      const result = await authService.verifyResetOtp(email, code);
      
      if (result.success) {
        router.push({
          pathname: '/(auth)/enter-new-password',
          params: { email, code }
        });
      } else {
        Alert.alert('Error', result.message || 'Invalid verification code');
        setCode('');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify code');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setResendLoading(true);
    try {
      const result = await authService.resetPassword(email);
      if (result.success) {
        Alert.alert('Success', 'A new verification code has been sent to your email');
        setTimer(60);
        setCode('');
      } else {
        Alert.alert('Error', result.message || 'Failed to resend code');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
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
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We sent a {OTP_LENGTH}-digit code to{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>
        </View>

        <View style={styles.otpContainer}>
          <OTPInput
            length={6}
            value={code}
            onChangeText={setCode}
            onComplete={(completedCode) => {
              setCode(completedCode);
            }}
          />
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive the code?{' '}
          </Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
              <Text style={styles.resendLink}>
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <CustomButton
          title="Verify & Continue"
          onPress={handleVerify}
          loading={loading}
          disabled={loading || code.length !== OTP_LENGTH}
          style={styles.verifyButton}
        />
      </View>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  iconWrapper: {
    alignItems: 'center',
    marginTop: 24,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: authDesign.typography.subtitle.size,
    fontWeight: authDesign.typography.subtitle.weight,
    color: authDesign.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  email: {
    color: authDesign.colors.textPrimary,
    fontWeight: '600',
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: authDesign.colors.textSecondary,
  },
  timerText: {
    fontSize: 14,
    color: authDesign.colors.textSecondary,
    fontWeight: '600',
  },
  resendLink: {
    fontSize: 14,
    color: authDesign.colors.primary,
    fontWeight: '600',
  },
  verifyButton: {
    marginTop: 8,
  },
});