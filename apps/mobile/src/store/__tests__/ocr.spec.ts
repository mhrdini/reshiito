import { MOCK_OCR_TEXT } from '@/constants'
import { useOCRStore } from '@/store'
import { act } from '@testing-library/react-native'

describe('useOCRStore', () => {
  let store: ReturnType<typeof useOCRStore.getState>

  beforeEach(() => {
    store = useOCRStore.getInitialState()
  })

  it('initializes with null values', () => {
    expect(store.result).toBe('')
  })

  it('setResult updates result', () => {
    const newResult = MOCK_OCR_TEXT

    act(() => store.setResult(newResult))

    const updated = useOCRStore.getState()
    expect(updated.result).toEqual(newResult)
  })
})
