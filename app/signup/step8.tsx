import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { generateRandomIndices } from '@/lib/crypto';

export default function SignupStep8() {
  const { signUpData, nextStep, prevStep } = useAuthStore();
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>(['', '', '', '', '']);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (signUpData.passphrase) {
      const indices = generateRandomIndices(12, 5);
      setSelectedIndices(indices);
    }
  }, [signUpData.passphrase]);

  const validateAnswers = () => {
    const newErrors: string[] = [];
    let allCorrect = true;

    userAnswers.forEach((answer, index) => {
      const correctWord = signUpData.passphrase[selectedIndices[index]];
      if (answer.toLowerCase().trim() !== correctWord.toLowerCase()) {
        newErrors[index] = 'Incorrect word';
        allCorrect = false;
      } else {
        newErrors[index] = '';
      }
    });

    setErrors(newErrors);
    return allCorrect;
  };

  const handleNext = () => {
    if (validateAnswers()) {
      nextStep();
      router.push('/signup/step9');
    } else {
      Alert.alert(
        'Verification Failed',
        'Some words are incorrect. Please check your passphrase and try again.'
      );
    }
  };

  const handleBack = () => {
    prevStep();
    router.back();
  };

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
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
            <Text className="text-sm text-gray-500 text-center mb-2">Step 8 of 9</Text>
            <View className="w-full bg-cream-200 rounded-full h-2">
              <View className="bg-lavender-400 h-2 rounded-full" style={{ width: '88%' }} />
            </View>
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Verify Your Passphrase
            </Text>
            <Text className="text-gray-600 mb-8">
              Please enter the missing words from your 12-word passphrase to confirm you've written it down correctly
            </Text>

            {selectedIndices.map((wordIndex, index) => (
              <View key={index} className="mb-4">
                <Input
                  label={`Word #${wordIndex + 1}`}
                  placeholder={`Enter word ${wordIndex + 1}`}
                  value={userAnswers[index]}
                  onChangeText={(value) => updateAnswer(index, value)}
                  error={errors[index]}
                />
              </View>
            ))}

            <View className="bg-mint-50 p-4 rounded-xl mt-4">
              <Text className="text-mint-700 font-medium mb-2">💡 Tip:</Text>
              <Text className="text-mint-600 text-sm">
                Enter the exact words from your passphrase. Check your spelling and make sure they match exactly.
              </Text>
            </View>
          </View>

          {/* Bottom Button */}
          <View className="pb-6 pt-6">
            <Button
              title="Verify Passphrase"
              onPress={handleNext}
              size="lg"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}