import { Image, ImageSize } from 'types'
import { getPaddedImageSize } from 'ui/utils'
import { create } from 'zustand'

interface ImageState {
  image: Image | null
  capturedImage: Image | null
  size: ImageSize | null
  capturedSize: ImageSize | null
  setImage: (image: Image) => void
  setCapturedImage: (image: Image | null) => void
  isCameraReady: boolean
  setIsCameraReady: (ready: boolean) => void
}

export const useImageStore = create<ImageState>(set => ({
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
  isCameraReady: false,
  setIsCameraReady: ready => set({ isCameraReady: ready }),
}))
