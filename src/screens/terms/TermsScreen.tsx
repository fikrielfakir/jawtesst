import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, typography } from '../../constants/theme/spacing';

export const TermsScreen = () => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Terms and Conditions</Text>
      </View>

      <Text style={styles.intro}>
        Welcome to JAW, a mobile application designed to help you discover and explore restaurants and cafes in your area. By using our app, you agree to comply with and be bound by the following terms and conditions. Please read them carefully. If you do not agree with these terms, you should not use the app.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using the JAW app, you agree to be bound by these terms and conditions, including any future modifications. Your continued use of the app after any changes to these terms will constitute acceptance of any such changes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Description of Service</Text>
        <Text style={styles.paragraph}>
          JAW provides a platform for users to search, discover, and book tables at various restaurants and cafes. It allows users to view menus, photos, reviews, and other information about restaurants, but it does not guarantee the accuracy, completeness, or reliability of any information on the app.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. User Conduct</Text>
        <Text style={styles.paragraph}>
          By using JAW, you agree not to: Use the app for any unlawful or harmful purposes. Upload or post any content that is defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable content.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All content, trademarks, logos, and other materials displayed on the app are protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, distribute, or create derivative works from any content without our express written permission.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          JAW is not liable for any direct, indirect, incidental, consequential, or special damages resulting from your use of the app. This includes, but is not limited to errors, omissions, interruptions, defects, delays, or any failure in computer operation or communication failures.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Modifications to Terms</Text>
        <Text style={styles.paragraph}>
          JAW reserves the right to modify these terms and conditions at any time. We will notify you of any significant changes. Your continued use of the app after such changes constitutes your acceptance of the new terms.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Governing Law</Text>
        <Text style={styles.paragraph}>
          These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which JAW operates, without regard to its conflict of law provisions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have any questions or concerns about these terms and conditions, please contact us at support@jawapp.com
        </Text>
      </View>
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
  intro: {
    fontSize: typography.bodyMedium.size,
    color: colors.textSecondary,
    lineHeight: typography.bodyMedium.lineHeight,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.heading.size,
    fontWeight: typography.heading.weight as any,
    color: colors.text,
    marginBottom: spacing.s,
  },
  paragraph: {
    fontSize: typography.bodyMedium.size,
    color: colors.textSecondary,
    lineHeight: typography.bodyMedium.lineHeight,
  },
});
