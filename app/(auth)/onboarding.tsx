import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingScreen } from '@/components/OnboardingScreen';

const onboardingData = [
  {
    title: 'Discover the perfect vibe for every occasion',
    image: require('@assets/onboarding/restaurant-owners.png'),
  },
  {
    title: 'Share your moments with reviews, photos, and videos',
    image: require('@assets/onboarding/reviews-sharing.png'),
  },
  {
    title: 'Easily grow and promote all your businesses',
    image: require('@assets/onboarding/dining-experience.png'),
  },
  {
    title: 'Book a table and create lasting memories',
    image: require('@assets/onboarding/booking-table.png'),
  },
];

export default function OnboardingFlow() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(auth)/welcome');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(auth)/welcome');
  };

  const currentScreen = onboardingData[currentIndex];

  return (
    <OnboardingScreen
      title={currentScreen.title}
      imagePath={currentScreen.image}
      currentIndex={currentIndex}
      totalSlides={onboardingData.length}
      onNext={handleNext}
      onSkip={handleSkip}
      isLast={currentIndex === onboardingData.length - 1}
    />
  );
}
