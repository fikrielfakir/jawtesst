import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { authDesign } from '@constants/theme/authDesign';

interface OTPInputProps {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
  onComplete?: (code: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChangeText,
  onComplete,
}) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChangeText = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length === 0) {
      const newValue = value.substring(0, index) + value.substring(index + 1);
      onChangeText(newValue);
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (numericText.length === 1) {
      const newValue = value.substring(0, index) + numericText + value.substring(index + 1);
      onChangeText(newValue);
      
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        Keyboard.dismiss();
        if (newValue.length === length && onComplete) {
          onComplete(newValue);
        }
      }
    } else if (numericText.length > 1) {
      const pastedValue = numericText.slice(0, length);
      onChangeText(pastedValue);
      
      if (pastedValue.length === length) {
        Keyboard.dismiss();
        if (onComplete) {
          onComplete(pastedValue);
        }
      } else {
        const nextIndex = Math.min(pastedValue.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={[
            styles.input,
            focusedIndex === index && styles.inputFocused,
            digits[index] && styles.inputFilled,
          ]}
          value={digits[index] || ''}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          textAlign="center"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 32,
  },
  input: {
    width: 50,
    height: 56,
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
    backgroundColor: 'rgba(30, 27, 37, 0.6)',
    fontSize: 24,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
    textAlign: 'center',
  },
  inputFocused: {
    borderWidth: authDesign.sizes.borderWidthFocus,
    borderColor: authDesign.colors.borderFocus,
  },
  inputFilled: {
    backgroundColor: 'rgba(30, 27, 37, 0.8)',
  },
});
