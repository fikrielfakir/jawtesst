import { YStack, H2, Text, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" backgroundColor="$background" gap="$4">
        <H2 color="$color">Search</H2>
        <Input
          size="$4"
          placeholder="Search restaurants, cuisines..."
        />
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Text color="$color" opacity={0.5}>Start typing to search restaurants</Text>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
