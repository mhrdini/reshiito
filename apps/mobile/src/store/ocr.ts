import { create } from 'zustand'

interface OCRState {
  response: string
  setResponse: (response: string) => void
}

export const useOCRStore = create<OCRState>(set => ({
  response: '',
  setResponse: response => set({ response }),
}))
