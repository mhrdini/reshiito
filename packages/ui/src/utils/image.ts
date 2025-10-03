import { Dimensions } from 'react-native'

export type ImageSize = { height: number; width: number }

export function getPaddedImageSize(
  height: number,
  width: number,
  padding = 40, // in pixels
): ImageSize {
  const aspectRatio = height / width
  const maxWidth = Dimensions.get('screen').width - padding
  if (width <= maxWidth)
    return { height: maxWidth * aspectRatio, width: maxWidth }
  const sizeMultiplier = maxWidth / width
  return { height: height * sizeMultiplier, width: maxWidth }
}
