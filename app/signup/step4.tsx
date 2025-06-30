import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function SignupStep4() {
  const { signUpData, setSignUpData, nextStep, prevStep } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecial) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleNext = () => {
    const newErrors: any = {};
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setSignUpData({ password });
      nextStep();
      router.push('/signup/step5');
    }
  };

  const handleBack = () => {
    prevStep();
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6">
            {/* Header */}
            <View className="flex-row items-center justify-between py-4">
              <TouchableOpacity onPress={handleBack}>
                <ArrowLeft size={24} color="#374151" />
              </TouchableOpacity>
              <Logo size="sm" />
              <View className="w-6" />
            </View>

            {/* Progress */}
            <View className="mb-8">
              <Text className="text-sm text-gray-500 text-center mb-2">Step 4 of 9</Text>
              <View className="w-full bg-cream-200 rounded-full h-2">
                <View className="bg-lavender-400 h-2 rounded-full" style={{ width: '44%' }} />
              </View>
            </View>

            {/* Content */}
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                Create a secure password
              </Text>
              <Text className="text-gray-600 mb-8">
                Your password should be strong to protect your account
              </Text>

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                error={errors.confirmPassword}
              />

              <View className="bg-mint-50 p-4 rounded-xl mt-4">
                <Text className="text-sm text-mint-700 font-medium mb-2">Password Requirements:</Text>
                <Text className="text-xs text-mint-600">• At least 8 characters long</Text>
                <Text className="text-xs text-mint-600">• One uppercase letter</Text>
                <Text className="text-xs text-mint-600">• One lowercase letter</Text>
                <Text className="text-xs text-mint-600">• One number</Text>
                <Text className="text-xs text-mint-600">• One special character</Text>
              </View>
            </View>

            {/* Bottom Button */}
            <View className="pb-6">
              <Button
                title="Next"
                onPress={handleNext}
                size="lg"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}