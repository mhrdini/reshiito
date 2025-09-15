import { useState } from 'react'
import { Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Text } from '@ui/components'
import { cn } from '@ui/utils'
import { colorScheme } from 'nativewind'

type HomeScreenProps = {
  title: string
  children?: React.ReactNode
}

export const HomeScreen = ({ title, children }: HomeScreenProps) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    setCurrentTheme(newTheme)
    colorScheme.set(newTheme)
  }

  return (
    <SafeAreaView
      className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'} items-center justify-center`}
    >
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
      <Pressable
        onPress={toggleTheme}
        className={cn(
          'rounded-full px-4 py-2',
          currentTheme === 'dark'
            ? 'bg-slate-700 active:bg-slate-800'
            : 'bg-slate-100 active:bg-slate-200',
        )}
      >
        <Text
          className={cn(
            'font-bold',
            currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900',
          )}
        >
          {currentTheme === 'dark' ? 'Dark' : 'Light'}
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}
