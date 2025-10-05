import type { TextProps as RNTextProps } from 'react-native'
import React from 'react'
import { Text as ReactNativeText } from 'react-native'
import { cssInterop } from 'nativewind'
import { cn } from 'ui/utils'

interface TextProps extends RNTextProps {
  children?: React.ReactNode
  className?: string
}

cssInterop(ReactNativeText, {
  className: 'style',
})

export const Text = React.forwardRef<
  React.ComponentRef<typeof ReactNativeText>,
  TextProps
>(({ children, className, ...props }, ref) => {
  return (
    <ReactNativeText
      ref={ref}
      className={cn('text-black dark:text-white', className)}
      {...props}
    >
      {children}
    </ReactNativeText>
  )
})

Text.displayName = 'Text'
