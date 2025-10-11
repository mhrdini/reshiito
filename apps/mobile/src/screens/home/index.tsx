import { useEffect } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { SelectImageButton, TakePhotoButton } from '@/features/ocr'
import { useOCR } from '@/features/ocr/hooks'
import { API_URL } from '@/lib/apiClient'
import { useImageStore, useOCRStore } from '@/store'
import { Image, Text, View } from 'ui/components'
import { cn } from 'ui/utils'

export const HomeScreen = () => {
  const { image, size } = useImageStore()
  const { result, setResult } = useOCRStore()
  const { extractText, isPending, isSuccess } = useOCR()

  useEffect(() => {
    async function performOCR() {
      let result = 'No text extracted'
      if (image?.base64) {
        const text = await extractText(image.base64)
        if (text) {
          result = text
        }
      }
      return result
    }

    if (image && result === '') {
      performOCR().then(res => {
        if (res !== useOCRStore.getState().result) {
          setResult(res)
        }
      })
    }
  }, [image, extractText, result, setResult])

  return (
    <ScrollView>
      <SafeAreaView
        testID='home-screen'
        className={cn(
          'flex-1 items-center justify-center gap-5 bg-slate-50 dark:bg-slate-900',
        )}
      >
        <StatusBar style='auto' />
        <Text testID='title' className={cn('text-2xl')}>
          reshiito レシート
        </Text>
        {image && size && (
          <Image
            testID='selected-image'
            source={{ uri: image.uri }}
            style={{ height: size.height, width: size.width }}
          />
        )}
        <View className={cn('flex-row gap-2')}>
          <TakePhotoButton />
          <SelectImageButton />
        </View>
        <Text>{API_URL}</Text>
        <Text>isSuccess: {JSON.stringify(isSuccess)}</Text>
        <Text>isPending: {JSON.stringify(isPending)}</Text>
        <Text>result: {JSON.stringify(result)}</Text>
        {/* <Text>image b64: {JSON.stringify(image?.base64)}</Text> */}
      </SafeAreaView>
    </ScrollView>
  )
}
