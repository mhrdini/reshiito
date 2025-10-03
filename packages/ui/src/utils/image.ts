import { Dimensions } from 'react-native'

export type ImageSize = { height: number; width: number }

export function getPaddedImageSize(
  height: number,
  width: number,
  // in pixels
  paddingY = 40,
  paddingX = 150,
): ImageSize {
  const aspectRatio = height / width
  const maxWidth = Dimensions.get('screen').width - paddingX
  const maxHeight = Dimensions.get('screen').height - paddingY
  if (height <= maxHeight && width <= maxWidth) return { height, width }
  if (height > maxHeight) {
    const sizeMinimiser = maxHeight / height
    height = maxHeight
    width = width * sizeMinimiser
  }
  if (width <= maxWidth)
    return { height: maxWidth * aspectRatio, width: maxWidth }
  const sizeMultiplier = maxWidth / width
  return { height: height * sizeMultiplier, width: maxWidth }
}
