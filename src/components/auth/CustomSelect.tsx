import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { authDesign } from '@constants/theme/authDesign';
import { ChevronDown } from '@tamagui/lucide-icons';

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
        onPress={() => {
          setIsVisible(true);
          setIsFocused(true);
        }}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={authDesign.sizes.iconSize} color={authDesign.colors.iconGray} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setIsVisible(false);
          setIsFocused(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setIsVisible(false);
            setIsFocused(false);
          }}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.modalHandle}>
              <View style={styles.modalHandleLine} />
            </View>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item === value && styles.optionItemSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === value && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: authDesign.colors.background,
    borderTopLeftRadius: authDesign.sizes.cornerRadius * 3,
    borderTopRightRadius: authDesign.sizes.cornerRadius * 3,
    width: '100%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalHandleLine: {
    width: 40,
    height: 4,
    backgroundColor: authDesign.colors.border,
    borderRadius: 2,
  },
  modalHeader: {
    padding: authDesign.spacing.paddingHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: authDesign.colors.border,
  },
  modalTitle: {
    fontSize: authDesign.typography.heading.size,
    fontWeight: authDesign.typography.heading.weight,
    color: authDesign.colors.textPrimary,
  },
  optionItem: {
    padding: authDesign.spacing.paddingHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: authDesign.colors.border,
  },
  optionItemSelected: {
    backgroundColor: authDesign.colors.inputBackground,
  },
  optionText: {
    fontSize: authDesign.typography.input.size,
    color: authDesign.colors.textPrimary,
  },
  optionTextSelected: {
    color: authDesign.colors.primary,
    fontWeight: '600',
  },
});
