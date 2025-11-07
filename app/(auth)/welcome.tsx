import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { YStack, Button, Text, View } from 'tamagui';
import { useRouter } from 'expo-router';
import { LinearGradient } from '@tamagui/linear-gradient';
import { gradients } from '@constants/theme/colors';
import { spacing, borderRadius } from '@constants/theme/spacing';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[...gradients.auth]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <YStack 
          flex={1} 
          paddingHorizontal={24} 
          justifyContent="center" 
          alignItems="center"
        >
          <View marginTop={80} marginBottom={spacing.xxxl} alignItems="center">
            <Image
              source={require('@assets/jwa-logo.png')}
              style={{ width: 100, height: 60, marginBottom: spacing.xl }}
              resizeMode="contain"
            />
            <Text
              fontSize={32}
              fontWeight="bold"
              color="#FFFFFF"
              textAlign="center"
              marginBottom={spacing.xs}
            >
              Welcome to JAW
            </Text>
            <Text
              fontSize={18}
              fontWeight="400"
              color="#B3B3B3"
              textAlign="center"
            >
              Join our community now
            </Text>
          </View>

          <YStack gap={spacing.m} width="85%" marginTop={spacing.xxxl}>
            <Button
              backgroundColor="#7D4EFF"
              borderRadius={borderRadius.medium}
              height={48}
              pressStyle={{ opacity: 0.8 }}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.25}
              shadowRadius={6}
              onPress={() => router.push('/(auth)/register-restaurant')}
            >
              <Text fontSize={18} fontWeight="600" color="#FFFFFF">
                I'm an Owner
              </Text>
            </Button>

            <Button
              backgroundColor="#FFFFFF"
              borderRadius={borderRadius.medium}
              height={48}
              pressStyle={{ opacity: 0.9 }}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.25}
              shadowRadius={6}
              onPress={() => router.push('/(auth)/sign-up')}
            >
              <Text fontSize={18} fontWeight="600" color="#3C1D6F">
                I'm a Diner
              </Text>
            </Button>
          </YStack>
        </YStack>
      </SafeAreaView>
    </LinearGradient>
  );
}
