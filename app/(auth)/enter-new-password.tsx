import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authDesign } from '@constants/theme/authDesign';
import { CustomInput } from '@components/auth/CustomInput';
import { CustomButton } from '@components/auth/CustomButton';
import { AuthScreenWrapper } from '@components/auth/AuthScreenWrapper';
import { IconContainer } from '@components/auth/IconContainer';
import { LockKeyhole, RotateCcw } from '@tamagui/lucide-icons';

export default function EnterNewPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const code = params.code as string;

  const handleContinue = async () => {
    Keyboard.dismiss();

    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { authService } = await import('@services/auth/auth.service');
      const result = await authService.resetPasswordWithOtp(email, code, newPassword);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Your password reset is complete! You can now sign in with your new password.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/sign-in')
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to reset password');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.replace('/(auth)/sign-in');
  };

  return (
    <AuthScreenWrapper>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <IconContainer>
            <View style={styles.iconContent}>
              <LockKeyhole size={32} color={authDesign.colors.textPrimary} strokeWidth={1.5} />
              <RotateCcw 
                size={20} 
                color={authDesign.colors.textPrimary} 
                strokeWidth={2}
                style={styles.refreshIcon}
              />
            </View>
          </IconContainer>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Enter Your New Password</Text>
          <Text style={styles.subtitle}>Create a strong password to secure your account</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="New Password"
            placeholder="Enter your new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            icon="password"
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Confirm your  password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="password"
          />

          <CustomButton
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            disabled={loading}
          />

          <CustomButton
            title="Cancel"
            onPress={handleCancel}
            variant="secondary"
            style={styles.cancelButton}
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
  iconContent: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
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
  cancelButton: {
    marginTop: 12,
  },
});
