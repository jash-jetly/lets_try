import React, { useState } from 'react';
import { View, Text, SafeAreaView, Alert, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

export default function Diagnose() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(`${timestamp}: ${message}`);
  };

  const testConnection = async () => {
    addLog('🔍 Testing Supabase connection...');
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        addLog(`❌ Connection failed: ${error.message}`);
        Alert.alert('Connection Error', error.message);
      } else {
        addLog('✅ Supabase connection successful');
        Alert.alert('Success', 'Supabase connection working!');
      }
    } catch (err) {
      addLog(`❌ Unexpected error: ${err}`);
      Alert.alert('Error', 'Failed to connect to Supabase');
    }
  };

  const testEmailSending = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    setLoading(true);
    addLog(`📧 Attempting to send OTP to ${email}...`);

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        addLog(`❌ OTP send failed: ${error.message}`);
        addLog(`🔍 Error code: ${error.status}`);
        addLog(`🔍 Error details: ${JSON.stringify(error)}`);
        Alert.alert('OTP Send Failed', error.message);
      } else {
        addLog('✅ OTP sent successfully!');
        addLog(`📧 Email data: ${JSON.stringify(data)}`);
        Alert.alert('Success', 'OTP sent! Check your email inbox.');
      }
    } catch (err) {
      addLog(`❌ Unexpected error: ${err}`);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView className="flex-1 p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          OTP Diagnostic Tool
        </Text>

        <View className="space-y-4 mb-6">
          <Button
            title="Test Supabase Connection"
            onPress={testConnection}
            variant="outline"
          />

          <Input
            label="Email Address"
            placeholder="Enter email to test OTP"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Button
            title="Send Test OTP"
            onPress={testEmailSending}
            loading={loading}
            size="lg"
          />

          <Button
            title="Clear Logs"
            onPress={clearLogs}
            variant="outline"
          />
        </View>

        <View className="bg-gray-100 p-4 rounded-lg">
          <Text className="font-semibold mb-2">Diagnostic Logs:</Text>
          <ScrollView className="max-h-60">
            {logs.length === 0 ? (
              <Text className="text-gray-500 text-sm">No logs yet. Run a test to see results.</Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} className="text-xs text-gray-700 mb-1 font-mono">
                  {log}
                </Text>
              ))
            )}
          </ScrollView>
        </View>

        <View className="mt-6 p-4 bg-blue-50 rounded-lg">
          <Text className="text-blue-800 font-semibold mb-2">Common Issues:</Text>
          <Text className="text-blue-700 text-sm">
            1. Invalid Supabase credentials{'\n'}
            2. SMTP not configured in Supabase{'\n'}
            3. Domain not verified in Resend{'\n'}
            4. Email provider blocking emails{'\n'}
            5. Network connectivity issues
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 