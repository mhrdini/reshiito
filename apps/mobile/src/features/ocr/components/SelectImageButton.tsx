import * as ImagePicker from 'expo-image-picker'
import { convertToImage } from '@/features/ocr/utils'
import { useImageStore } from '@/store'
import { Button } from 'ui/components'

export const SelectImageButton = () => {
  const { setImage } = useImageStore()

  const handlePress = async () => {
    await selectImage()
  }

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ['images', 'livePhotos'],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      const asset = result.assets[0]!
      const image = convertToImage(asset)
      setImage(image)
    }
  }

  return (
    <Button testID='select-image-button' onPress={handlePress}>
      Choose from Library
    </Button>
  )
}
