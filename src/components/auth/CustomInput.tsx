import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity, TextInputProps, KeyboardTypeOptions } from 'react-native';
import { authDesign } from '@constants/theme/authDesign';
import { Mail, Lock, Eye, EyeOff } from '@tamagui/lucide-icons';

interface CustomInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  icon?: 'email' | 'password' | 'none';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  icon = 'none',
  autoCapitalize = 'none',
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const renderIcon = () => {
    if (icon === 'email') {
      return <Mail size={authDesign.sizes.iconSize} color={authDesign.colors.iconGray} />;
    }
    if (icon === 'password') {
      return <Lock size={authDesign.sizes.iconSize} color={authDesign.colors.iconGray} />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {icon !== 'none' && <View style={styles.iconContainer}>{renderIcon()}</View>}
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            icon !== 'none' && styles.inputWithIcon,
            secureTextEntry && styles.inputWithPasswordIcon,
          ]}
          placeholder={placeholder}
          placeholderTextColor={authDesign.colors.textPlaceholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          autoCapitalize={autoCapitalize}
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isPasswordVisible ? (
              <Eye size={authDesign.sizes.iconSize} color={authDesign.colors.iconGray} />
            ) : (
              <EyeOff size={authDesign.sizes.iconSize} color={authDesign.colors.iconGray} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  inputContainer: {
    height: authDesign.sizes.inputHeight,
    backgroundColor: authDesign.colors.inputBackground,
    borderRadius: authDesign.sizes.cornerRadius,
    borderWidth: authDesign.sizes.borderWidth,
    borderColor: authDesign.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: authDesign.spacing.inputPaddingHorizontal,
  },
  multilineContainer: {
    height: authDesign.sizes.multiLineInputHeight,
    alignItems: 'flex-start',
    paddingTop: authDesign.spacing.inputPaddingHorizontal,
  },
  inputContainerFocused: {
    borderWidth: authDesign.sizes.borderWidthFocus,
    borderColor: authDesign.colors.borderFocus,
  },
  inputContainerError: {
    borderColor: authDesign.colors.error,
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: authDesign.typography.input.size,
    fontWeight: authDesign.typography.input.weight,
    color: authDesign.colors.textPrimary,
    height: '100%',
  },
  multilineInput: {
    paddingTop: 0,
  },
  inputWithIcon: {
    marginLeft: 0,
  },
  inputWithPasswordIcon: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: authDesign.spacing.inputPaddingHorizontal,
    padding: 8,
  },
  errorText: {
    fontSize: authDesign.typography.error.size,
    fontWeight: authDesign.typography.error.weight,
    color: authDesign.colors.error,
    marginTop: 4,
  },
});
