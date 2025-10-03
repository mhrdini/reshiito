import type { ImagePickerAsset } from 'expo-image-picker'
import { getPaddedImageSize, ImageSize } from '@ui/utils'
import { create } from 'zustand'

interface ImageState {
  image: ImagePickerAsset | null
  size: ImageSize | null
  setImage: (image: ImagePickerAsset) => void
}

export const useImageStore = create<ImageState>(set => ({
  image: null,
  size: null,
  setImage: image =>
    set({ image, size: getPaddedImageSize(image.height, image.width) }),
}))
