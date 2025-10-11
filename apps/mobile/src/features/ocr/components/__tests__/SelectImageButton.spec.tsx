import * as ImagePicker from 'expo-image-picker'
import {
  IMAGE_PICKER_OPTIONS,
  MOCK_PICKED_ASSET,
  MOCK_PICKED_IMAGE,
} from '@/constants'
import { SelectImageButton } from '@/features/ocr'
import { useImageStore } from '@/store'
import { act, fireEvent, render } from '@testing-library/react-native'

const getCurrentStore = () => useImageStore.getState()

const { mockLaunchImageLibraryAsync } = jest.requireMock(
  'expo-image-picker',
) as {
  mockLaunchImageLibraryAsync: jest.Mock<
    Promise<ImagePicker.ImagePickerResult>,
    [ImagePicker.ImagePickerOptions?]
  >
}

describe('<SelectImageButton />', () => {
  let store: ReturnType<typeof useImageStore.getState>

  beforeEach(() => {
    jest.clearAllMocks()
    mockLaunchImageLibraryAsync.mockResolvedValue(MOCK_PICKED_IMAGE)
    store = getCurrentStore() // for setup only
    act(() => {
      store.clear()
      store.setIsCameraReady(false)
    })
  })

  it('renders correctly, opens image library on press', async () => {
    const { getByTestId } = render(<SelectImageButton />)
    const button = getByTestId('select-image-button')
    expect(button).toBeOnTheScreen()

    await act(async () => fireEvent.press(button))

    expect(mockLaunchImageLibraryAsync).toHaveBeenCalledWith(
      IMAGE_PICKER_OPTIONS,
    )

    expect(getCurrentStore().image).toEqual(MOCK_PICKED_ASSET)
  })
})
