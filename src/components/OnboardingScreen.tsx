import React from 'react';
import { View, Text, Button, YStack, XStack } from 'tamagui';
import { LinearGradient } from '@tamagui/linear-gradient';
import { colors } from '@constants/theme/colors';
import { spacing, borderRadius } from '@constants/theme/spacing';

interface OnboardingScreenProps {
  title: string;
  illustration: React.ReactNode;
  onNext: () => void;
  onSkip: () => void;
  isLast?: boolean;
}

export function OnboardingScreen({
  title,
  illustration,
  onNext,
  onSkip,
  isLast = false,
}: OnboardingScreenProps) {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={{ flex: 1 }}
    >
      <YStack flex={1} paddingVertical={spacing.l}>
        <XStack justifyContent="space-between" alignItems="center" paddingHorizontal={spacing.m}>
          <View width={60} />
          <Text
            fontSize={36}
            fontWeight="bold"
            color={colors.white}
            letterSpacing={2}
          >
            JAW
          </Text>
          <Button
            unstyled
            onPress={onSkip}
            padding={spacing.s}
          >
            <Text fontSize={14} color={colors.white}>
              Skip
            </Text>
          </Button>
        </XStack>

        <YStack flex={1} justifyContent="center" alignItems="center" gap={spacing.xl}>
          <View
            width={300}
            height={300}
            justifyContent="center"
            alignItems="center"
          >
            {illustration}
          </View>

          <Text
            fontSize={24}
            fontWeight="600"
            color={colors.white}
            textAlign="center"
            maxWidth={280}
            lineHeight={32}
          >
            {title}
          </Text>
        </YStack>

        <View paddingHorizontal="10%" paddingBottom={spacing.xxl}>
          <Button
            backgroundColor={colors.primary}
            borderRadius={borderRadius.pill}
            height={52}
            pressStyle={{ opacity: 0.8 }}
            shadowColor="rgba(107, 92, 231, 0.3)"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={1}
            shadowRadius={12}
            onPress={onNext}
          >
            <Text fontSize={16} fontWeight="600" color={colors.white}>
              {isLast ? 'Get Started' : 'Next'}
            </Text>
          </Button>
        </View>
      </YStack>
    </LinearGradient>
  );
}
