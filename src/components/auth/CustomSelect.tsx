import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { authDesign } from '@constants/theme/authDesign';
import { ChevronDown, Check } from '@tamagui/lucide-icons';
import { BottomSheet } from '@components/ui/BottomSheet';

interface CustomSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  error?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  placeholder,
  value,
  onSelect,
  options,
  error,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsVisible(false);
    setIsFocused(false);
  };

  const handleOpen = () => {
    setIsVisible(true);
    setIsFocused(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsFocused(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.selectContainer,
          isFocused && styles.selectContainerFocused,
          error && styles.selectContainerError,
        ]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={authDesign.sizes.iconSize} color={authDesign.colors.iconGray} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <BottomSheet
        visible={isVisible}
        onClose={handleClose}
        title={label}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.optionsWrapper}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  option === value && styles.optionButtonSelected,
                  index === options.length - 1 && styles.optionButtonLast,
                ]}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      option === value && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {option === value && (
                    <View style={styles.checkIconContainer}>
                      <Check size={22} color={authDesign.colors.primary} strokeWidth={3} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: authDesign.spacing.fieldGap,
  },
  label: {
    fontSize: authDesign.typography.label.size,
    fontWeight: authDesign.typography.label.weight,
    color: authDesign.colors.textLabel,
    marginBottom: authDesign.spacing.labelToInput,
  },
  selectContainer: {
    height: authDesign.sizes.inputHeight,
    backgroundColor: authDesign.colors.inputBackground,
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: authDesign.spacing.inputPaddingHorizontal,
  },
  selectContainerFocused: {
    borderWidth: authDesign.sizes.borderWidthFocus,
    borderColor: authDesign.colors.borderFocus,
  },
  selectContainerError: {
    borderColor: authDesign.colors.error,
  },
  selectText: {
    fontSize: authDesign.typography.input.size,
    fontWeight: authDesign.typography.input.weight,
    color: authDesign.colors.textPrimary,
  },
  placeholderText: {
    color: authDesign.colors.textPlaceholder,
  },
  errorText: {
    fontSize: authDesign.typography.error.size,
    fontWeight: authDesign.typography.error.weight,
    color: authDesign.colors.error,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  optionsWrapper: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: authDesign.colors.inputBackground,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: authDesign.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  optionButtonSelected: {
    backgroundColor: `${authDesign.colors.primary}15`,
    borderColor: authDesign.colors.primary,
    borderWidth: 2,
  },
  optionButtonLast: {
    marginBottom: 0,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '600',
    color: authDesign.colors.textPrimary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: authDesign.colors.primary,
    fontWeight: '700',
  },
  checkIconContainer: {
    position: 'absolute',
    right: 0,
  },
});
