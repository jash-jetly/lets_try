import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function SignupStep2() {
  const { signUpData, setSignUpData, nextStep, prevStep } = useAuthStore();
  const [email, setEmail] = useState(signUpData.email || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email.toLowerCase())
        .single();

      if (existingUser) {
        setErrors({ email: 'This email is already registered' });
        setLoading(false);
        return;
      }

      // Send OTP
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        Alert.alert('Error', `Failed to send OTP:\n${JSON.stringify(error, null, 2)}`);
        setLoading(false);
        return;
      }

      setSignUpData({ email: email.toLowerCase() });
      nextStep();
      router.push('/signup/step3');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
              <Text className="text-sm text-gray-500 text-center mb-2">Step 2 of 9</Text>
              <View className="w-full bg-cream-200 rounded-full h-2">
                <View className="bg-lavender-400 h-2 rounded-full" style={{ width: '22%' }} />
              </View>
            </View>

            {/* Content */}
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                What's your email?
              </Text>
              <Text className="text-gray-600 mb-8">
                We'll send a verification code to confirm your email address
              </Text>

              <Input
                label="Email Address"
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                error={errors.email}
              />
            </View>

            {/* Bottom Button */}
            <View className="pb-6">
              <Button
                title="Send Verification Code"
                onPress={handleNext}
                size="lg"
                loading={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}