import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { YStack, Spinner, Text } from 'tamagui';

export default function IndexScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner size="large" />
        <Text marginTop="$4">Loading...</Text>
      </YStack>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
