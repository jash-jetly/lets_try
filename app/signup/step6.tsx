import React, { useState, useRef } from 'react';
import { View, Text, SafeAreaView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function SignupStep6() {
  const { setSignUpData, nextStep, prevStep } = useAuthStore();
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const faceSteps = [
    { instruction: "Look straight at the camera", completed: false },
    { instruction: "Turn your head to the left", completed: false },
    { instruction: "Turn your head to the right", completed: false },
    { instruction: "Look up", completed: false },
    { instruction: "Look down", completed: false },
  ];

  const [steps, setSteps] = useState(faceSteps);

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg text-gray-600 text-center">
            Loading camera permissions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <View className="flex-1 items-center justify-center px-6">
          <Camera size={64} color="#A5B4FC" className="mb-6" />
          <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
            Camera Access Required
          </Text>
          <Text className="text-gray-600 mb-8 text-center">
            We need access to your camera for face verification
          </Text>
          <Button
            title="Grant Camera Permission"
            onPress={requestPermission}
            size="lg"
          />
        </View>
      </SafeAreaView>
    );
  }

  const completeCurrentStep = () => {
    const newSteps = [...steps];
    newSteps[currentStep].completed = true;
    setSteps(newSteps);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed
      completeFaceVerification();
    }
  };

  const completeFaceVerification = () => {
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setSignUpData({ faceVerificationCompleted: true });
      nextStep();
      router.push('/signup/step7');
    }, 2000);
  };

  const handleBack = () => {
    prevStep();
    router.back();
  };

  if (isProcessing) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <View className="flex-1 items-center justify-center px-6">
          <Logo size="lg" />
          <Text className="text-xl font-bold text-gray-800 mt-6 text-center">
            Processing face verification...
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            Please wait while we verify your identity
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4 px-6">
          <TouchableOpacity onPress={handleBack}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Logo size="sm" />
          <View className="w-6" />
        </View>

        {/* Progress */}
        <View className="mb-6 px-6">
          <Text className="text-sm text-gray-500 text-center mb-2">Step 6 of 9</Text>
          <View className="w-full bg-cream-200 rounded-full h-2">
            <View className="bg-lavender-400 h-2 rounded-full" style={{ width: '66%' }} />
          </View>
        </View>

        {/* Content */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Face Verification
          </Text>
          <Text className="text-gray-600 mb-4">
            Follow the instructions to complete face verification
          </Text>
          
          <Text className="text-lg font-medium text-lavender-600 text-center">
            {steps[currentStep].instruction}
          </Text>
        </View>

        {/* Camera */}
        <View className="flex-1 mx-6 mb-6">
          <View className="flex-1 rounded-2xl overflow-hidden">
            <CameraView
              ref={cameraRef}
              style={{ flex: 1 }}
              facing={facing}
            >
              <View className="flex-1 bg-black bg-opacity-20">
                {/* Face Guide Overlay */}
                <View className="flex-1 items-center justify-center">
                  <View className="w-64 h-80 border-4 border-white rounded-full border-dashed" />
                </View>
              </View>
            </CameraView>
          </View>
        </View>

        {/* Progress Steps */}
        <View className="px-6 mb-4">
          <View className="flex-row justify-between">
            {steps.map((step, index) => (
              <View key={index} className="items-center">
                <View
                  className={`w-3 h-3 rounded-full ${
                    step.completed
                      ? 'bg-mint-500'
                      : index === currentStep
                      ? 'bg-lavender-400'
                      : 'bg-gray-300'
                  }`}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Button */}
        <View className="px-6 pb-6">
          <Button
            title="Capture"
            onPress={completeCurrentStep}
            size="lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}