import type { OCRRequest, OCRResponse } from 'types/schemas'
import { postOCR } from '@/features/ocr/services/api'
import { useMutation } from '@tanstack/react-query'

export const usePerformOCRMutation = () =>
  useMutation<OCRResponse, Error, OCRRequest>({
    mutationFn: data => postOCR(data),
  })
