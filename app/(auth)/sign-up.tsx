import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { YStack, XStack, Text, Button, Input, H2 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@hooks/useAuth';
import { Alert } from 'react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all fields');
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" backgroundColor="$background">
        <H2 color="$color" marginBottom="$6">Create Account</H2>
        
        <YStack gap="$4">
          <XStack gap="$2">
            <YStack flex={1} gap="$2">
              <Text color="$color">First Name</Text>
              <Input
                size="$4"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
              />
            </YStack>
            <YStack flex={1} gap="$2">
              <Text color="$color">Last Name</Text>
              <Input
                size="$4"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
              />
            </YStack>
          </XStack>

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
              placeholder="Create a password"
              secureTextEntry
            />
          </YStack>

          <Button
            size="$5"
            backgroundColor="$primary"
            color="white"
            marginTop="$4"
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <XStack justifyContent="center" marginTop="$4">
            <Text color="$color">Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Text color="$primary" fontWeight="bold">Sign In</Text>
            </Link>
          </XStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
