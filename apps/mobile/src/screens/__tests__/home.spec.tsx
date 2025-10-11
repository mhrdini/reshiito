import { MOCK_IMAGE } from '@/constants'
import { SelectImageButton, TakePhotoButton } from '@/features/ocr'
import { HomeScreen } from '@/screens/home'
import { useImageStore } from '@/store'
import { act, render, waitFor } from '@testing-library/react-native'

const getCurrentStore = () => useImageStore.getState()

jest.mock('@/features/ocr', () => ({
  TakePhotoButton: jest.fn(() => null),
  SelectImageButton: jest.fn(() => null),
}))

describe('<HomeScreen />', () => {
  let store: ReturnType<typeof useImageStore.getState>
  beforeEach(() => {
    jest.clearAllMocks()
    store = getCurrentStore()
    act(() => store.clear())
  })
  it('renders correctly', () => {
    const { getByTestId } = render(<HomeScreen />)
    expect(getByTestId('home-screen')).toBeOnTheScreen()
    expect(getByTestId('title').props.children).toBe('reshiito レシート')
    expect(TakePhotoButton).toHaveBeenCalled()
    expect(SelectImageButton).toHaveBeenCalled()
  })

  it('does not display image when no image in store', () => {
    const { queryByTestId } = render(<HomeScreen />)
    const image = queryByTestId('selected-image')
    expect(image).toBeNull() // query returns null if element not found
  })

  it('displays selected image when image is set in store', async () => {
    act(() => {
      store.setImage(MOCK_IMAGE)
    })
    const { getByTestId } = render(<HomeScreen />)
    await waitFor(() => {
      const image = getByTestId('selected-image')
      expect(image).toBeOnTheScreen()
      expect(image.props.source[0].uri).toBe(MOCK_IMAGE.uri) // There can be multiple sources
      expect(image.props.style.width).toBe(MOCK_IMAGE.width)
      expect(image.props.style.height).toBe(MOCK_IMAGE.height)
    })
  })
})
