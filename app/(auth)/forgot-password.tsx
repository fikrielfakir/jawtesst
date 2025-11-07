import { useState } from 'react';
import { useRouter } from 'expo-router';
import { YStack, Text, Button, Input, H2 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@hooks/useAuth';
import { Alert } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert('Success', 'Password reset link sent to your email!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" backgroundColor="$background">
        <H2 color="$color" marginBottom="$6">Reset Password</H2>
        
        <Text color="$color" marginBottom="$4">
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <YStack gap="$4">
          <YStack gap="$2">
            <Text color="$color">Email</Text>
            <Input
              size="$4"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </YStack>

          <Button
            size="$5"
            backgroundColor="$primary"
            color="white"
            marginTop="$4"
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <Button
            size="$5"
            variant="outlined"
            borderColor="$primary"
            color="$primary"
            onPress={() => router.back()}
          >
            Back to Sign In
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
