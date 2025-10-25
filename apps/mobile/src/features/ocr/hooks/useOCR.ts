import { useCallback } from 'react'
import { usePerformOCRMutation } from '@/features/ocr/ocr.query'
import { ocr as ocrConfig } from '@config/shared'
import { OCRRequest } from 'types/schemas'

export const useOCR = () => {
  const {
    mutateAsync: performOCR,
    isPending,
    isSuccess,
  } = usePerformOCRMutation()

  const selectLanguage = () => ocrConfig.languages['japanese']

  const prepareRequest = useCallback(
    (b64: string): OCRRequest => ({
      b64,
      lang: selectLanguage(),
    }),
    [],
  )

  const extractText = useCallback(
    async (b64: string) => {
      try {
        const req = prepareRequest(b64)
        const res = await performOCR(req)
        return res.text
      } catch (err) {
        console.error('OCR text extraction failed:', err)
      }
    },
    [performOCR, prepareRequest],
  )

  return { extractText, isPending, isSuccess }
}
