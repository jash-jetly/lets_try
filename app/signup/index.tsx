import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function SignupStep1() {
  const { signUpData, setSignUpData, nextStep } = useAuthStore();
  const [firstName, setFirstName] = useState(signUpData.firstName || '');
  const [lastName, setLastName] = useState(signUpData.lastName || '');
  const [age, setAge] = useState(signUpData.age || '');
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!age || parseInt(age) < 18) {
      newErrors.age = 'You must be 18 or older';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setSignUpData({ firstName, lastName, age: parseInt(age) });
      nextStep();
      router.push('/signup/step2');
    }
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
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color="#374151" />
              </TouchableOpacity>
              <Logo size="sm" />
              <View className="w-6" />
            </View>

            {/* Progress */}
            <View className="mb-8">
              <Text className="text-sm text-gray-500 text-center mb-2">Step 1 of 9</Text>
              <View className="w-full bg-cream-200 rounded-full h-2">
                <View className="bg-lavender-400 h-2 rounded-full" style={{ width: '11%' }} />
              </View>
            </View>

            {/* Content */}
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                Let's get to know you
              </Text>
              <Text className="text-gray-600 mb-8">
                We need some basic information to create your account
              </Text>

              <Input
                label="First Name"
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                error={errors.firstName}
              />

              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                error={errors.lastName}
              />

              <Input
                label="Age"
                placeholder="Enter your age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                error={errors.age}
              />
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