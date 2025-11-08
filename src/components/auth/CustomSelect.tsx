import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { authDesign } from '@constants/theme/authDesign';
import { BottomSheet, BottomSheetOption } from '@components/ui/BottomSheet';
import { ChevronDown } from '@tamagui/lucide-icons';

interface CustomSelectProps {
  label?: string;
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
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsBottomSheetVisible(false);
    setIsFocused(false);
  };

  const handleOpen = () => {
    setIsBottomSheetVisible(true);
    setIsFocused(true);
  };

  const handleClose = () => {
    setIsBottomSheetVisible(false);
    setIsFocused(false);
  };

  // Find the index of the currently selected option
  const selectedIndex = value ? options.findIndex(opt => opt === value) : -1;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.selectContainer,
          isFocused && styles.selectContainerFocused,
          error && styles.selectContainerError,
        ]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectText,
            !value && styles.selectPlaceholder,
          ]}
        >
          {value || placeholder}
        </Text>
        <ChevronDown 
          size={20} 
          color={authDesign.colors.iconGray} 
          style={styles.chevronIcon}
        />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <BottomSheet
        visible={isBottomSheetVisible}
        onClose={handleClose}
        snapPoints={[0.55]}
        showScrollIndicator={true}
        selectedIndex={selectedIndex}
      >
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <BottomSheetOption
              key={option}
              label={option}
              selected={value === option}
              onPress={() => handleSelect(option)}
            />
          ))}
        </View>
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
    flex: 1,
  },
  selectPlaceholder: {
    color: authDesign.colors.textPlaceholder,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: authDesign.typography.error.size,
    fontWeight: authDesign.typography.error.weight,
    color: authDesign.colors.error,
    marginTop: 4,
  },
  optionsContainer: {
    width: '100%',
    paddingHorizontal: 0,
  },
});