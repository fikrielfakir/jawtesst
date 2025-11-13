import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, Button } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, typography, borderRadius } from '../../constants/theme/spacing';

const BenefitItem = ({ icon, title, description }: any) => (
  <View style={styles.benefitItem}>
    <View style={styles.benefitIcon}>
      <Text style={styles.iconText}>{icon}</Text>
    </View>
    <View style={styles.benefitContent}>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitDescription}>{description}</Text>
    </View>
  </View>
);

export const PremierPlanScreen = () => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Premier Plan</Text>
      </View>

      <View style={styles.logoSection}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>💎</Text>
        </View>
        <Text style={styles.planName}>JAW Premier</Text>
        <Text style={styles.planDescription}>
          Unlock exclusive benefits and elevate your dining experience with JAW Premier.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefits</Text>
        
        <BenefitItem
          icon="🕐"
          title="Priority Reservations"
          description="Get priority access to reservations at popular restaurants."
        />
        
        <BenefitItem
          icon="💰"
          title="Exclusive Discounts"
          description="Enjoy exclusive discounts and offers at participating restaurants."
        />
        
        <BenefitItem
          icon="⭐"
          title="Personalized Recommendations"
          description="Receive personalized recommendations based on your preferences."
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing</Text>
        <View style={styles.pricingCard}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>$120 / month</Text>
            <Text style={styles.currency}>USD</Text>
          </View>
        </View>
      </View>

      <Button
        title="Subscribe to Premier"
        onPress={() => {}}
        fullWidth
        style={styles.subscribeButton}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.l,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.title.size,
    fontWeight: typography.title.weight as any,
    color: colors.text,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.primaryHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
  },
  logoText: {
    fontSize: 40,
  },
  planName: {
    fontSize: typography.title.size,
    fontWeight: typography.title.weight as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  planDescription: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.body.lineHeight,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.heading.size,
    fontWeight: typography.heading.weight as any,
    color: colors.text,
    marginBottom: spacing.m,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: spacing.l,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  iconText: {
    fontSize: 20,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  benefitDescription: {
    fontSize: typography.bodyMedium.size,
    color: colors.textSecondary,
    lineHeight: typography.bodyMedium.lineHeight,
  },
  pricingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: spacing.l,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: typography.display.size,
    fontWeight: typography.display.weight as any,
    color: colors.text,
  },
  currency: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
  },
  subscribeButton: {
    marginTop: spacing.l,
  },
});
