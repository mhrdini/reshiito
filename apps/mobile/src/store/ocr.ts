import { create } from 'zustand'

interface OCRState {
  result: string
  setResult: (result: string) => void
}

export const useOCRStore = create<OCRState>(set => ({
  result: '',
  setResult: result => set({ result }),
}))
