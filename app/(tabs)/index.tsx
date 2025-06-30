import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useVaultStore } from '@/store/vaultStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { PlusCircle, TrendingUp, DollarSign, Calendar } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function Dashboard() {
  const { user, profile } = useAuthStore();
  const { vaults, setVaults, loading, setLoading } = useVaultStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchVaults();
    }
  }, [user]);

  const fetchVaults = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vaults')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVaults(data || []);
    } catch (error) {
      console.error('Error fetching vaults:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVaults();
    setRefreshing(false);
  };

  const totalInvested = vaults.reduce((sum, vault) => sum + vault.total_invested, 0);
  const monthlyInvestment = vaults.reduce((sum, vault) => sum + vault.monthly_amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 py-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                Welcome back,
              </Text>
              <Text className="text-2xl font-bold text-lavender-600">
                {profile?.first_name || 'Investor'}
              </Text>
            </View>
            <Logo size="md" />
          </View>

          {/* Stats Cards */}
          <View className="space-y-4 mb-6">
            <Card>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-600 text-sm mb-1">Total Invested</Text>
                  <Text className="text-2xl font-bold text-gray-800">
                    {formatCurrency(totalInvested)}
                  </Text>
                </View>
                <View className="bg-mint-100 p-3 rounded-xl">
                  <DollarSign size={24} color="#22C55E" />
                </View>
              </View>
            </Card>

            <View className="flex-row space-x-4">
              <Card className="flex-1">
                <View className="items-center">
                  <View className="bg-lavender-100 p-2 rounded-lg mb-2">
                    <TrendingUp size={20} color="#818CF8" />
                  </View>
                  <Text className="text-gray-600 text-xs text-center">Monthly</Text>
                  <Text className="text-lg font-bold text-gray-800">
                    {formatCurrency(monthlyInvestment)}
                  </Text>
                </View>
              </Card>

              <Card className="flex-1">
                <View className="items-center">
                  <View className="bg-peach-100 p-2 rounded-lg mb-2">
                    <Calendar size={20} color="#FB923C" />
                  </View>
                  <Text className="text-gray-600 text-xs text-center">Active Vaults</Text>
                  <Text className="text-lg font-bold text-gray-800">
                    {vaults.length}
                  </Text>
                </View>
              </Card>
            </View>
          </View>

          {/* Vaults Section */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-800">Your Vaults</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/create')}
              className="flex-row items-center"
            >
              <PlusCircle size={20} color="#818CF8" />
              <Text className="text-lavender-600 ml-1 font-medium">Add Vault</Text>
            </TouchableOpacity>
          </View>

          {/* Vaults List */}
          {loading ? (
            <Card>
              <Text className="text-center text-gray-600">Loading vaults...</Text>
            </Card>
          ) : vaults.length === 0 ? (
            <Card>
              <View className="items-center py-8">
                <View className="bg-cream-100 p-4 rounded-full mb-4">
                  <PlusCircle size={32} color="#9CA3AF" />
                </View>
                <Text className="text-lg font-bold text-gray-800 mb-2">
                  Start Your First Vault
                </Text>
                <Text className="text-gray-600 text-center mb-6">
                  Create your first investment vault to begin building wealth systematically
                </Text>
                <Button
                  title="Create Vault"
                  onPress={() => router.push('/(tabs)/create')}
                />
              </View>
            </Card>
          ) : (
            <View className="space-y-4">
              {vaults.map((vault) => (
                <Card key={vault.id}>
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-lg font-bold text-gray-800">
                      {vault.name}
                    </Text>
                    <View className={`px-3 py-1 rounded-full ${
                      vault.auto_debit ? 'bg-mint-100' : 'bg-cream-100'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        vault.auto_debit ? 'text-mint-700' : 'text-gray-600'
                      }`}>
                        {vault.auto_debit ? 'Auto' : 'Manual'}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-gray-600 text-sm">Monthly Amount</Text>
                      <Text className="text-lg font-bold text-lavender-600">
                        {formatCurrency(vault.monthly_amount)}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-gray-600 text-sm">Total Invested</Text>
                      <Text className="text-lg font-bold text-gray-800">
                        {formatCurrency(vault.total_invested)}
                      </Text>
                    </View>
                  </View>

                  <View className="border-t border-cream-100 mt-4 pt-3">
                    <Text className="text-xs text-gray-500">
                      Started: {formatDate(vault.start_date)}
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}