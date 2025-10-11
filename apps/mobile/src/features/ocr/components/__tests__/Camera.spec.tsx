import { CameraCapturedPicture, CameraPictureOptions } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import {
  CAMERA_OPTIONS,
  MOCK_CAMERA_CAPTURED,
  MOCK_IMAGE,
  MOCK_IMAGE_CAPTURED,
} from '@/constants'
import { Camera } from '@/features/ocr'
import { useImageStore } from '@/store'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'

const getCurrentStore = () => useImageStore.getState()

const { mockBack, mockDismissAll } = jest.requireMock('expo-router') as {
  mockBack: jest.Mock<void>
  mockDismissAll: jest.Mock<void>
}

const { mockTakePictureAsync } = jest.requireMock('expo-camera') as {
  mockTakePictureAsync: jest.Mock<
    Promise<CameraCapturedPicture>,
    [CameraPictureOptions?]
  >
}

describe('<Camera />', () => {
  let store: ReturnType<typeof useImageStore.getState>

  beforeEach(() => {
    jest.clearAllMocks()

    // setup mocks
    mockTakePictureAsync.mockResolvedValue(MOCK_CAMERA_CAPTURED)
    store = getCurrentStore() // for setup only
    act(() => {
      store.clear()
      store.setIsCameraReady(true)
    })
  })

  it('renders camera view when no captured image', () => {
    const { getByTestId } = render(<Camera />)
    expect(getByTestId('camera')).toBeOnTheScreen()
    expect(getByTestId('capture-button')).toBeOnTheScreen()
  })

  it('renders preview view when image is captured', () => {
    act(() => store.setCapturedImage(MOCK_IMAGE))

    const { getByTestId } = render(<Camera />)

    const image = getByTestId('preview-image')
    // TODO fix type
    expect(image.props.source[0].uri).toBe(MOCK_IMAGE.uri)

    const retakeButton = getByTestId('retake-button')
    const confirmButton = getByTestId('confirm-button')
    expect(retakeButton).toBeOnTheScreen()
    expect(confirmButton).toBeOnTheScreen()
  })

  it('pressing capture button takes picture and shows preview', async () => {
    expect(getCurrentStore().capturedImage).toBeNull()

    const { getByTestId } = render(<Camera />)
    const captureButton = getByTestId('capture-button')

    expect(captureButton).toBeOnTheScreen()

    await act(async () => fireEvent.press(captureButton))

    await waitFor(() => {
      expect(mockTakePictureAsync).toHaveBeenCalledWith(CAMERA_OPTIONS)
      expect(getCurrentStore().capturedImage).toEqual(MOCK_IMAGE_CAPTURED)
    })
  })

  it('pressing cancel button clears capturedImage and goes back', () => {
    const { getByTestId } = render(<Camera />)
    const cancelButton = getByTestId('cancel-button')
    expect(cancelButton).toBeOnTheScreen()

    act(() => fireEvent.press(cancelButton))

    expect(getCurrentStore().capturedImage).toBeNull()
    expect(getCurrentStore().isCameraReady).toBe(false)
    expect(mockBack).toHaveBeenCalled()
  })

  it('pressing confirm button saves image and clears capturedImage', async () => {
    act(() => {
      store.clearImage()
      store.setCapturedImage(MOCK_IMAGE)
    })

    expect(getCurrentStore().image).toBeNull()
    expect(getCurrentStore().capturedImage).toEqual(MOCK_IMAGE)

    const { getByTestId } = render(<Camera />)
    const confirmButton = getByTestId('confirm-button')

    await act(async () => fireEvent.press(confirmButton))

    expect(MediaLibrary.saveToLibraryAsync).toHaveBeenCalledWith(MOCK_IMAGE.uri)
    expect(getCurrentStore().image).toEqual(MOCK_IMAGE)
    expect(getCurrentStore().capturedImage).toBeNull()
    expect(mockDismissAll).toHaveBeenCalled()
  })

  it('pressing retake button clears capturedImage without saving', () => {
    act(() => store.setCapturedImage(MOCK_IMAGE))

    const { getByTestId } = render(<Camera />)
    const retakeButton = getByTestId('retake-button')

    act(() => fireEvent.press(retakeButton))

    expect(getCurrentStore().capturedImage).toBeNull()
    expect(MediaLibrary.saveToLibraryAsync).not.toHaveBeenCalled()
    expect(mockBack).not.toHaveBeenCalled()
    expect(mockDismissAll).not.toHaveBeenCalled()
  })
})
