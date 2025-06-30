import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { ArrowLeft, Upload, FileText } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '@/lib/supabase';

export default function SignupStep5() {
  const { signUpData, setSignUpData, nextStep, prevStep } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        // Check file size (2MB limit)
        if (file.size && file.size > 2 * 1024 * 1024) {
          Alert.alert('Error', 'File size must be less than 2MB');
          return;
        }
        
        setSelectedFile(file);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a document first');
      return;
    }

    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${signUpData.email}-${Date.now()}.${fileExt}`;
      
      const formData = new FormData();
      formData.append('file', {
        uri: selectedFile.uri,
        name: fileName,
        type: selectedFile.mimeType,
      } as any);

      const { data, error } = await supabase.storage
        .from('id-documents')
        .upload(fileName, formData, {
          contentType: selectedFile.mimeType,
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('id-documents')
        .getPublicUrl(fileName);

      setSignUpData({ idDocumentUrl: publicUrl });
      nextStep();
      router.push('/signup/step6');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
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
            <Text className="text-sm text-gray-500 text-center mb-2">Step 5 of 9</Text>
            <View className="w-full bg-cream-200 rounded-full h-2">
              <View className="bg-lavender-400 h-2 rounded-full" style={{ width: '55%' }} />
            </View>
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Upload your ID
            </Text>
            <Text className="text-gray-600 mb-8">
              We need to verify your identity to keep everyone safe
            </Text>

            <TouchableOpacity
              onPress={pickDocument}
              className="border-2 border-dashed border-lavender-300 rounded-2xl p-8 items-center justify-center mb-6"
            >
              <Upload size={48} color="#A5B4FC" className="mb-4" />
              <Text className="text-lg font-medium text-gray-700 mb-2">
                Upload Document
              </Text>
              <Text className="text-sm text-gray-500 text-center">
                Select a photo of your ID, passport, or driver's license
              </Text>
              <Text className="text-xs text-gray-400 mt-2">
                Supported formats: JPG, PNG, PDF (Max 2MB)
              </Text>
            </TouchableOpacity>

            {selectedFile && (
              <View className="bg-mint-50 p-4 rounded-xl mb-6">
                <View className="flex-row items-center">
                  <FileText size={20} color="#22C55E" />
                  <Text className="text-mint-700 font-medium ml-2">
                    {selectedFile.name}
                  </Text>
                </View>
                <Text className="text-xs text-mint-600 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Button */}
          <View className="pb-6">
            <Button
              title={selectedFile ? "Upload & Continue" : "Select Document First"}
              onPress={uploadDocument}
              size="lg"
              loading={uploading}
              disabled={!selectedFile}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
