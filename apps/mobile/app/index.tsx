import { StatusBar } from 'expo-status-bar'
import { HomeScreen } from '@screens'

export default function App() {
  return (
    <>
      <HomeScreen title='Home' />
      <StatusBar style='auto' />
    </>
  )
}
