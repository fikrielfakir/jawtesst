import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { YStack, Spinner, Text } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(value === 'true');
    } catch (error) {
      setHasSeenOnboarding(false);
    }
  };

  if (loading || hasSeenOnboarding === null) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="#1A1625">
        <Spinner size="large" color="#6B5CE7" />
        <Text marginTop="$4" color="white">Loading...</Text>
      </YStack>
    );
  }

  // Temporarily skip onboarding for final testing
  return <Redirect href="/(tabs)" />;
}
