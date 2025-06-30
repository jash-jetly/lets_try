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

export default function SignIn() {
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleSignIn = async () => {
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!password.trim()) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        router.push('/signin/passphrase');
      }
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
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

            {/* Content */}
            <View className="flex-1 pt-8">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                Welcome back
              </Text>
              <Text className="text-gray-600 mb-8">
                Sign in to your Monarca account
              </Text>

              <Input
                label="Email Address"
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                error={errors.email}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password}
              />

              <TouchableOpacity className="mb-8">
                <Text className="text-lavender-600 text-center">
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Button */}
            <View className="pb-6">
              <Button
                title="Sign In"
                onPress={handleSignIn}
                size="lg"
                loading={loading}
              />
              
              <TouchableOpacity 
                onPress={() => router.push('/signup')}
                className="mt-4"
              >
                <Text className="text-gray-600 text-center">
                  Don't have an account? <Text className="text-lavender-600 font-medium">Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}