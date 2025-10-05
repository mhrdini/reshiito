import type { ImageProps as ExpoImageProps } from 'expo-image'
import React from 'react'
import { Image as ExpoImage } from 'expo-image'
import { cssInterop } from 'nativewind'
import { cn } from 'ui/utils'

interface ImageProps extends ExpoImageProps {
  className?: string
}

cssInterop(ExpoImage, {
  className: 'style',
})

export const Image = React.forwardRef<
  React.ComponentRef<typeof ExpoImage>,
  ImageProps
>(({ className, ...props }, ref) => {
  return <ExpoImage ref={ref} className={cn(className)} {...props} />
})

Image.displayName = 'Image'
