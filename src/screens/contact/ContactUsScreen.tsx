import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, Input, Button } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, typography, borderRadius } from '../../constants/theme/spacing';

export const ContactUsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Contact Us</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        <Text style={styles.description}>
          We're here to help! Reach out to us with any questions, feedback, or concerns. Our team is dedicated to providing you with the best possible experience.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <View style={styles.contactItem}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📞</Text>
          </View>
          <View>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>+1 (555) 123-4567</Text>
          </View>
        </View>

        <View style={styles.contactItem}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📧</Text>
          </View>
          <View>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>support@jawapp.com</Text>
          </View>
        </View>

        <View style={styles.contactItem}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📍</Text>
          </View>
          <View>
            <Text style={styles.contactLabel}>Address</Text>
            <Text style={styles.contactValue}>123 Main Street, Anytown, USA</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send a message</Text>
        
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
        />
        
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Your Email"
          keyboardType="email-address"
          containerStyle={styles.inputSpacing}
        />
        
        <Input
          value={message}
          onChangeText={setMessage}
          placeholder="Your Message"
          multiline
          numberOfLines={5}
          style={styles.textArea}
          containerStyle={styles.inputSpacing}
        />
        
        <Button
          title="Send Message"
          onPress={() => {}}
          fullWidth
          style={styles.submitButton}
        />
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
  sectionTitle: {
    fontSize: typography.heading.size,
    fontWeight: typography.heading.weight as any,
    color: colors.text,
    marginBottom: spacing.m,
  },
  description: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
    lineHeight: typography.body.lineHeight,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  icon: {
    fontSize: 20,
  },
  contactLabel: {
    fontSize: typography.body.size,
    fontWeight: '600',
    color: colors.text,
  },
  contactValue: {
    fontSize: typography.body.size,
    color: colors.primary,
    marginTop: spacing.xxs,
  },
  inputSpacing: {
    marginTop: spacing.m,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: spacing.l,
  },
});
