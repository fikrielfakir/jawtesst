import { YStack, H2, Text, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView flex={1} backgroundColor="$background">
        <YStack padding="$4" gap="$4">
          <H2 color="$color">Discover Restaurants</H2>
          <Text color="$color" opacity={0.7}>
            Welcome to JAW! Find amazing restaurants near you.
          </Text>
          
          <YStack marginTop="$4" padding="$4" backgroundColor="$backgroundGray" borderRadius="$4">
            <Text color="$color" fontWeight="bold">Coming Soon</Text>
            <Text color="$color" marginTop="$2">
              • Restaurant listings with ratings and reviews
            </Text>
            <Text color="$color">
              • Interactive story bubbles from restaurants
            </Text>
            <Text color="$color">
              • Table booking system
            </Text>
            <Text color="$color">
              • Search and filter by category, price, and location
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
