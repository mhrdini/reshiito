import { useCameraPermissions } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'

export function usePermissions() {
  const [permission, requestPermission] = useCameraPermissions()
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions()

  const requestPermissions = async () => {
    if (!permission?.granted) {
      await requestPermission()
    }
    if (!mediaPermission?.granted) {
      await requestMediaPermission()
    }
  }

  return {
    permissions: permission?.granted || mediaPermission?.granted,
    requestPermissions,
  }
}
