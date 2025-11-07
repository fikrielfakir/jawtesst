import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { authDesign } from '@constants/theme/authDesign';
import { gradients } from '@constants/theme/colors';
import { ChevronLeft } from '@tamagui/lucide-icons';

interface AuthScreenWrapperProps {
  children: ReactNode;
  showBackButton?: boolean;
  showLogo?: boolean;
}

export const AuthScreenWrapper: React.FC<AuthScreenWrapperProps> = ({
  children,
  showBackButton = true,
  showLogo = true,
}) => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[...gradients.auth]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={28} color={authDesign.colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.backButtonPlaceholder} />
          )}
          
          {showLogo && (
            <View style={styles.logoContainerHeader}>
              <Image
                source={require('@assets/jwa-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )}
          
          <View style={styles.backButtonPlaceholder} />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonPlaceholder: {
    width: 40,
  },
  logoContainerHeader: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 50,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: authDesign.spacing.paddingHorizontal,
    paddingBottom: authDesign.spacing.paddingVertical,
  },
});
