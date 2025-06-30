import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { User, Mail, Calendar, Shield, LogOut, Settings } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const { user, profile, setUser, setProfile } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            router.replace('/');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Header */}
          <View className="items-center mb-8">
            <Logo size="lg" />
            <Text className="text-2xl font-bold text-gray-800 mt-4">
              {profile?.first_name} {profile?.last_name}
            </Text>
            <Text className="text-gray-600 mt-1">
              {profile?.email}
            </Text>
          </View>

          {/* Profile Info */}
          <View className="space-y-4 mb-8">
            <Card>
              <View className="flex-row items-center mb-4">
                <View className="bg-lavender-100 p-2 rounded-lg mr-3">
                  <User size={20} color="#818CF8" />
                </View>
                <Text className="text-lg font-bold text-gray-800">
                  Personal Information
                </Text>
              </View>
              
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Full Name:</Text>
                  <Text className="font-medium text-gray-800">
                    {profile?.first_name} {profile?.last_name}
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Age:</Text>
                  <Text className="font-medium text-gray-800">
                    {profile?.age} years old
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Email:</Text>
                  <Text className="font-medium text-gray-800">
                    {profile?.email}
                  </Text>
                </View>
              </View>
            </Card>

            <Card>
              <View className="flex-row items-center mb-4">
                <View className="bg-mint-100 p-2 rounded-lg mr-3">
                  <Shield size={20} color="#22C55E" />
                </View>
                <Text className="text-lg font-bold text-gray-800">
                  Security Status
                </Text>
              </View>
              
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Identity Verified:</Text>
                  <View className="flex-row items-center">
                    <Text className="font-medium text-mint-600">✓ Verified</Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Face Recognition:</Text>
                  <Text className="font-medium text-mint-600">✓ Completed</Text>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Recovery Phrase:</Text>
                  <Text className="font-medium text-mint-600">✓ Secured</Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Account Actions */}
          <View className="space-y-4 mb-8">
            <Text className="text-xl font-bold text-gray-800">Account</Text>
            
            <TouchableOpacity>
              <Card>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="bg-peach-100 p-2 rounded-lg mr-3">
                      <Settings size={20} color="#FB923C" />
                    </View>
                    <Text className="text-lg font-medium text-gray-800">
                      Account Settings
                    </Text>
                  </View>
                  <Text className="text-gray-400">›</Text>
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity>
              <Card>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="bg-lavender-100 p-2 rounded-lg mr-3">
                      <Shield size={20} color="#818CF8" />
                    </View>
                    <Text className="text-lg font-medium text-gray-800">
                      Security Settings
                    </Text>
                  </View>
                  <Text className="text-gray-400">›</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View className="space-y-4 mb-8">
            <Text className="text-xl font-bold text-gray-800">About</Text>
            
            <Card className="bg-cream-100">
              <View className="items-center py-4">
                <Logo size="md" />
                <Text className="text-lg font-bold text-gray-800 mt-3">
                  Monarca
                </Text>
                <Text className="text-gray-600 mt-1">
                  Version 1.0.0
                </Text>
                <Text className="text-gray-500 text-sm mt-2 text-center">
                  Build wealth. One vault at a time.
                </Text>
              </View>
            </Card>
          </View>

          {/* Sign Out Button */}
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            size="lg"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}