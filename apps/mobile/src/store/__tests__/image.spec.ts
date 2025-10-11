import { MOCK_IMAGE } from '@/constants'
import { useImageStore } from '@/store'
import { act } from '@testing-library/react-native'

describe('useImageStore', () => {
  let store: ReturnType<typeof useImageStore.getState>

  beforeEach(() => {
    store = useImageStore.getInitialState()
  })

  it('initializes with null values', () => {
    expect(store.image).toBeNull()
    expect(store.capturedImage).toBeNull()
    expect(store.size).toBeNull()
    expect(store.capturedSize).toBeNull()
    expect(store.isCameraReady).toBe(false)
  })

  it('setImage updates image and size', () => {
    const newImage = MOCK_IMAGE

    act(() => store.setImage(newImage))

    const updated = useImageStore.getState()
    expect(updated.image).toEqual(newImage)
    expect(updated.size).not.toBeNull()
  })

  it('setCapturedImage updates capturedImage and capturedSize', () => {
    const captured = MOCK_IMAGE

    act(() => store.setCapturedImage(captured))

    const updated = useImageStore.getState()
    expect(updated.capturedImage).toEqual(captured)
    expect(updated.capturedSize).not.toBeNull()
  })

  it('clearImage resets image and size', () => {
    act(() => store.setImage(MOCK_IMAGE))

    act(() => store.clearImage())

    const updated = useImageStore.getState()
    expect(updated.image).toBeNull()
    expect(updated.size).toBeNull()
  })

  it('clearCapturedImage resets capturedImage and capturedSize', () => {
    act(() => store.setCapturedImage(MOCK_IMAGE))

    act(() => store.clearCapturedImage())

    const updated = useImageStore.getState()
    expect(updated.capturedImage).toBeNull()
    expect(updated.capturedSize).toBeNull()
  })

  it('setIsCameraReady updates isCameraReady', () => {
    act(() => store.setIsCameraReady(true))
    expect(useImageStore.getState().isCameraReady).toBe(true)
  })
})
