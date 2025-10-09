import { api } from '@/lib/apiClient'
import { OCRRequest, OCRResponse } from 'types/schemas'

export const getOCR = async (): Promise<OCRResponse> => {
  return api.get('ocr').json()
}

export const postOCR = async (data: OCRRequest): Promise<OCRResponse> => {
  return api.post('ocr', { json: data }).json<OCRResponse>()
}
