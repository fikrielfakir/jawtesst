import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenContainer, Input, Button } from '../../design-system/components';
import { colors } from '../../constants/theme/colors';
import { spacing, typography, borderRadius } from '../../constants/theme/spacing';

export const BecomePartnerScreen = () => {
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Become partner</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="Enter your business name"
        />
        <Input
          label="Business Address"
          value={businessAddress}
          onChangeText={setBusinessAddress}
          placeholder="Enter your business address"
          containerStyle={styles.inputSpacing}
        />
        <Input
          label="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
          containerStyle={styles.inputSpacing}
        />
        <Input
          label="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
          containerStyle={styles.inputSpacing}
        />
        
        <TouchableOpacity style={styles.select} activeOpacity={0.7}>
          <Text style={styles.selectLabel}>Business Type</Text>
          <View style={styles.selectContent}>
            <Text style={styles.selectValue}>Restaurant</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>

        <Input
          label="Additional Information (Optional)"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          placeholder="Enter your contact number"
          multiline
          numberOfLines={4}
          style={styles.textArea}
          containerStyle={styles.inputSpacing}
        />
      </View>

      <View style={styles.documentsSection}>
        <Text style={styles.sectionTitle}>Upload Documents</Text>
        
        <TouchableOpacity style={styles.uploadItem} activeOpacity={0.7}>
          <Text style={styles.uploadText}>Business License</Text>
          <Text style={styles.uploadIcon}>📤</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadItem} activeOpacity={0.7}>
          <Text style={styles.uploadText}>Menu (if applicable)</Text>
          <Text style={styles.uploadIcon}>📤</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadItem} activeOpacity={0.7}>
          <Text style={styles.uploadText}>Photo of the Business</Text>
          <Text style={styles.uploadIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Submit Application"
        onPress={() => {}}
        fullWidth
        style={styles.submitButton}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.l,
  },
  title: {
    fontSize: typography.title.size,
    fontWeight: typography.title.weight as any,
    color: colors.text,
  },
  form: {
    marginBottom: spacing.xxl,
  },
  inputSpacing: {
    marginTop: spacing.m,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  select: {
    marginTop: spacing.m,
  },
  selectLabel: {
    fontSize: typography.caption.size,
    fontWeight: typography.caption.weight,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.input,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    height: 52,
    paddingHorizontal: spacing.m,
  },
  selectValue: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  documentsSection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.heading.size,
    fontWeight: typography.heading.weight as any,
    color: colors.text,
    marginBottom: spacing.m,
  },
  uploadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    marginBottom: spacing.s,
  },
  uploadText: {
    fontSize: typography.body.size,
    color: colors.textSecondary,
  },
  uploadIcon: {
    fontSize: 20,
  },
  submitButton: {
    marginTop: spacing.xl,
  },
});
