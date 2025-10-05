import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { SelectImageButton, TakePhotoButton } from 'client/features/ocr'
import { useImageStore } from 'client/store'
import { Image, Text, View } from 'ui/components'
import { cn } from 'ui/utils'

export const HomeScreen = () => {
  const { image, size } = useImageStore()

  return (
    <SafeAreaView
      className={cn(
        'flex-1 items-center justify-center gap-5 bg-slate-50 dark:bg-slate-900',
      )}
    >
      <StatusBar style='auto' />
      <Text className={cn('text-2xl')}>reshiito レシート</Text>
      {image && size && (
        <Image
          source={{ uri: image.uri }}
          style={{ height: size.height, width: size.width }}
        />
      )}
      <View className={cn('flex-row gap-2')}>
        <TakePhotoButton />
        <SelectImageButton />
      </View>
    </SafeAreaView>
  )
}