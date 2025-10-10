import { CameraPictureOptions } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import { Camera } from '@/features/ocr/components/Camera'
import { useImageStore } from '@/store'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import { Image } from 'types/image'

const getCurrentStore = () => useImageStore.getState()

const { mockBack, mockDismissAll } = jest.requireMock('expo-router') as {
  mockBack: jest.Mock<void>
  mockDismissAll: jest.Mock<void>
}

const { mockTakePictureAsync } = jest.requireMock('expo-camera') as {
  mockTakePictureAsync: jest.Mock<
    Promise<{ uri: string }>,
    [CameraPictureOptions?]
  >
}

describe('<Camera />', () => {
  const mockImage: Image = {
    uri: 'mock-uri',
    width: 100,
    height: 100,
    base64: 'bW9jaw==',
  }

  const cameraOptions: CameraPictureOptions = {
    quality: 1,
    base64: true,
    exif: false,
    shutterSound: true,
    isImageMirror: true,
  }

  let store: ReturnType<typeof useImageStore.getState>

  beforeEach(() => {
    jest.clearAllMocks()

    // setup mocks
    mockTakePictureAsync.mockResolvedValue({ uri: 'mock-uri' })
    store = getCurrentStore() // for setup only
    act(() => {
      store.clear()
      store.setIsCameraReady(true)
    })
  })

  it('renders camera view when no captured image', () => {
    const { getByTestId } = render(<Camera />)
    expect(getByTestId('camera')).toBeTruthy()
    expect(getByTestId('capture-button')).toBeTruthy()
  })

  it('renders preview view when image is captured', () => {
    act(() => store.setCapturedImage(mockImage))

    const { getByTestId } = render(<Camera />)

    const image = getByTestId('preview-image')
    // TODO fix type
    expect(image.props.source[0].uri).toBe(mockImage.uri)

    const retakeButton = getByTestId('retake-button')
    const confirmButton = getByTestId('confirm-button')
    expect(retakeButton).toBeTruthy()
    expect(confirmButton).toBeTruthy()
  })

  it('pressing capture button takes picture and shows preview', async () => {
    expect(getCurrentStore().capturedImage).toBeNull()

    const { getByTestId } = render(<Camera />)
    const captureButton = getByTestId('capture-button')

    expect(captureButton).toBeTruthy()

    await act(async () => fireEvent.press(captureButton))

    await waitFor(() => {
      expect(mockTakePictureAsync).toHaveBeenCalledWith(cameraOptions)
      expect(getCurrentStore().capturedImage).toEqual(mockImage)
    })
  })

  it('pressing cancel button clears capturedImage and goes back', () => {
    const { getByTestId } = render(<Camera />)
    const cancelButton = getByTestId('cancel-button')
    expect(cancelButton).toBeTruthy()

    act(() => fireEvent.press(cancelButton))

    expect(getCurrentStore().capturedImage).toBeNull()
    expect(getCurrentStore().isCameraReady).toBe(false)
    expect(mockBack).toHaveBeenCalled()
  })

  it('pressing confirm button saves image and clears capturedImage', async () => {
    act(() => {
      store.clearImage()
      store.setCapturedImage(mockImage)
    })

    expect(getCurrentStore().image).toBeNull()
    expect(getCurrentStore().capturedImage).toEqual(mockImage)

    const { getByTestId } = render(<Camera />)
    const confirmButton = getByTestId('confirm-button')

    await act(async () => fireEvent.press(confirmButton))

    expect(MediaLibrary.saveToLibraryAsync).toHaveBeenCalledWith('mock-uri')
    expect(getCurrentStore().image).toEqual(mockImage)
    expect(getCurrentStore().capturedImage).toBeNull()
    expect(mockDismissAll).toHaveBeenCalled()
  })

  it('pressing retake button clears capturedImage without saving', () => {
    act(() => store.setCapturedImage(mockImage))

    const { getByTestId } = render(<Camera />)
    const retakeButton = getByTestId('retake-button')

    act(() => fireEvent.press(retakeButton))

    expect(getCurrentStore().capturedImage).toBeNull()
    expect(MediaLibrary.saveToLibraryAsync).not.toHaveBeenCalled()
    expect(mockBack).not.toHaveBeenCalled()
    expect(mockDismissAll).not.toHaveBeenCalled()
  })
})
