import colors from '@/components/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CompanyDashboard() {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 }}>
        <Ionicons name='chevron-back' size={36} color={colors.title} onPress={() => {router.replace('/(tabs)/home')}} />
        <Text style={styles.title}>Dashboard da Empresa</Text>
      </View>
      <Text style={styles.subtitle}>Funcionalidades em breve...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.title,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtitle,
  },
});