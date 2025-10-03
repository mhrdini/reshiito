import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { SelectImageButton, TakePhotoButton } from '@app/features/ocr'
import { useImageStore } from '@app/store'
import { Image, Text, View } from '@ui/components'
import { cn } from '@ui/utils'

export const HomeScreen = () => {
  const { image, size } = useImageStore()

  return (
    <SafeAreaView
      className={cn(
        'flex-1 items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900',
      )}
    >
      <StatusBar style='auto' />
      <Text className={cn('text-lg')}>reshiito レシート</Text>
      <View className={cn('flex-row gap-2')}>
        <TakePhotoButton />
        <SelectImageButton />
      </View>
      {image && size && (
        <Image
          source={{ uri: image.uri }}
          className={cn()}
          style={{ height: size.height, width: size.width }}
        />
      )}
      <Text>{size ? `${size.height}x${size.width}` : 'No image selected'}</Text>
    </SafeAreaView>
  )
}
