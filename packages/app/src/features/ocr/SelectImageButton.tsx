import * as ImagePicker from 'expo-image-picker'
import { useImageStore } from '@app/store'
import { Button } from '@ui/components'

export const SelectImageButton = () => {
  const { setImage } = useImageStore()

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'livePhotos'],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      const asset = result.assets[0]!
      const image = {
        uri: asset.uri,
        height: asset.height!,
        width: asset.width!,
        base64: asset.base64!,
      }
      setImage(image)
    }
  }

  const handlePress = async () => {
    await selectImage()
  }

  return <Button onPress={handlePress}>Choose from Library</Button>
}
