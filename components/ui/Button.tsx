import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonClasses = () => {
    let classes = 'rounded-xl flex-row items-center justify-center ';
    
    // Size classes
    switch (size) {
      case 'sm':
        classes += 'px-4 py-2 ';
        break;
      case 'lg':
        classes += 'px-8 py-4 ';
        break;
      default:
        classes += 'px-6 py-3 ';
    }
    
    // Variant classes
    switch (variant) {
      case 'secondary':
        classes += 'bg-mint-100 ';
        break;
      case 'outline':
        classes += 'border-2 border-lavender-300 bg-transparent ';
        break;
      default:
        classes += 'bg-lavender-400 ';
    }
    
    if (disabled || loading) {
      classes += 'opacity-50 ';
    }
    
    return classes;
  };
  
  const getTextClasses = () => {
    let classes = 'font-medium text-center ';
    
    // Size classes
    switch (size) {
      case 'sm':
        classes += 'text-sm ';
        break;
      case 'lg':
        classes += 'text-lg ';
        break;
      default:
        classes += 'text-base ';
    }
    
    // Variant classes
    switch (variant) {
      case 'secondary':
        classes += 'text-mint-700 ';
        break;
      case 'outline':
        classes += 'text-lavender-600 ';
        break;
      default:
        classes += 'text-white ';
    }
    
    return classes;
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? 'white' : '#6366F1'} 
          className="mr-2"
        />
      )}
      <Text className={getTextClasses()} style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};