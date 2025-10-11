import { MOCK_MEDIA_PERMISSIONS_DENIED, MOCK_SAVED_URI } from '@/constants'

export const MediaLibrary = jest.createMockFromModule('expo-media-library')

export const usePermissions = jest.fn(() => [
  MOCK_MEDIA_PERMISSIONS_DENIED, // current permission state
  jest.fn(), // request permission function
  jest.fn(), // get permission function
])

export const saveToLibraryAsync = jest.fn()
saveToLibraryAsync.mockResolvedValue(MOCK_SAVED_URI)
