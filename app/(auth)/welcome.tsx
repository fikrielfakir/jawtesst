import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { YStack, Button, Text, View } from 'tamagui';
import { useRouter } from 'expo-router';
import { LinearGradient } from '@tamagui/linear-gradient';
import { colors } from '@constants/theme/colors';
import { spacing, borderRadius } from '@constants/theme/spacing';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} paddingHorizontal={spacing.m} justifyContent="center" alignItems="center" gap={spacing.xxl}>
          <View marginTop={120} alignItems="center">
            <Image
              source={require('@assets/jwa-logo.png')}
              style={{ width: 150, height: 75, marginBottom: spacing.m }}
              resizeMode="contain"
            />
            <Text
              fontSize={28}
              fontWeight="bold"
              color={colors.white}
              textAlign="center"
              marginTop={spacing.m}
            >
              Welcome to JAW
            </Text>
          </View>

          <YStack gap={spacing.m} width="85%" marginTop={80}>
            <Button
              backgroundColor={colors.primary}
              borderRadius={borderRadius.medium}
              height={52}
              pressStyle={{ opacity: 0.8 }}
              shadowColor="rgba(0, 0, 0, 0.15)"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={1}
              shadowRadius={8}
              onPress={() => router.push('/(auth)/register-restaurant')}
            >
              <Text fontSize={16} fontWeight="600" color={colors.white}>
                I'm an Owner
              </Text>
            </Button>

            <Button
              backgroundColor="transparent"
              borderColor="rgba(255, 255, 255, 0.3)"
              borderWidth={2}
              borderRadius={borderRadius.medium}
              height={52}
              pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              onPress={() => router.push('/(auth)/sign-up')}
            >
              <Text fontSize={16} fontWeight="600" color={colors.white}>
                I'm a User
              </Text>
            </Button>
          </YStack>
        </YStack>
      </SafeAreaView>
    </LinearGradient>
  );
}
