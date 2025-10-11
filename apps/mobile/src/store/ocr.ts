import { create, StateCreator } from 'zustand'

interface OCRState {
  result: string
  setResult: (result: string) => void
}

export const ocrStoreCreator: StateCreator<OCRState> = set => ({
  result: '',
  setResult: result => set({ result }),
})

export const useOCRStore = create<OCRState>()(ocrStoreCreator)
