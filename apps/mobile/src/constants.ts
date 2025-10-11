import type { CameraCapturedPicture, CameraPictureOptions } from 'expo-camera'
import type { ImagePickerAsset, ImagePickerResult } from 'expo-image-picker'
import type { Image } from 'types/image'
import { PermissionResponse as CameraPermissionResponse } from 'expo-camera'
import { PermissionResponse as MediaPermissionResponse } from 'expo-media-library'
import { PermissionStatus } from 'expo-modules-core'

// Camera mocks

export const MOCK_CAMERA_CAPTURED: CameraCapturedPicture = {
  uri: 'mock-uri-camera-captured',
  width: 100,
  height: 100,
  base64: 'bW9jaw==',
  format: 'jpg',
}

export const MOCK_IMAGE_CAPTURED: Image = {
  uri: 'mock-uri-camera-captured',
  width: 100,
  height: 100,
  base64: 'bW9jaw==',
}

export const MOCK_IMAGE: Image = {
  uri: 'mock-uri-camera',
  width: 100,
  height: 100,
  base64: 'bW9jaw==',
}

export const CAMERA_OPTIONS: CameraPictureOptions = {
  quality: 1,
  base64: true,
  exif: false,
  shutterSound: true,
  isImageMirror: true,
}

export const MOCK_CAMERA_PERMISSIONS_GRANTED: CameraPermissionResponse = {
  canAskAgain: true,
  granted: true,
  expires: 'never' as const,
  status: PermissionStatus.GRANTED,
}

export const MOCK_CAMERA_PERMISSIONS_DENIED: CameraPermissionResponse = {
  canAskAgain: true,
  granted: false,
  expires: 'never' as const,
  status: PermissionStatus.DENIED,
}

// Image Picker mocks
export const MOCK_PICKED_ASSET: ImagePickerAsset = {
  uri: 'mock-uri-picker',
  width: 100,
  height: 100,
  base64: 'bW9jaw==',
}

export const MOCK_PICKED_IMAGE: ImagePickerResult = {
  canceled: false,
  assets: [MOCK_PICKED_ASSET],
}

export const IMAGE_PICKER_OPTIONS = {
  base64: true,
  mediaTypes: ['images', 'livePhotos'],
  allowsEditing: true,
  quality: 1,
}

// Media Library mocks
export const MOCK_SAVED_URI = 'mock-uri-saved'

export const MOCK_MEDIA_PERMISSIONS_GRANTED: MediaPermissionResponse = {
  canAskAgain: true,
  granted: true,
  expires: 'never' as const,
  status: PermissionStatus.GRANTED,
}

export const MOCK_MEDIA_PERMISSIONS_DENIED: MediaPermissionResponse = {
  canAskAgain: true,
  granted: false,
  expires: 'never' as const,
  status: PermissionStatus.DENIED,
}

// Image store mocks
export const MOCK_IMAGE_SIZE = { width: 100, height: 100 }

// OCR mocks
export const MOCK_OCR_TEXT = 'mock'

export const MOCK_OCR_RESPONSE = {
  text: MOCK_OCR_TEXT,
}
