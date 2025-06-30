import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { CheckCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { encryptPassphrase } from '@/lib/crypto';

export default function SignupStep9() {
  const { signUpData, setUser, resetSignUp } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const completeSignup = async () => {
    setLoading(true);

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create account');
      }

      // Encrypt the passphrase
      const encryptedPassphrase = await encryptPassphrase(signUpData.passphrase);

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: signUpData.email,
          first_name: signUpData.firstName,
          last_name: signUpData.lastName,
          age: signUpData.age,
          encrypted_passphrase: encryptedPassphrase,
          id_document_url: signUpData.idDocumentUrl,
          face_verification_completed: signUpData.faceVerificationCompleted,
        });

      if (profileError) {
        throw profileError;
      }

      setUser(authData.user);
      resetSignUp();
      
      Alert.alert(
        'Success!',
        'Your account has been created successfully. Welcome to Monarca!',
        [
          {
            text: 'Get Started',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 items-center justify-center">
          {/* Success Icon */}
          <View className="items-center mb-8">
            <CheckCircle size={80} color="#22C55E" className="mb-4" />
            <Logo size="lg" />
          </View>

          {/* Content */}
          <View className="items-center mb-12">
            <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Almost Done!
            </Text>
            <Text className="text-lg text-gray-600 text-center mb-8">
              Your account is ready to be created. Let's get you started on your wealth-building journey.
            </Text>

            {/* Summary */}
            <View className="bg-white p-6 rounded-2xl shadow-sm border border-cream-100 w-full">
              <Text className="text-lg font-bold text-gray-800 mb-4">Account Summary</Text>
              
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Name:</Text>
                  <Text className="font-medium text-gray-800">
                    {signUpData.firstName} {signUpData.lastName}
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Email:</Text>
                  <Text className="font-medium text-gray-800">{signUpData.email}</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Age:</Text>
                  <Text className="font-medium text-gray-800">{signUpData.age}</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">ID Verified:</Text>
                  <Text className="font-medium text-mint-600">✓ Yes</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Face Verified:</Text>
                  <Text className="font-medium text-mint-600">✓ Yes</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Recovery Phrase:</Text>
                  <Text className="font-medium text-mint-600">✓ Secured</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Button */}
          <View className="w-full">
            <Button
              title="Create My Account"
              onPress={completeSignup}
              size="lg"
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}