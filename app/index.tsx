import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Olá!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Já ouviu falar do ÓIA?</ThemedText>
        <ThemedText>
          O <ThemedText type="defaultSemiBold">app que vai transformar a forma como gerencia seu negócio</ThemedText> rapidamente.
          Faça o {' '}
          <ThemedText type="defaultSemiBold">
            login ou crie uma conta
          </ThemedText>{' '}
          e começe a usar!
        </ThemedText>
      </ThemedView>
      <View
        style={{
          marginTop: 280,
          gap: 10
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor: '#1D3D47',
            padding: 12,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            router.push('/accountManagement/login')
          }}>
          <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
            Login
          </Text>
        </TouchableOpacity>
        <Text onPress={() => router.push('/accountManagement/signup')} style={{ justifyContent: 'center', alignSelf: 'center', fontSize: 14, textDecorationLine: 'underline', color: '#1D3D47' }}>Criar sua conta</Text>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
