import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'

import '@/global.css'

import { queryClient } from '@/lib/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='camera/index' options={{ headerShown: false }} />
    </Stack>
  )
}
