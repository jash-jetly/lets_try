import React, { useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const { user, setUser, setLoading, loading } = useAuthStore();

  useEffect(() => {
    // Check if user is already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        router.replace('/(tabs)');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        router.replace('/(tabs)');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <View className="flex-1 items-center justify-center">
          <Logo size="lg" />
          <Text className="text-gray-600 mt-4">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (user) {
    return null; // Will redirect to tabs
  }

  return (
    <LinearGradient
      colors={['#FEF7ED', '#F0FDF4']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-8">
          <View className="items-center mb-12">
            <Logo size="lg" />
            <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
              Monarca
            </Text>
            <Text className="text-lg text-gray-600 mt-2 text-center">
              Build wealth. One vault at a time.
            </Text>
          </View>
          
          <View className="w-full space-y-4">
            <Button
              title="Sign Up"
              onPress={() => router.push('/signup')}
              size="lg"
            />
            <Button
              title="Sign In"
              onPress={() => router.push('/signin')}
              variant="outline"
              size="lg"
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}