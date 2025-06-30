import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { supabase } from '@/lib/supabase';
import { generateRandomIndices, encryptPassphrase } from '@/lib/crypto';

export default function PassphraseVerification() {
  const { user, setProfile } = useAuthStore();
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [profile, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      setProfileData(data);
      const indices = generateRandomIndices(12, 5);
      setSelectedIndices(indices);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  const verifyPassphrase = async () => {
    setLoading(true);

    try {
      // Create a test passphrase from user input
      const testPassphrase = new Array(12).fill('test');
      selectedIndices.forEach((wordIndex, index) => {
        testPassphrase[wordIndex] = userAnswers[index].toLowerCase().trim();
      });

      const testEncrypted = await encryptPassphrase(testPassphrase);
      
      if (testEncrypted === profile.encrypted_passphrase) {
        setProfile(profile);
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Verification Failed', 
          'The passphrase words you entered are incorrect. Please try again.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify passphrase');
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <View className="flex-1 items-center justify-center">
          <Logo size="lg" />
          <Text className="text-gray-600 mt-4">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6">
          {/* Header */}
          <View className="items-center py-8">
            <Logo size="lg" />
            <Text className="text-2xl font-bold text-gray-800 mt-4">
              Verify Your Identity
            </Text>
            <Text className="text-gray-600 mt-2 text-center">
              Please enter the missing words from your recovery passphrase
            </Text>
          </View>

          {/* Passphrase Inputs */}
          <View className="flex-1">
            {selectedIndices.map((wordIndex, index) => (
              <View key={index} className="mb-4">
                <Input
                  label={`Word #${wordIndex + 1}`}
                  placeholder={`Enter word ${wordIndex + 1}`}
                  value={userAnswers[index]}
                  onChangeText={(value) => updateAnswer(index, value)}
                />
              </View>
            ))}

            <View className="bg-peach-50 p-4 rounded-xl mt-4 border border-peach-200">
              <Text className="text-peach-700 font-medium mb-2">🔐 Security Notice</Text>
              <Text className="text-peach-600 text-sm">
                Enter the exact words from your 12-word recovery passphrase. This verifies that you have access to your account recovery information.
              </Text>
            </View>
          </View>

          {/* Bottom Button */}
          <View className="pb-6 pt-6">
            <Button
              title="Verify & Continue"
              onPress={verifyPassphrase}
              size="lg"
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}