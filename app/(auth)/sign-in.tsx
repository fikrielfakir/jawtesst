import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { YStack, Text, Button, Input, H2 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@hooks/useAuth';
import { Alert } from 'react-native';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" backgroundColor="$background">
        <H2 color="$color" marginBottom="$6">Sign In</H2>
        
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

          <YStack gap="$2">
            <Text color="$color">Password</Text>
            <Input
              size="$4"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </YStack>

          <Link href="/(auth)/forgot-password" asChild>
            <Text color="$primary" textAlign="right">
              Forgot Password?
            </Text>
          </Link>

          <Button
            size="$5"
            backgroundColor="$primary"
            color="white"
            marginTop="$4"
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <XStack justifyContent="center" marginTop="$4">
            <Text color="$color">Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Text color="$primary" fontWeight="bold">Sign Up</Text>
            </Link>
          </XStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
