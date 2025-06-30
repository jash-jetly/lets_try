import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useVaultStore } from '@/store/vaultStore';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/Logo';
import { TrendingUp, Target, Calendar, DollarSign } from 'lucide-react-native';

export default function Analytics() {
  const { vaults } = useVaultStore();

  const totalInvested = vaults.reduce((sum, vault) => sum + vault.total_invested, 0);
  const monthlyInvestment = vaults.reduce((sum, vault) => sum + vault.monthly_amount, 0);
  const avgMonthlyPerVault = vaults.length > 0 ? monthlyInvestment / vaults.length : 0;
  const projectedAnnual = monthlyInvestment * 12;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTopVault = () => {
    if (vaults.length === 0) return null;
    return vaults.reduce((prev, current) => 
      (prev.total_invested > current.total_invested) ? prev : current
    );
  };

  const topVault = getTopVault();

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Header */}
          <View className="items-center mb-8">
            <Logo size="md" />
            <Text className="text-2xl font-bold text-gray-800 mt-4">
              Investment Analytics
            </Text>
            <Text className="text-gray-600 mt-2 text-center">
              Track your wealth building progress
            </Text>
          </View>

          {/* Key Metrics */}
          <View className="space-y-4 mb-8">
            <Card>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-600 text-sm mb-1">Total Portfolio Value</Text>
                  <Text className="text-3xl font-bold text-gray-800">
                    {formatCurrency(totalInvested)}
                  </Text>
                </View>
                <View className="bg-mint-100 p-4 rounded-xl">
                  <DollarSign size={28} color="#22C55E" />
                </View>
              </View>
            </Card>

            <View className="flex-row space-x-4">
              <Card className="flex-1">
                <View className="items-center">
                  <View className="bg-lavender-100 p-3 rounded-xl mb-3">
                    <TrendingUp size={24} color="#818CF8" />
                  </View>
                  <Text className="text-gray-600 text-sm text-center">Monthly Investment</Text>
                  <Text className="text-xl font-bold text-gray-800">
                    {formatCurrency(monthlyInvestment)}
                  </Text>
                </View>
              </Card>

              <Card className="flex-1">
                <View className="items-center">
                  <View className="bg-peach-100 p-3 rounded-xl mb-3">
                    <Target size={24} color="#FB923C" />
                  </View>
                  <Text className="text-gray-600 text-sm text-center">Annual Target</Text>
                  <Text className="text-xl font-bold text-gray-800">
                    {formatCurrency(projectedAnnual)}
                  </Text>
                </View>
              </Card>
            </View>
          </View>

          {/* Vault Breakdown */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-800 mb-4">Vault Breakdown</Text>
            
            {vaults.length === 0 ? (
              <Card>
                <View className="items-center py-8">
                  <Text className="text-lg font-bold text-gray-800 mb-2">
                    No Vaults Yet
                  </Text>
                  <Text className="text-gray-600 text-center">
                    Create your first vault to see detailed analytics
                  </Text>
                </View>
              </Card>
            ) : (
              <View className="space-y-4">
                {vaults.map((vault, index) => {
                  const percentage = totalInvested > 0 ? (vault.total_invested / totalInvested) * 100 : 0;
                  
                  return (
                    <Card key={vault.id}>
                      <View className="mb-3">
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="text-lg font-bold text-gray-800">
                            {vault.name}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {percentage.toFixed(1)}%
                          </Text>
                        </View>
                        
                        <View className="w-full bg-cream-200 rounded-full h-2 mb-3">
                          <View 
                            className="bg-lavender-400 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }} 
                          />
                        </View>
                        
                        <View className="flex-row justify-between">
                          <View>
                            <Text className="text-gray-600 text-sm">Monthly</Text>
                            <Text className="text-lg font-bold text-lavender-600">
                              {formatCurrency(vault.monthly_amount)}
                            </Text>
                          </View>
                          <View className="items-end">
                            <Text className="text-gray-600 text-sm">Total</Text>
                            <Text className="text-lg font-bold text-gray-800">
                              {formatCurrency(vault.total_invested)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </View>
            )}
          </View>

          {/* Top Performer */}
          {topVault && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-800 mb-4">Top Performer</Text>
              <Card className="bg-mint-50 border-mint-200">
                <View className="flex-row items-center mb-3">
                  <View className="bg-mint-100 p-2 rounded-lg mr-3">
                    <TrendingUp size={20} color="#22C55E" />
                  </View>
                  <Text className="text-lg font-bold text-mint-700">
                    {topVault.name}
                  </Text>
                </View>
                <Text className="text-mint-600 text-sm mb-2">
                  Your highest performing vault with the most invested amount
                </Text>
                <Text className="text-2xl font-bold text-mint-700">
                  {formatCurrency(topVault.total_invested)}
                </Text>
              </Card>
            </View>
          )}

          {/* Investment Insights */}
          <View>
            <Text className="text-xl font-bold text-gray-800 mb-4">Insights</Text>
            <View className="space-y-4">
              <Card>
                <View className="flex-row items-center mb-2">
                  <Calendar size={20} color="#818CF8" />
                  <Text className="text-lg font-bold text-gray-800 ml-2">
                    Average Monthly Investment
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-lavender-600 mb-2">
                  {formatCurrency(avgMonthlyPerVault)}
                </Text>
                <Text className="text-gray-600 text-sm">
                  per vault • {vaults.length} active vault{vaults.length !== 1 ? 's' : ''}
                </Text>
              </Card>

              <Card className="bg-peach-50 border-peach-200">
                <Text className="text-peach-700 font-bold mb-2">💡 Investment Tip</Text>
                <Text className="text-peach-600 text-sm">
                  {totalInvested === 0 
                    ? "Start your investment journey today! Even small amounts invested consistently can grow significantly over time."
                    : monthlyInvestment < 500
                      ? "Consider increasing your monthly investment by 10-20% as your income grows to accelerate wealth building."
                      : "Great job! You're building wealth consistently. Consider diversifying into different types of investments."
                  }
                </Text>
              </Card>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}