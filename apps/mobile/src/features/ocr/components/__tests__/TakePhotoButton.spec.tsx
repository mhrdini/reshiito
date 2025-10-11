import { TakePhotoButton } from '@/features/ocr'
import { act, fireEvent, render } from '@testing-library/react-native'

const { mockNavigate } = jest.requireMock('expo-router') as {
  mockNavigate: jest.Mock<void>
}

describe('<TakePhotoButton />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly and navigates to /camera on press', async () => {
    const { getByTestId } = render(<TakePhotoButton />)
    const button = getByTestId('take-photo-button')
    expect(button).toBeOnTheScreen()

    await act(async () => fireEvent.press(button))

    expect(mockNavigate).toHaveBeenCalledWith('/camera')
  })
})
