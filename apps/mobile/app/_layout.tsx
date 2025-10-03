import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'

import '~/global.css'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutNav />
    </SafeAreaProvider>
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
