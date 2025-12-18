import { useColorScheme } from '@/hooks/use-color-scheme'
import auth from '@/database/firebaseConfig'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack, router, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const segments = useSegments()
  const [checkingAuth, setCheckingAuth] = useState(true)

  // evita redirect duplicado
  const hasRedirected = useRef(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (hasRedirected.current) return

      const inTabs = segments[0] === '(tabs)'

      if (!user && inTabs) {
        hasRedirected.current = true
        router.replace('/')
      }

      if (user && !inTabs) {
        hasRedirected.current = true
        router.replace('/(tabs)/home')
      }

      setCheckingAuth(false)
    })

    return unsubscribe
  }, [segments])

  if (checkingAuth) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        </ThemeProvider>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="accountManagement" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaView>
  )
}
