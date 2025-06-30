import React from 'react';
import { View, Text } from 'react-native';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return { width: 40, height: 40, fontSize: 20 };
      case 'lg':
        return { width: 80, height: 80, fontSize: 36 };
      default:
        return { width: 60, height: 60, fontSize: 28 };
    }
  };

  const { width, height, fontSize } = getSize();

  return (
    <View
      className="bg-gradient-to-br from-lavender-400 to-peach-400 rounded-2xl items-center justify-center shadow-lg"
      style={{ width, height }}
    >
      <Text
        className="text-white font-bold"
        style={{ fontSize }}
      >
        M
      </Text>
    </View>
  );
};