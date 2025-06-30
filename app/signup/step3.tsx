import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function SignupStep3() {
  const { signUpData, nextStep, prevStep } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit code' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: signUpData.email,
        token: otp,
        type: 'email',
      });

      if (error) {
        setErrors({ otp: 'Invalid verification code' });
        setLoading(false);
        return;
      }

      nextStep();
      router.push('/signup/step4');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: signUpData.email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        Alert.alert('Error', `Failed to send OTP:\n${JSON.stringify(error, null, 2)}`);
        setLoading(false);
        return;
      } else {
        setCountdown(60);
        Alert.alert('Success', 'Verification code sent!');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setResendLoading(false);
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
              <Text className="text-sm text-gray-500 text-center mb-2">Step 3 of 9</Text>
              <View className="w-full bg-cream-200 rounded-full h-2">
                <View className="bg-lavender-400 h-2 rounded-full" style={{ width: '33%' }} />
              </View>
            </View>

            {/* Content */}
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                Verify your email
              </Text>
              <Text className="text-gray-600 mb-8">
                We sent a 6-digit code to {signUpData.email}
              </Text>

              <Input
                label="Verification Code"
                placeholder="Enter 6-digit code"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                error={errors.otp}
              />

              <TouchableOpacity 
                onPress={handleResend}
                disabled={countdown > 0 || resendLoading}
                className="mt-4"
              >
                <Text className={`text-center ${countdown > 0 ? 'text-gray-400' : 'text-lavender-600'}`}>
                  {countdown > 0 
                    ? `Resend code in ${countdown}s` 
                    : resendLoading 
                      ? 'Sending...' 
                      : 'Resend code'
                  }
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Button */}
            <View className="pb-6">
              <Button
                title="Verify"
                onPress={handleVerify}
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