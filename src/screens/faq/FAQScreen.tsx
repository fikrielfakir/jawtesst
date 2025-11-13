import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, typography, borderRadius } from '../../constants/theme/spacing';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQAccordion = ({ question, answer }: FAQItem) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableOpacity
      style={styles.accordionItem}
      onPress={() => setIsOpen(!isOpen)}
      activeOpacity={0.7}
    >
      <View style={styles.questionRow}>
        <Text style={styles.question}>{question}</Text>
        <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>›</Text>
      </View>
      {isOpen && <Text style={styles.answer}>{answer}</Text>}
    </TouchableOpacity>
  );
};

export const FAQScreen = () => {
  const generalFAQs: FAQItem[] = [
    { question: 'How do I search for restaurants?', answer: 'Use the search bar at the top of the home screen to find restaurants by name, cuisine type, or location.' },
    { question: 'How do I search for restaurants?', answer: 'Browse through categories or use filters to narrow down your search results.' },
  ];

  const accountFAQs: FAQItem[] = [
    { question: 'How do I create an account?', answer: 'Tap on the Sign Up button and fill in your details to create a new account.' },
    { question: 'How do I reset my password?', answer: 'Go to Settings > Change Password and follow the instructions to reset your password.' },
  ];

  const reviewsFAQs: FAQItem[] = [
    { question: 'How do I write a review?', answer: 'Visit a restaurant page and tap on the Write Review button to share your experience.' },
    { question: 'Can I edit my review?', answer: 'Yes, you can edit your review by going to your profile and selecting the review you want to modify.' },
  ];

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>FAQ</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.categoryTitle}>General</Text>
        {generalFAQs.map((faq, index) => (
          <FAQAccordion key={index} question={faq.question} answer={faq.answer} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.categoryTitle}>Account</Text>
        {accountFAQs.map((faq, index) => (
          <FAQAccordion key={index} question={faq.question} answer={faq.answer} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.categoryTitle}>Reviews</Text>
        {reviewsFAQs.map((faq, index) => (
          <FAQAccordion key={index} question={faq.question} answer={faq.answer} />
        ))}
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
  section: {
    marginBottom: spacing.xxl,
  },
  categoryTitle: {
    fontSize: typography.heading.size,
    fontWeight: typography.heading.weight as any,
    color: colors.text,
    marginBottom: spacing.m,
  },
  accordionItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.m,
    marginBottom: spacing.s,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    flex: 1,
    fontSize: typography.body.size,
    fontWeight: '400',
    color: colors.text,
  },
  chevron: {
    fontSize: 20,
    color: colors.primary,
    transform: [{ rotate: '90deg' }],
  },
  chevronOpen: {
    transform: [{ rotate: '-90deg' }],
  },
  answer: {
    fontSize: typography.bodyMedium.size,
    color: colors.textSecondary,
    marginTop: spacing.m,
    lineHeight: typography.bodyMedium.lineHeight,
  },
});
