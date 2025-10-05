import { Platform } from 'react-native'
import { Camera } from 'client/features/ocr'
import { View } from 'ui/components'
import { cn } from 'ui/utils'

export const CameraScreen = () => {
  return (
    <View
      className={cn(
        'flex-1 items-center justify-center bg-black',
        Platform.OS === 'web' && 'h-screen',
      )}
    >
      <Camera />
    </View>
  )
}
