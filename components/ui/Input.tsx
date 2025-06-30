import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  multiline = false,
  numberOfLines = 1,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-medium mb-2 text-base">
          {label}
        </Text>
      )}
      <View className="relative">
        <TextInput
          className={`bg-cream-50 border-2 rounded-xl px-4 py-3 text-base ${
            isFocused 
              ? 'border-lavender-300' 
              : error 
                ? 'border-red-300' 
                : 'border-cream-200'
          } ${multiline ? 'min-h-[80px]' : ''}`}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {secureTextEntry && (
          <TouchableOpacity
            className="absolute right-4 top-3"
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color="#9CA3AF" />
            ) : (
              <Eye size={20} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
};