import type { ViewProps as RNViewProps } from 'react-native'
import React from 'react'
import { View as ReactNativeView } from 'react-native'
import { cn } from '@ui/utils'
import { cssInterop } from 'nativewind'

interface ViewProps extends RNViewProps {
  children?: React.ReactNode
  className?: string
}

cssInterop(ReactNativeView, {
  className: 'style',
})

export const View = React.forwardRef<
  React.ComponentRef<typeof ReactNativeView>,
  ViewProps
>(({ children, className, ...props }, ref) => {
  return (
    <ReactNativeView ref={ref} className={cn(className)} {...props}>
      {children}
    </ReactNativeView>
  )
})

View.displayName = 'View'
