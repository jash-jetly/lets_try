import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { ArrowLeft, Copy, Eye, EyeOff } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { generatePassphrase } from '@/lib/crypto';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

export default function SignupStep7() {
  const { setSignUpData, nextStep, prevStep } = useAuthStore();
  const [passphrase, setPassphrase] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const newPassphrase = generatePassphrase();
    setPassphrase(newPassphrase);
    setSignUpData({ passphrase: newPassphrase });
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(passphrase.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = () => {
    if (!isVisible) {
      Alert.alert(
        'Security Notice',
        'Please make sure you have written down your passphrase before continuing. You will need it to access your account.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'I have written it down', onPress: () => {
            nextStep();
            router.push('/signup/step8');
          }}
        ]
      );
    } else {
      nextStep();
      router.push('/signup/step8');
    }
  };

  const handleBack = () => {
    prevStep();
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
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
            <Text className="text-sm text-gray-500 text-center mb-2">Step 7 of 9</Text>
            <View className="w-full bg-cream-200 rounded-full h-2">
              <View className="bg-lavender-400 h-2 rounded-full" style={{ width: '77%' }} />
            </View>
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Your Recovery Passphrase
            </Text>
            <Text className="text-gray-600 mb-8">
              This 12-word passphrase is your key to account recovery. Write it down and keep it safe!
            </Text>

            {/* Security Warning */}
            <View className="bg-peach-50 p-4 rounded-xl mb-6 border border-peach-200">
              <Text className="text-peach-700 font-bold mb-2">⚠️ Important Security Notice</Text>
              <Text className="text-peach-600 text-sm">
                • Write down these words in order{'\n'}
                • Store them in a safe place{'\n'}
                • Never share them with anyone{'\n'}
                • You'll need them to recover your account
              </Text>
            </View>

            {/* Passphrase Display */}
            <View className="bg-white p-6 rounded-2xl shadow-sm border border-cream-100 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-800">Your Passphrase</Text>
                <View className="flex-row space-x-3">
                  <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                    {isVisible ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={copyToClipboard}>
                    <Copy size={20} color={copied ? "#22C55E" : "#6B7280"} />
                  </TouchableOpacity>
                </View>
              </View>

              {isVisible ? (
                <View className="flex-row flex-wrap">
                  {passphrase.map((word, index) => (
                    <View key={index} className="bg-cream-50 px-3 py-2 rounded-lg mr-2 mb-2">
                      <Text className="text-gray-700">
                        {index + 1}. {word}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="items-center py-8">
                  <Eye size={32} color="#D1D5DB" className="mb-2" />
                  <Text className="text-gray-500 text-center">
                    Tap the eye icon to reveal your passphrase
                  </Text>
                </View>
              )}

              {copied && (
                <Text className="text-mint-600 text-sm mt-2 text-center">
                  ✓ Copied to clipboard
                </Text>
              )}
            </View>

            {/* Instructions */}
            <View className="bg-mint-50 p-4 rounded-xl">
              <Text className="text-mint-700 font-medium mb-2">📝 What to do next:</Text>
              <Text className="text-mint-600 text-sm">
                1. Write down all 12 words in the exact order shown{'\n'}
                2. Double-check your spelling{'\n'}
                3. Store the paper in a secure location{'\n'}
                4. Never take a screenshot or save digitally
              </Text>
            </View>
          </View>

          {/* Bottom Button */}
          <View className="pb-6 pt-6">
            <Button
              title="I have written it down"
              onPress={handleNext}
              size="lg"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}