import React, { useState } from 'react';
import { View, Text } from 'tamagui';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { colors } from '@constants/theme/colors';

const onboardingData = [
  {
    title: 'Discover the perfect vibe for every occasion',
    illustrationColor: colors.primary,
  },
  {
    title: 'Share your moments with reviews, photos, and videos',
    illustrationColor: '#FF9800',
  },
  {
    title: 'Easily grow and promote all your businesses',
    illustrationColor: colors.success,
  },
  {
    title: 'Book a table and create lasting memories',
    illustrationColor: colors.info,
  },
];

export default function OnboardingFlow() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/(auth)/welcome');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/welcome');
  };

  const currentScreen = onboardingData[currentIndex];

  const IllustrationPlaceholder = ({ color }: { color: string }) => (
    <View
      width={240}
      height={240}
      borderRadius={120}
      backgroundColor={`${color}33`}
      justifyContent="center"
      alignItems="center"
    >
      <View
        width={180}
        height={180}
        borderRadius={90}
        backgroundColor={`${color}55`}
        justifyContent="center"
        alignItems="center"
      >
        <View
          width={120}
          height={120}
          borderRadius={60}
          backgroundColor={color}
        />
      </View>
    </View>
  );

  return (
    <OnboardingScreen
      title={currentScreen.title}
      illustration={<IllustrationPlaceholder color={currentScreen.illustrationColor} />}
      onNext={handleNext}
      onSkip={handleSkip}
      isLast={currentIndex === onboardingData.length - 1}
    />
  );
}
