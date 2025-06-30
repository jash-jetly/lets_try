import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, style, className = '' }) => {
  return (
    <View 
      className={`bg-white rounded-2xl p-6 shadow-sm border border-cream-100 ${className}`}
      style={style}
    >
      {children}
    </View>
  );
};