import { useCameraPermissions } from 'expo-camera'
import { usePermissions as useMediaPermissions } from 'expo-media-library'
import {
  MOCK_CAMERA_PERMISSIONS_DENIED,
  MOCK_CAMERA_PERMISSIONS_GRANTED,
  MOCK_MEDIA_PERMISSIONS_DENIED,
  MOCK_MEDIA_PERMISSIONS_GRANTED,
} from '@/constants'
import { usePermissions } from '@/features/ocr/hooks/usePermissions'
import { act, renderHook } from '@testing-library/react-native'

// Create typed mock references for clarity and no semicolon hacks
const mockUseCameraPermissions = useCameraPermissions as jest.MockedFunction<
  typeof useCameraPermissions
>
const mockUseMediaPermissions = useMediaPermissions as jest.MockedFunction<
  typeof useMediaPermissions
>

describe('usePermissions hook', () => {
  const mockRequestCameraPermission = jest.fn()
  const mockGetCameraPermission = jest.fn()
  const mockRequestMediaPermission = jest.fn()
  const mockGetMediaPermission = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('requests camera and media permissions when not granted', async () => {
    mockUseCameraPermissions.mockReturnValue([
      MOCK_CAMERA_PERMISSIONS_DENIED,
      mockRequestCameraPermission,
      mockGetCameraPermission,
    ])
    mockUseMediaPermissions.mockReturnValue([
      MOCK_MEDIA_PERMISSIONS_DENIED,
      mockRequestMediaPermission,
      mockGetMediaPermission,
    ])

    const { result } = renderHook(() => usePermissions())

    await act(async () => result.current.requestPermissions())

    expect(mockRequestCameraPermission).toHaveBeenCalled()
    expect(mockRequestMediaPermission).toHaveBeenCalled()
  })

  it('does not request permissions when already granted', async () => {
    mockUseCameraPermissions.mockReturnValue([
      MOCK_CAMERA_PERMISSIONS_GRANTED,
      mockRequestCameraPermission,
      mockGetCameraPermission,
    ])
    mockUseMediaPermissions.mockReturnValue([
      MOCK_MEDIA_PERMISSIONS_GRANTED,
      mockRequestMediaPermission,
      mockGetMediaPermission,
    ])

    const { result } = renderHook(() => usePermissions())

    await act(async () => result.current.requestPermissions())

    expect(mockRequestCameraPermission).not.toHaveBeenCalled()
    expect(mockRequestMediaPermission).not.toHaveBeenCalled()
  })
})
