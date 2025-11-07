import { YStack, H2, Text, Button } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/welcome');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign out');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" backgroundColor="$background" gap="$4">
        <H2 color="$color">Profile</H2>
        
        {user && (
          <YStack gap="$3">
            <Text color="$color">Email: {user.email}</Text>
            <Text color="$color" opacity={0.7}>User ID: {user.id}</Text>
          </YStack>
        )}

        <Button
          size="$5"
          variant="outlined"
          borderColor="$primary"
          color="$primary"
          marginTop="$4"
          onPress={handleSignOut}
        >
          Sign Out
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
