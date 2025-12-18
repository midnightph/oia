import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '@/components/colors';

export default function CompanyDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard da Empresa</Text>
      <Text style={styles.subtitle}>Funcionalidades em breve...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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