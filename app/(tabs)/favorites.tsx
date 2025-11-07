import { YStack, H2, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" backgroundColor="$background">
        <H2 color="$color" marginBottom="$4">Favorites</H2>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Text color="$color" opacity={0.5}>No favorites yet</Text>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
