import { Image, ImageSize } from 'types'
import { getPaddedImageSize } from 'ui/utils'
import { create, StateCreator } from 'zustand'

export interface ImageState {
  image: Image | null
  capturedImage: Image | null
  size: ImageSize | null
  capturedSize: ImageSize | null
  setImage: (image: Image) => void
  setCapturedImage: (image: Image | null) => void
  clearImage: () => void
  clearCapturedImage: () => void
  isCameraReady: boolean
  setIsCameraReady: (ready: boolean) => void
  clear: () => void
}

export const imageStoreCreator: StateCreator<ImageState> = set => ({
  image: null,
  capturedImage: null,
  size: null,
  capturedSize: null,
  setImage: image =>
    set({ image, size: getPaddedImageSize(image.height, image.width) }),
  setCapturedImage: image =>
    set({
      capturedImage: image,
      capturedSize: image
        ? getPaddedImageSize(image.height, image.width, 150, 150)
        : null,
    }),
  clearImage: () => set({ image: null, size: null }),
  clearCapturedImage: () => set({ capturedImage: null, capturedSize: null }),
  isCameraReady: false,
  setIsCameraReady: ready => set({ isCameraReady: ready }),
  clear: () =>
    set({
      image: null,
      capturedImage: null,
      size: null,
      capturedSize: null,
      isCameraReady: false,
    }),
})

export const useImageStore = create<ImageState>()(imageStoreCreator)
