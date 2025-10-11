import { MOCK_IMAGE } from '@/constants'
import { usePerformOCRMutation } from '@/features/ocr/ocr.query'
import { act, renderHook } from '@testing-library/react-native'
import { OCRRequest } from 'types/schemas'

import { useOCR } from '../useOCR'

jest.mock('@/features/ocr/ocr.query')
const mockMutateAsync = jest.fn<Promise<{ text: string }>, [OCRRequest]>()

const mockedUsePerformOCRMutation = usePerformOCRMutation as jest.Mock
mockedUsePerformOCRMutation.mockReturnValue({
  mutateAsync: mockMutateAsync,
  isPending: false,
  isSuccess: false,
})

describe('useOCR hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls performOCR and returns the extracted text', async () => {
    mockMutateAsync.mockResolvedValue({ text: 'Hello OCR' })

    const { result } = renderHook(() => useOCR())

    const text = await act(async () =>
      result.current.extractText(MOCK_IMAGE.base64!),
    )

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ b64: MOCK_IMAGE.base64 }),
    )
    expect(text).toBe('Hello OCR')
  })
})
