import { Link } from 'expo-router';
import { YStack, XStack, Text, Button, H1, H2 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" justifyContent="space-between" backgroundColor="$background">
        <YStack flex={1} justifyContent="center" alignItems="center">
          <H1 color="$primary" fontSize="$10" fontWeight="bold">JAW</H1>
          <H2 color="$color" marginTop="$2" fontSize="$6" textAlign="center">
            Discover Amazing Restaurants
          </H2>
          <Text color="$color" marginTop="$3" fontSize="$4" textAlign="center" opacity={0.7}>
            Find the perfect place to dine, book tables, and share your experiences
          </Text>
        </YStack>

        <YStack gap="$3">
          <Link href="/(auth)/sign-up" asChild>
            <Button size="$5" backgroundColor="$primary" color="white">
              Get Started
            </Button>
          </Link>
          <Link href="/(auth)/sign-in" asChild>
            <Button size="$5" variant="outlined" borderColor="$primary" color="$primary">
              Sign In
            </Button>
          </Link>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
