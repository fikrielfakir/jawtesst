import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, SafeAreaView } from 'react-native';
import { colors } from '../../../constants/theme/colors';
import { spacing } from '../../../constants/theme/spacing';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: boolean;
  style?: ViewStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  padding = true,
  style,
}) => {
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
    ...(padding ? { paddingHorizontal: spacing.screenHorizontal } : {}),
  };

  if (scrollable) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={[containerStyle, style]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[containerStyle, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
});
