import { api } from '@/config/api'
import { OCRResponse } from 'types/schemas'

export const checkOcrService = async (): Promise<OCRResponse> => {
  return api.get('ocr').json()
}
