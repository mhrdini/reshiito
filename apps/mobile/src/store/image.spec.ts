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
    const newImage = { uri: 'uri1', width: 100, height: 200, base64: 'abc' }

    act(() => store.setImage(newImage))

    const updated = useImageStore.getState()
    expect(updated.image).toEqual(newImage)
    expect(updated.size).not.toBeNull()
  })

  it('setCapturedImage updates capturedImage and capturedSize', () => {
    const captured = { uri: 'uri2', width: 50, height: 50, base64: 'xyz' }

    act(() => store.setCapturedImage(captured))

    const updated = useImageStore.getState()
    expect(updated.capturedImage).toEqual(captured)
    expect(updated.capturedSize).not.toBeNull()
  })

  it('clearImage resets image and size', () => {
    act(() => store.setImage({ uri: 'x', width: 10, height: 10, base64: 'a' }))

    act(() => store.clearImage())

    const updated = useImageStore.getState()
    expect(updated.image).toBeNull()
    expect(updated.size).toBeNull()
  })

  it('clearCapturedImage resets capturedImage and capturedSize', () => {
    act(() =>
      store.setCapturedImage({ uri: 'y', width: 20, height: 20, base64: 'b' }),
    )

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
