import { Camera } from '@/features/ocr'
import { CameraScreen } from '@/screens/camera'
import { render } from '@testing-library/react-native'

// Mock the Camera component to keep this test focused on the screen
jest.mock('@/features/ocr', () => ({
  Camera: jest.fn(() => null),
}))

describe('<CameraScreen />', () => {
  it('renders a wrapper View with Camera inside', () => {
    const { getByTestId } = render(<CameraScreen />)

    expect(getByTestId('camera-screen')).toBeOnTheScreen()
    expect(Camera).toHaveBeenCalled()
  })
})
