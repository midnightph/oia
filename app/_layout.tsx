import { useColorScheme } from '@/hooks/use-color-scheme'
import auth from '@/database/firebaseConfig'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useRef } from 'react'
import 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const hasRedirected = useRef(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (hasRedirected.current) return
      hasRedirected.current = true

      if (user) {
        router.replace('/(tabs)/home')
      } else {
        router.replace('/')
      }
    })

    return unsubscribe
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="accountManagement" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaView>
  )
}
