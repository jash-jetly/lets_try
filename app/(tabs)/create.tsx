import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useVaultStore } from '@/store/vaultStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/Logo';
import { Vault, DollarSign } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function CreateVault() {
  const { user } = useAuthStore();
  const { addVault } = useVaultStore();
  const [name, setName] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [autoDebit, setAutoDebit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!name.trim()) {
      newErrors.name = 'Vault name is required';
    }
    
    if (!monthlyAmount.trim()) {
      newErrors.monthlyAmount = 'Monthly amount is required';
    } else if (parseFloat(monthlyAmount) <= 0) {
      newErrors.monthlyAmount = 'Amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateVault = async () => {
    if (!validateForm()) return;
    if (!user) return;

    setLoading(true);

    try {
      const vaultData = {
        user_id: user.id,
        name: name.trim(),
        monthly_amount: parseFloat(monthlyAmount),
        start_date: new Date().toISOString().split('T')[0],
        total_invested: 0,
        auto_debit: autoDebit,
      };

      const { data, error } = await supabase
        .from('vaults')
        .insert(vaultData)
        .select()
        .single();

      if (error) throw error;

      addVault(data);
      
      Alert.alert(
        'Success!',
        'Your vault has been created successfully.',
        [
          {
            text: 'View Dashboard',
            onPress: () => router.push('/(tabs)'),
          },
        ]
      );

      // Reset form
      setName('');
      setMonthlyAmount('');
      setAutoDebit(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create vault. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
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
            <View className="items-center py-6">
              <Logo size="md" />
              <Text className="text-2xl font-bold text-gray-800 mt-4">
                Create New Vault
              </Text>
              <Text className="text-gray-600 mt-2 text-center">
                Set up your systematic investment plan
              </Text>
            </View>

            {/* Form */}
            <View className="flex-1">
              <Input
                label="Vault Name"
                placeholder="e.g., Emergency Fund, Retirement Savings"
                value={name}
                onChangeText={setName}
                error={errors.name}
              />

              <Input
                label="Monthly Investment Amount"
                placeholder="0.00"
                value={monthlyAmount}
                onChangeText={setMonthlyAmount}
                keyboardType="numeric"
                error={errors.monthlyAmount}
              />

              {/* Auto Debit Toggle */}
              <Card className="mb-6">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800 mb-1">
                      Auto-Debit
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Automatically invest every month (coming soon)
                    </Text>
                  </View>
                  <Switch
                    value={autoDebit}
                    onValueChange={setAutoDebit}
                    trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                    thumbColor={autoDebit ? '#22C55E' : '#F3F4F6'}
                  />
                </View>
              </Card>

              {/* Preview */}
              {monthlyAmount && parseFloat(monthlyAmount) > 0 && (
                <Card className="mb-6">
                  <View className="items-center">
                    <View className="bg-mint-100 p-4 rounded-full mb-4">
                      <Vault size={32} color="#22C55E" />
                    </View>
                    <Text className="text-lg font-bold text-gray-800 mb-2">
                      Investment Preview
                    </Text>
                    <View className="flex-row items-center mb-2">
                      <DollarSign size={20} color="#818CF8" />
                      <Text className="text-xl font-bold text-lavender-600 ml-1">
                        {formatCurrency(monthlyAmount)}
                      </Text>
                      <Text className="text-gray-600 ml-1">per month</Text>
                    </View>
                    <Text className="text-gray-600 text-center text-sm">
                      Annual investment: {formatCurrency((parseFloat(monthlyAmount) * 12).toString())}
                    </Text>
                  </View>
                </Card>
              )}

              {/* Info Card */}
              <Card className="bg-mint-50 border-mint-200">
                <Text className="text-mint-700 font-bold mb-2">💡 Pro Tip</Text>
                <Text className="text-mint-600 text-sm">
                  Start with an amount you're comfortable with. You can always increase your monthly investment later as your income grows.
                </Text>
              </Card>
            </View>

            {/* Bottom Button */}
            <View className="pb-6 pt-6">
              <Button
                title="Create Vault"
                onPress={handleCreateVault}
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