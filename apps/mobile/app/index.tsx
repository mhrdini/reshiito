import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { HomeScreen } from '@app'

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
      <StatusBar style='auto' />
    </SafeAreaProvider>
  )
}
