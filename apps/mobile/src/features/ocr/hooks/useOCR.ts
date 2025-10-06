import { useEffect } from 'react'
import { checkOcrService } from '@/features/ocr/services/api'
import { useOCRStore } from '@/store'

export const useOCR = () => {
  const { setResponse } = useOCRStore()

  useEffect(() => {
    async function getOcr() {
      const response = await checkOcrService()
      const result = response.text
      return result
    }

    getOcr().then(response => setResponse(response))
  }, [setResponse])

  return
}
