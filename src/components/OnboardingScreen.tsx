import React from 'react';
import { View, Text, Button, YStack, XStack, Image } from 'tamagui';
import { LinearGradient } from '@tamagui/linear-gradient';
import { colors } from '@constants/theme/colors';
import { spacing, borderRadius } from '@constants/theme/spacing';
import { Pressable } from 'react-native';

interface OnboardingScreenProps {
  title: string;
  imagePath: any;
  currentIndex: number;
  totalSlides: number;
  onNext: () => void;
  onSkip: () => void;
  isLast?: boolean;
}

export function OnboardingScreen({
  title,
  imagePath,
  currentIndex,
  totalSlides,
  onNext,
  onSkip,
  isLast = false,
}: OnboardingScreenProps) {
  return (
    <LinearGradient
      colors={['#2B0D57', '#0F062A']}
      style={{ flex: 1 }}
    >
      <YStack flex={1} paddingTop={60} paddingBottom={40}>
        <XStack justifyContent="flex-end" alignItems="center" paddingHorizontal={20} marginBottom={spacing.xxxl}>
          <Pressable onPress={onSkip} style={{ padding: 10 }}>
            <Text fontSize={16} fontWeight="500" color={colors.white}>
              Skip
            </Text>
          </Pressable>
        </XStack>

        <YStack alignItems="center" marginTop={spacing.l}>
          <Image
            source={require('../../attached_assets/Profile Restaurent Booking_1762514069783.png')}
            width={120}
            height={60}
            resizeMode="contain"
          />
        </YStack>

        <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal={spacing.xl}>
          <Text
            fontSize={24}
            fontWeight="bold"
            color={colors.white}
            textAlign="center"
            maxWidth="80%"
            lineHeight={31}
            marginBottom={spacing.xxxl}
          >
            {title}
          </Text>

          <View
            width={260}
            height={260}
            justifyContent="center"
            alignItems="center"
          >
            <Image
              source={imagePath}
              width={240}
              height={240}
              resizeMode="contain"
            />
          </View>

          <XStack gap={spacing.xs} marginTop={spacing.xl} justifyContent="center">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <View
                key={index}
                width={index === currentIndex ? 8 : 6}
                height={index === currentIndex ? 8 : 6}
                borderRadius={4}
                backgroundColor={index === currentIndex ? '#A071FF' : 'rgba(197, 177, 247, 0.3)'}
              />
            ))}
          </XStack>
        </YStack>

        <View paddingHorizontal="7.5%" paddingBottom={spacing.xl}>
          <Button
            backgroundColor="#793EF5"
            borderRadius={16}
            height={54}
            pressStyle={{ opacity: 0.9, scale: 0.98 }}
            onPress={onNext}
          >
            <Text fontSize={18} fontWeight="600" color={colors.white}>
              {isLast ? 'Get Started' : 'Next'}
            </Text>
          </Button>
        </View>
      </YStack>
    </LinearGradient>
  );
}
