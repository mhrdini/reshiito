import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Button, Text } from '@ui/components'
import { cn } from '@ui/utils'
import { colorScheme, useColorScheme } from 'nativewind'

type HomeScreenProps = {
  title: string
  children?: React.ReactNode
}

export const HomeScreen = ({ title, children }: HomeScreenProps) => {
  const { colorScheme: initialColorScheme = 'light' } = useColorScheme()
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    initialColorScheme,
  )

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    setCurrentTheme(newTheme)
    colorScheme.set(newTheme)
  }

  return (
    <SafeAreaView
      className={cn(
        'flex-1 items-center justify-center',
        'bg-white dark:bg-slate-900',
      )}
    >
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
      <Button
        onPress={toggleTheme}
        className={cn(
          'rounded-full px-4 py-2',
          'bg-slate-100 active:bg-slate-200 dark:bg-slate-700 dark:active:bg-slate-800',
        )}
      >
        <Text className={cn('font-bold', 'text-gray-900 dark:text-gray-100')}>
          {currentTheme === 'dark' ? 'Dark' : 'Light'}
        </Text>
      </Button>
    </SafeAreaView>
  )
}
