import type { CameraCapturedPicture } from 'expo-camera'
import type { ImagePickerAsset } from 'expo-image-picker'

export function useLoadImage(result: CameraCapturedPicture | ImagePickerAsset) {
  const image = {
    uri: result.uri,
    height: result.height,
    width: result.width,
    base64: result.base64!,
  }
  return image
}
