import { ImagePickerOptions, ImagePickerResult } from 'expo-image-picker'
import { MOCK_PICKED_IMAGE } from '@/constants'

export const ImagePicker = jest.createMockFromModule('expo-image-picker')

export const mockLaunchImageLibraryAsync = jest.fn()
mockLaunchImageLibraryAsync.mockResolvedValue(MOCK_PICKED_IMAGE)

export const launchImageLibraryAsync = (
  options?: ImagePickerOptions,
): Promise<ImagePickerResult> => {
  return mockLaunchImageLibraryAsync(options)
}
