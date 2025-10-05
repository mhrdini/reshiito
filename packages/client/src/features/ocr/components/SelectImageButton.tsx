import * as ImagePicker from 'expo-image-picker'
import { useLoadImage } from 'client/features/ocr/hooks'
import { useImageStore } from 'client/store'
import { Button } from 'ui/components'

export const SelectImageButton = () => {
  const { setImage } = useImageStore()

  const handlePress = async () => {
    await selectImage()
  }

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'livePhotos'],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      const asset = result.assets[0]!
      const image = useLoadImage(asset)
      setImage(image)
    }
  }

  return <Button onPress={handlePress}>Choose from Library</Button>
}
